"use client";

import Link from "next/link";
import { useEffect } from "react";

type CommentAuthPromptProps = {
  open: boolean;
  onClose: () => void;
};

export default function CommentAuthPrompt({ open, onClose }: CommentAuthPromptProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F365C]/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-auth-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-[0_24px_48px_-12px_rgba(15,54,92,0.45)] border border-[#00519E]/10 overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#0F365C] to-[#00519E] px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="comment-auth-title" className="text-xl font-black text-white">
              Yorum Yaz
            </h2>
            <div className="w-10 h-1 rounded-full bg-[#F2A900] mt-2 shadow-[0_0_8px_rgba(242,169,0,0.5)]" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer transition-colors"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-sm text-[#0F365C]/80 leading-relaxed mb-6 font-medium">
            Giriş yaparak yorum paylaşabilirsiniz.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/giris"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-[#00519E] text-white text-sm font-black py-3 px-4 hover:bg-[#0F365C] shadow-sm transition-all duration-300"
            >
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#F2A900] text-[#0F365C] text-sm font-black py-3 px-4 hover:bg-[#F2A900]/10 transition-all duration-300"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
