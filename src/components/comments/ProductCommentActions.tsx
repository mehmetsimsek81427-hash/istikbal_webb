"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CommentAuthPrompt from "@/components/comments/CommentAuthPrompt";

export default function ProductCommentActions() {
  const { kullanici, yukleniyorMu } = useAuth();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const scrollToComments = () => {
    document.getElementById("yorumlar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClick = () => {
    if (yukleniyorMu) return;
    if (!kullanici) {
      setAuthPromptOpen(true);
      return;
    }
    scrollToComments();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2A900] text-[#0F365C] text-sm font-black px-6 py-3 hover:bg-[#e09900] shadow-[0_4px_16px_rgba(242,169,0,0.35)] transition-all duration-300 cursor-pointer"
      >
        <span aria-hidden="true">💬</span>
        Yorum Yaz
      </button>
      <CommentAuthPrompt open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </>
  );
}
