"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useComments } from "@/hooks/useComments";
import CommentAuthPrompt from "@/components/comments/CommentAuthPrompt";
import CommentComposer from "@/components/comments/CommentComposer";
import CommentItem from "@/components/comments/CommentItem";
import CommentSkeleton from "@/components/comments/CommentSkeleton";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type CommentSectionProps = {
  productId: string;
};

export default function CommentSection({ productId }: CommentSectionProps) {
  const { kullanici, yukleniyorMu } = useAuth();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    comments,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    addComment,
    updateComment,
    deleteComment,
    toggleReaction,
  } = useComments(productId, kullanici?.id);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (!isSupabaseConfigured()) {
    return (
      <section
        id="yorumlar"
        className="rounded-2xl border border-[#F2A900]/40 bg-[#0F365C]/5 p-6 text-sm text-[#0F365C] font-medium"
      >
        Supabase ortam değişkenleri tanımlı değil. Lütfen .env dosyanıza NEXT_PUBLIC_SUPABASE_URL ve
        NEXT_PUBLIC_SUPABASE_ANON_KEY ekleyin.
      </section>
    );
  }

  return (
    <section
      id="yorumlar"
      className="scroll-mt-24 rounded-2xl shadow-[0_16px_40px_-12px_rgba(15,54,92,0.2)] overflow-hidden border border-[#00519E]/10 bg-white"
    >
      <div className="bg-gradient-to-r from-[#0F365C] to-[#00519E] px-6 md:px-8 py-6 md:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block bg-[#F2A900] text-[#0F365C] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
            Müşteri Deneyimi
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Müşteri Yorumları
          </h2>
          <div className="w-12 h-1 rounded-full bg-[#F2A900] mt-3 shadow-[0_0_8px_rgba(242,169,0,0.5)]" aria-hidden="true" />
        </div>
        {!kullanici && !yukleniyorMu && (
          <button
            type="button"
            onClick={() => setAuthPromptOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2A900] text-[#0F365C] text-sm font-black px-5 py-2.5 hover:bg-[#e09900] shadow-[0_4px_16px_rgba(242,169,0,0.35)] transition-all duration-300 cursor-pointer shrink-0"
          >
            <span aria-hidden="true">💬</span>
            Yorum Yaz
          </button>
        )}
      </div>

      <div className="p-6 md:p-8 bg-gradient-to-b from-[#F8F9FA] to-white">
        {!yukleniyorMu && kullanici && (
          <div className="mb-6 rounded-xl border border-[#00519E]/15 bg-white p-4 md:p-5 shadow-sm">
            <CommentComposer
              user={kullanici}
              onSubmit={(content, options) => addComment(content, undefined, options)}
            />
          </div>
        )}

        {!yukleniyorMu && !kullanici && (
          <div className="mb-6 rounded-xl border border-dashed border-[#00519E]/25 bg-[#00519E]/5 p-4 md:p-5 text-sm text-[#0F365C]/80">
            Yorumları okuyabilirsiniz. Yorum yazmak için{" "}
            <button
              type="button"
              onClick={() => setAuthPromptOpen(true)}
              className="text-[#00519E] font-black hover:text-[#F2A900] underline underline-offset-2 cursor-pointer transition-colors"
            >
              giriş yapın
            </button>
            .
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="divide-y divide-[#00519E]/10 rounded-xl border border-[#00519E]/10 bg-white px-4 md:px-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-[#00519E]/15 bg-white p-10 md:p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00519E]/10 text-3xl mb-4" aria-hidden="true">
              💬
            </div>
            <p className="text-lg font-black text-[#0F365C]">Henüz yorum yok</p>
            <p className="text-sm text-[#00519E]/70 mt-2 max-w-sm mx-auto">
              Bu ürün hakkında ilk yorumu siz paylaşın ve Demka Mobilya ailesine katkıda bulunun.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#00519E]/10 rounded-xl border border-[#00519E]/15 bg-white px-4 md:px-6 shadow-sm">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={kullanici}
                onReply={(content, parentId, options) => addComment(content, parentId, options)}
                onEdit={updateComment}
                onDelete={deleteComment}
                onReaction={toggleReaction}
                onAuthRequired={() => setAuthPromptOpen(true)}
              />
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="mt-4 rounded-xl border border-[#00519E]/10 bg-white px-4 md:px-6">
            <CommentSkeleton />
          </div>
        )}

        {hasMore && !loading && <div ref={loadMoreRef} className="h-8" aria-hidden="true" />}
      </div>

      <CommentAuthPrompt open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </section>
  );
}
