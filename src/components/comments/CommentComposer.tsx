"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import CommentAvatar from "@/components/comments/CommentAvatar";
import CommentProfileSetupModal from "@/components/comments/CommentProfileSetupModal";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { KullaniciOzeti } from "@/types/auth";
import {
  isProfileComplete,
  type CommentIdentityType,
  type CommentSubmitOptions,
  type UserProfile,
} from "@/types/comments";

type CommentComposerProps = {
  user: KullaniciOzeti;
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (content: string, options?: CommentSubmitOptions) => Promise<{ ok: boolean; message: string }>;
  onCancel?: () => void;
  compact?: boolean;
};

const USERNAME_TAKEN_MESSAGE =
  "Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı belirleyin.";

const IDENTITY_OPTIONS: {
  value: CommentIdentityType;
  label: string;
  description: (profile: UserProfile) => string;
}[] = [
  {
    value: "full_name",
    label: "Gerçek İsmim ile paylaş",
    description: (profile) => profile.full_name?.trim() || "—",
  },
  {
    value: "username",
    label: "Kullanıcı Adım ile paylaş",
    description: (profile) => profile.username?.trim() || "—",
  },
  {
    value: "anonymous",
    label: "Gizli Kullanıcı",
    description: () => "Yorumunuz Gizli Kullanıcı olarak görünür",
  },
];

function isUsernameUniqueViolation(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;

  if (error.code === "23505") {
    return true;
  }

  const message = error.message?.toLowerCase() ?? "";
  return (
    message.includes("duplicate key value violates unique constraint") &&
    message.includes("username")
  );
}

