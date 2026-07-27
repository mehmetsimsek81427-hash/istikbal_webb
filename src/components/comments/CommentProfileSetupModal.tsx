"use client";

import { FormEvent, useEffect } from "react";

type CommentProfileSetupModalProps = {
  open: boolean;
  fullName: string;
  username: string;
  saving: boolean;
  error: string | null;
  usernameError: string | null;
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

export default function CommentProfileSetupModal({
  open,
  fullName,
  username,
  saving,
  error,
  usernameError,
  onFullNameChange,
  onUsernameChange,
  onSubmit,
}: CommentProfileSetupModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0F365C]/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-setup-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_24px_48px_-12px_rgba(15,54,92,0.45)] border border-[#00519E]/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0F365C] to-[#00519E] px-6 py-5">
          <h2 id="profile-setup-title" className="text-xl font-black text-white">
            Profil Bilgilerinizi Tamamlayın
          </h2>
          <div className="w-10 h-1 rounded-full bg-[#F2A900] mt-2 shadow-[0_0_8px_rgba(242,169,0,0.5)]" aria-hidden="true" />
        </div>

        <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-4">
          <p className="text-sm text-[#0F365C]/80 leading-relaxed font-medium">
            Yorum yapabilmek için profil bilgilerinizi tamamlayın. Bu bilgiler bir kez kaydedilir
            ve yorum kimliği seçeneklerinizde kullanılır.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="profile-full-name" className="block text-xs font-bold text-[#0F365C]">
              Gerçek İsim (Ad Soyad)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              disabled={saving}
              placeholder="Örn: Mehmet Yılmaz"
              className="w-full rounded-xl border border-[#00519E]/20 bg-[#F8F9FA] px-4 py-2.5 text-sm text-[#0F365C] placeholder:text-[#00519E]/40 focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#F2A900]/30 transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-username" className="block text-xs font-bold text-[#0F365C]">
              Kullanıcı Adı
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
              disabled={saving}
              placeholder="Örn: mehmet_yilmaz"
              className={`w-full rounded-xl border bg-[#F8F9FA] px-4 py-2.5 text-sm text-[#0F365C] placeholder:text-[#00519E]/40 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                usernameError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-[#00519E]/20 focus:border-[#00519E] focus:ring-[#F2A900]/30"
              }`}
            />
            {usernameError && (
              <p className="text-xs text-red-600 font-semibold">{usernameError}</p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-600 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving || !fullName.trim() || !username.trim()}
            className="w-full rounded-xl bg-[#00519E] text-white text-sm font-black py-3 hover:bg-[#0F365C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
          >
            {saving ? "Kaydediliyor..." : "Profili Kaydet ve Devam Et"}
          </button>
        </form>
      </div>
    </div>
  );
}
