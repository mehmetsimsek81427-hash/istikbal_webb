"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CommentAvatar from "@/components/comments/CommentAvatar";
import ProfileCommentTabs from "@/components/profile/ProfileCommentTabs";
import { useAuth } from "@/context/AuthContext";
import { useOwnProfile, usePublicProfileByUsername } from "@/hooks/useProfile";
import { useUserComments } from "@/hooks/useUserComments";
import type { KullaniciOzeti } from "@/types/auth";
import {
  formatProfileDisplayName,
  type DisplayPreference,
  type ProfileEditableFields,
  type ProfileRecord,
} from "@/types/profile";

type ProfilePageViewProps = {
  usernameSlug: string;
  initialTab?: string | null;
};

type ProfileTab = "info" | "about" | "comments";

const VALID_TABS: ProfileTab[] = ["info", "about", "comments"];

function parseTab(value: string | ProfileTab | null | undefined, isOwner: boolean): ProfileTab {
  if (value && VALID_TABS.includes(value as ProfileTab)) {
    const tab = value as ProfileTab;
    if (!isOwner && tab === "info") return "about";
    return tab;
  }
  return isOwner ? "info" : "about";
}

export default function ProfilePageView({ usernameSlug, initialTab = null }: ProfilePageViewProps) {
  const { kullanici } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const {
    profile: publicProfile,
    loading: publicLoading,
    error: publicError,
    notFound,
  } = usePublicProfileByUsername(usernameSlug);

  const isOwner = Boolean(kullanici && publicProfile && kullanici.id === publicProfile.id);

  const {
    profile: ownProfile,
    loading: ownLoading,
    error: ownError,
    updateProfile,
  } = useOwnProfile(isOwner ? kullanici?.id : undefined);

  const profile = isOwner && ownProfile ? ownProfile : publicProfile;
  const loading = publicLoading || (isOwner && ownLoading && !publicProfile);
  const error = publicError || (isOwner ? ownError : null);

  const [activeTab, setActiveTabState] = useState<ProfileTab>(() => parseTab(initialTab, false));
  const [commentTab, setCommentTab] = useState<"comments" | "replies">("comments");

  const resolvedTab = parseTab(activeTab, isOwner);

  const userId = profile?.id;
  const {
    topLevelComments,
    replies,
    loading: commentsLoading,
    loadingMore,
    error: commentsError,
    visibleCount,
    loadMore,
  } = useUserComments(userId);

  const displayName = useMemo(() => {
    if (!profile) return "—";
    return formatProfileDisplayName(profile.display_preference ?? "full_name", profile);
  }, [profile]);

  const commentsHasMore = visibleCount < topLevelComments.length;
  const repliesHasMore = visibleCount < replies.length;
  const tabHasMore = commentTab === "comments" ? commentsHasMore : repliesHasMore;

  const visibleComments = useMemo(
    () => topLevelComments.slice(0, visibleCount),
    [topLevelComments, visibleCount]
  );

  const visibleReplies = useMemo(
    () => replies.slice(0, visibleCount),
    [replies, visibleCount]
  );

  const setActiveTab = (tab: ProfileTab) => {
    setActiveTabState(tab);
    router.push(`${pathname}?tab=${tab}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00519E]/20 border-t-[#00519E] rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Profil yükleniyor...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
          Profil bulunamadı.
        </div>
        <Link href="/" className="inline-flex mt-4 text-sm font-black text-[#00519E] hover:text-[#F2A900] underline underline-offset-2">
          Anasayfaya dön
        </Link>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
          {error ?? "Profil yüklenemedi."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <section className="rounded-2xl shadow-[0_16px_40px_-12px_rgba(15,54,92,0.2)] overflow-hidden border border-[#00519E]/10 bg-white">
        <div className="bg-gradient-to-r from-[#0F365C] to-[#00519E] px-6 md:px-8 py-6 md:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CommentAvatar name={displayName} avatarUrl={profile.avatar_url} size="md" />
            <div className="min-w-0">
              <span className="inline-block bg-[#F2A900] text-[#0F365C] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                {isOwner ? "Profilim" : "Kullanıcı Profili"}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight break-words">
                {displayName}
              </h1>
              <p className="text-sm text-white/80 mt-1">
                @{profile.username} · Üyelik:{" "}
                {new Intl.DateTimeFormat("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date(profile.created_at))}
              </p>
            </div>
          </div>
          <div className="w-12 h-1 rounded-full bg-[#F2A900] mt-4 shadow-[0_0_8px_rgba(242,169,0,0.5)]" aria-hidden="true" />
        </div>

        <div className="px-4 md:px-6 pt-4 border-b border-[#00519E]/10 flex flex-wrap gap-2">
          {(isOwner
            ? ([
                ["info", "Bilgilerim"],
                ["about", "Hakkımda"],
                ["comments", "Yorumlar"],
              ] as const)
            : ([
                ["about", "Hakkımda"],
                ["comments", "Yorumlar"],
              ] as const)
          ).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all cursor-pointer ${
                resolvedTab === tab
                  ? "border-[#00519E] text-[#00519E]"
                  : "border-transparent text-[#00519E]/60 hover:text-[#00519E]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 bg-gradient-to-b from-[#F8F9FA] to-white space-y-6">
          {resolvedTab === "info" && isOwner && ownProfile && kullanici && (
            <ProfileOwnerForm
              key={ownProfile.id}
              ownProfile={ownProfile}
              kullanici={kullanici}
              updateProfile={updateProfile}
            />
          )}

          {resolvedTab === "about" && (
            <ProfileAboutSection
              bio={isOwner && ownProfile ? undefined : profile.bio}
              isOwner={isOwner}
              initialBio={ownProfile?.bio ?? ""}
              updateProfile={updateProfile}
            />
          )}

          {resolvedTab === "comments" && (
            <ProfileCommentTabs
              comments={visibleComments}
              replies={visibleReplies}
              activeTab={commentTab}
              onTabChange={setCommentTab}
              loading={commentsLoading}
              loadingMore={loadingMore}
              error={commentsError}
              hasMore={tabHasMore}
              onLoadMore={loadMore}
              emptyCommentsMessage={isOwner ? "Henüz yorum paylaşmadınız." : "Henüz yorum bulunmuyor."}
              emptyRepliesMessage={isOwner ? "Henüz yanıt paylaşmadınız." : "Henüz yanıt bulunmuyor."}
            />
          )}
        </div>
      </section>
    </div>
  );
}

type UpdateProfileFn = (fields: Partial<ProfileEditableFields> & { email?: string }) => Promise<{
  ok: boolean;
  message: string;
}>;

function ProfileOwnerForm({
  ownProfile,
  kullanici,
  updateProfile,
}: {
  ownProfile: ProfileRecord;
  kullanici: KullaniciOzeti;
  updateProfile: UpdateProfileFn;
}) {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({
    avatar_url: ownProfile.avatar_url ?? "",
    email: kullanici.email,
    phone: ownProfile.phone ?? "",
    address: ownProfile.address ?? "",
    website: ownProfile.website ?? "",
    social_instagram: ownProfile.social_instagram ?? "",
    social_twitter: ownProfile.social_twitter ?? "",
    social_facebook: ownProfile.social_facebook ?? "",
    display_preference: (ownProfile.display_preference ?? "full_name") as DisplayPreference,
  });

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    const result = await updateProfile({
      avatar_url: form.avatar_url,
      email: form.email,
      phone: form.phone,
      address: form.address,
      website: form.website,
      social_instagram: form.social_instagram,
      social_twitter: form.social_twitter,
      social_facebook: form.social_facebook,
      display_preference: form.display_preference,
    });

    setSaving(false);

    if (result.ok) setSaveMessage(result.message);
    else setSaveError(result.message);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-xl border border-[#00519E]/15 bg-white p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-[#0F365C]">Salt Okunur Bilgiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Ad" value={kullanici.firstName} />
          <ReadOnlyField label="Soyad" value={kullanici.lastName} />
          <ReadOnlyField label="Kullanıcı Adı" value={ownProfile.username} />
          <ReadOnlyField label="Gerçek İsim" value={ownProfile.full_name ?? ""} />
          <ReadOnlyField label="Doğum Tarihi" value={ownProfile.date_of_birth ?? "—"} />
          <ReadOnlyField label="Cinsiyet" value={ownProfile.gender ?? "—"} />
          <ReadOnlyField
            label="Kayıt Tarihi"
            value={new Intl.DateTimeFormat("tr-TR").format(new Date(ownProfile.created_at))}
          />
          <ReadOnlyField label="Kullanıcı ID" value={ownProfile.id} />
        </div>
      </div>

      <div className="rounded-xl border border-[#00519E]/15 bg-white p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-[#0F365C]">Düzenlenebilir Bilgiler</h2>

        <EditableField
          label="Profil Fotoğrafı URL"
          value={form.avatar_url}
          onChange={(v) => setForm((f) => ({ ...f, avatar_url: v }))}
          disabled={saving}
          placeholder="https://..."
        />

        <EditableField
          label="E-posta"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          disabled={saving}
          type="email"
        />

        <EditableField
          label="Telefon"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          disabled={saving}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#0F365C]">Adres</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            disabled={saving}
            rows={3}
            className="w-full resize-none rounded-xl border border-[#00519E]/20 bg-[#F8F9FA] px-4 py-2.5 text-sm text-[#0F365C] focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#F2A900]/30 disabled:opacity-60"
          />
        </div>

        <EditableField
          label="Kişisel Web Sitesi"
          value={form.website}
          onChange={(v) => setForm((f) => ({ ...f, website: v }))}
          disabled={saving}
        />

        <EditableField
          label="Instagram"
          value={form.social_instagram}
          onChange={(v) => setForm((f) => ({ ...f, social_instagram: v }))}
          disabled={saving}
        />

        <EditableField
          label="Twitter / X"
          value={form.social_twitter}
          onChange={(v) => setForm((f) => ({ ...f, social_twitter: v }))}
          disabled={saving}
        />

        <EditableField
          label="Facebook"
          value={form.social_facebook}
          onChange={(v) => setForm((f) => ({ ...f, social_facebook: v }))}
          disabled={saving}
        />

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold text-[#0F365C] mb-2">Görünen İsim Tercihi</legend>
          <label className="flex items-center gap-2 text-sm text-[#0F365C] cursor-pointer">
            <input
              type="radio"
              name="display_preference"
              checked={form.display_preference === "username"}
              onChange={() => setForm((f) => ({ ...f, display_preference: "username" }))}
              className="accent-[#00519E]"
            />
            Kullanıcı Adım (@{ownProfile.username})
          </label>
          <label className="flex items-center gap-2 text-sm text-[#0F365C] cursor-pointer">
            <input
              type="radio"
              name="display_preference"
              checked={form.display_preference === "full_name"}
              onChange={() => setForm((f) => ({ ...f, display_preference: "full_name" }))}
              className="accent-[#00519E]"
            />
            Gerçek İsmim ({ownProfile.full_name || "—"})
          </label>
        </fieldset>

        {saveMessage && <p className="text-xs text-green-700 font-semibold">{saveMessage}</p>}
        {saveError && <p className="text-xs text-red-600 font-semibold">{saveError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#00519E] text-white text-sm font-black px-5 py-3 hover:bg-[#0F365C] disabled:opacity-50 transition-all cursor-pointer"
        >
          {saving ? "Kaydediliyor..." : "Güncellemeleri Kaydet"}
        </button>
      </div>
    </form>
  );
}

function ProfileAboutSection({
  bio,
  isOwner,
  initialBio,
  updateProfile,
}: {
  bio?: string | null;
  isOwner: boolean;
  initialBio: string;
  updateProfile: UpdateProfileFn;
}) {
  const [bioDraft, setBioDraft] = useState(initialBio);
  const [savedBio, setSavedBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    const result = await updateProfile({ bio: bioDraft });
    setSaving(false);

    if (result.ok) {
      setSavedBio(bioDraft);
      setSaveMessage(result.message);
    } else {
      setSaveError(result.message);
    }
  };

  return (
    <div className="rounded-xl border border-[#00519E]/15 bg-white p-5 md:p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-black text-[#0F365C]">Hakkımda</h2>
      {isOwner ? (
        <form onSubmit={handleSave} className="space-y-4">
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value)}
            disabled={saving}
            rows={8}
            placeholder="Kendinizden bahsedin..."
            className="w-full resize-none rounded-xl border border-[#00519E]/20 bg-[#F8F9FA] px-4 py-3 text-sm text-[#0F365C] focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#F2A900]/30 disabled:opacity-60"
          />
          {saveMessage && <p className="text-xs text-green-700 font-semibold">{saveMessage}</p>}
          {saveError && <p className="text-xs text-red-600 font-semibold">{saveError}</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#F2A900] text-[#0F365C] text-sm font-black px-5 py-3 hover:bg-[#e09900] disabled:opacity-50 transition-all cursor-pointer"
          >
            {saving ? "Kaydediliyor..." : "Hakkımda Kaydet"}
          </button>
        </form>
      ) : (
        <div className="rounded-xl border border-[#00519E]/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#0F365C]/85 whitespace-pre-wrap">
          {bio?.trim() || savedBio.trim() || "Bu kullanıcı henüz hakkında bilgisi paylaşmamış."}
        </div>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#0F365C]">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded-xl border border-[#00519E]/15 bg-[#F8F9FA] px-4 py-2.5 text-sm text-[#0F365C]/70 cursor-not-allowed"
      />
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#0F365C]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#00519E]/20 bg-[#F8F9FA] px-4 py-2.5 text-sm text-[#0F365C] placeholder:text-[#00519E]/40 focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#F2A900]/30 disabled:opacity-60"
      />
    </div>
  );
}