export default function CommentComposer({
  user,
  placeholder = "Yorumunuzu yazın...",
  submitLabel = "Yorum Yap",
  onSubmit,
  onCancel,
  compact = false,
}: CommentComposerProps) {
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );

  const [content, setContent] = useState("");
  const [identityType, setIdentityType] = useState<CommentIdentityType>("full_name");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [setupFullName, setSetupFullName] = useState("");
  const [setupUsername, setSetupUsername] = useState("");
  const [setupSaving, setSetupSaving] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupUsernameError, setSetupUsernameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!supabase) {
      setProfile(null);
      setProfileLoading(false);
      setProfileModalOpen(true);
      return;
    }

    setProfileLoading(true);

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setProfile(null);
      setProfileLoading(false);
      setProfileModalOpen(true);
      return;
    }

    const loadedProfile: UserProfile = {
      full_name: data?.full_name?.trim() || null,
      username: data?.username?.trim() || null,
    };

    setProfile(loadedProfile);
    setSetupFullName(loadedProfile.full_name || `${user.firstName} ${user.lastName}`.trim());
    setSetupUsername(loadedProfile.username || user.username || user.email.split("@")[0] || "");
    setProfileLoading(false);

    if (!isProfileComplete(loadedProfile)) {
      setProfileModalOpen(true);
    }
  }, [supabase, user.email, user.firstName, user.id, user.lastName, user.username]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadProfile();
    });
  }, [loadProfile]);

  const handleSetupFullNameChange = (value: string) => {
    setSetupFullName(value);
    setSetupError(null);
  };

  const handleSetupUsernameChange = (value: string) => {
    setSetupUsername(value);
    setSetupUsernameError(null);
    setSetupError(null);
  };

  const handleProfileSetupSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    const nextFullName = setupFullName.trim();
    const nextUsername = setupUsername.trim();

    if (!nextFullName || !nextUsername) {
      setSetupError("Lütfen gerçek isim ve kullanıcı adını girin.");
      return;
    }

    setSetupSaving(true);
    setSetupError(null);
    setSetupUsernameError(null);

    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      const saveResult = existingProfile
        ? await supabase
            .from("profiles")
            .update({
              full_name: nextFullName,
              username: nextUsername,
            })
            .eq("id", user.id)
        : await supabase.from("profiles").insert({
            id: user.id,
            full_name: nextFullName,
            username: nextUsername,
          });

      if (saveResult.error) {
        if (isUsernameUniqueViolation(saveResult.error)) {
          setSetupUsernameError(USERNAME_TAKEN_MESSAGE);
          return;
        }

        setSetupError(saveResult.error.message);
        return;
      }

      const savedProfile: UserProfile = {
        full_name: nextFullName,
        username: nextUsername,
      };

      setProfile(savedProfile);
      setProfileModalOpen(false);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Profil kaydedilirken beklenmeyen bir hata oluştu.";

      if (isUsernameUniqueViolation({ message })) {
        setSetupUsernameError(USERNAME_TAKEN_MESSAGE);
      } else {
        setSetupError(message);
      }
    } finally {
      setSetupSaving(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim() || submitting || profileLoading) return;

    if (!isProfileComplete(profile)) {
      setProfileModalOpen(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await onSubmit(content, {
      identityType,
    });

    setSubmitting(false);

    if (result.ok) {
      setContent("");
      onCancel?.();
    } else {
      setError(result.message);
    }
  };

  const previewName =
    identityType === "anonymous"
      ? "Gizli Kullanıcı"
      : identityType === "full_name"
        ? profile?.full_name?.trim() || "—"
        : profile?.username?.trim() || "—";

  const canComment = isProfileComplete(profile) && !profileLoading;

  return (
    <>
      <form onSubmit={handleSubmit} className={`flex gap-3 ${compact ? "" : ""}`}>
        <CommentAvatar
          name={previewName}
          avatarUrl={identityType === "anonymous" ? null : user.avatarUrl}
        />
        <div className="flex-1 min-w-0">
          {!canComment && !profileLoading && (
            <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 font-medium">
              Yorum yapabilmek için profil bilgilerinizi tamamlayın.
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="ml-2 text-[#00519E] font-black underline underline-offset-2 cursor-pointer"
              >
                Profili tamamla
              </button>
            </div>
          )}

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={placeholder}
            rows={compact ? 2 : 3}
            disabled={!canComment || submitting}
            className="w-full resize-none rounded-xl border border-[#00519E]/20 bg-[#F8F9FA] px-4 py-3 text-sm text-[#0F365C] placeholder:text-[#00519E]/40 focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#F2A900]/30 transition-all disabled:opacity-60"
          />

          <fieldset className="mt-3 space-y-2" disabled={!canComment || submitting}>
            <legend className="text-xs font-bold text-[#0F365C] mb-2">Yorum Kimliği</legend>
            {IDENTITY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                  identityType === option.value
                    ? "border-[#00519E] bg-[#00519E]/5"
                    : "border-[#00519E]/15 bg-white hover:bg-[#F8F9FA]"
                }`}
              >
                <input
                  type="radio"
                  name={compact ? "reply-identity" : "comment-identity"}
                  value={option.value}
                  checked={identityType === option.value}
                  onChange={() => setIdentityType(option.value)}
                  className="mt-0.5 accent-[#00519E] cursor-pointer"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-black text-[#0F365C]">{option.label}</span>
                  <span className="block text-[11px] text-[#00519E]/70 mt-0.5">
                    {option.description(profile || { full_name: null, username: null })}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          {error && <p className="mt-2 text-xs text-red-600 font-semibold">{error}</p>}

          <div className="mt-3 flex items-center justify-end gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-bold text-[#00519E]/70 hover:text-[#0F365C] cursor-pointer transition-colors"
              >
                İptal
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim() || submitting || !canComment}
              className="px-5 py-2 rounded-xl bg-[#00519E] text-white text-xs font-black hover:bg-[#0F365C] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-300 cursor-pointer"
            >
              {submitting ? "Gönderiliyor..." : submitLabel}
            </button>
          </div>
        </div>
      </form>

      <CommentProfileSetupModal
        open={profileModalOpen}
        fullName={setupFullName}
        username={setupUsername}
        saving={setupSaving}
        error={setupError}
        usernameError={setupUsernameError}
        onFullNameChange={handleSetupFullNameChange}
        onUsernameChange={handleSetupUsernameChange}
        onSubmit={handleProfileSetupSubmit}
      />
    </>
  );
}
