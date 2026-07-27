"use client";

import Link from "next/link";
import { formatCommentDate } from "@/types/comments";
import { getProductById } from "@/lib/products";
import { getProfilePath, type UserCommentActivity } from "@/types/profile";

type ProfileCommentTabsProps = {
  comments: UserCommentActivity[];
  replies: UserCommentActivity[];
  activeTab: "comments" | "replies";
  onTabChange: (tab: "comments" | "replies") => void;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  emptyCommentsMessage?: string;
  emptyRepliesMessage?: string;
};

export default function ProfileCommentTabs({
  comments,
  replies,
  activeTab,
  onTabChange,
  loading,
  loadingMore,
  error,
  hasMore,
  onLoadMore,
  emptyCommentsMessage = "Henüz yorum bulunmuyor.",
  emptyRepliesMessage = "Henüz yanıt bulunmuyor.",
}: ProfileCommentTabsProps) {
  const items = activeTab === "comments" ? comments : replies;
  const emptyMessage = activeTab === "comments" ? emptyCommentsMessage : emptyRepliesMessage;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onTabChange("comments")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "comments"
              ? "bg-[#00519E] text-white shadow-sm"
              : "bg-[#00519E]/5 text-[#00519E] hover:bg-[#00519E]/10 border border-[#00519E]/10"
          }`}
        >
          Yorumlar ({comments.length})
        </button>
        <button
          type="button"
          onClick={() => onTabChange("replies")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "replies"
              ? "bg-[#00519E] text-white shadow-sm"
              : "bg-[#00519E]/5 text-[#00519E] hover:bg-[#00519E]/10 border border-[#00519E]/10"
          }`}
        >
          Yanıtlar ({replies.length})
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[#00519E]/10 bg-white px-4 py-8 text-center text-sm text-[#00519E]/70 font-medium animate-pulse">
          Yükleniyor...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-[#00519E]/15 bg-white p-8 text-center text-sm text-[#00519E]/70 font-medium">
          {emptyMessage}
        </div>
      ) : (
        <div className="divide-y divide-[#00519E]/10 rounded-xl border border-[#00519E]/15 bg-white shadow-sm">
          {items.map((comment) => {
            const product = getProductById(comment.productId);

            return (
              <article key={comment.id} className="px-4 md:px-6 py-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                  <span className="text-xs font-black uppercase tracking-wide text-[#F2A900]">
                    {comment.parentId ? "Yanıt" : "Yorum"}
                  </span>
                  <span className="text-xs text-[#00519E]/60 font-medium">
                    {formatCommentDate(comment.createdAt)}
                  </span>
                </div>

                <p className="text-sm font-bold text-[#0F365C] mb-1">
                  <ProfileAuthorLink
                    displayName={comment.displayName}
                    authorUsername={comment.authorUsername}
                    isAnonymous={comment.isAnonymous}
                  />
                </p>

                <p className="text-sm text-[#0F365C]/85 leading-relaxed whitespace-pre-wrap break-words">
                  {comment.content}
                </p>

                <Link
                  href={`/urun/${comment.productId}#yorumlar`}
                  className="inline-flex mt-3 text-xs font-black text-[#00519E] hover:text-[#F2A900] underline underline-offset-2 transition-colors"
                >
                  {product?.name ?? "Ürün"} sayfasına git
                </Link>
              </article>
            );
          })}
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="rounded-xl border border-[#00519E]/20 text-[#00519E] text-xs font-black px-5 py-2.5 hover:bg-[#00519E]/5 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loadingMore ? "Yükleniyor..." : "Daha Fazla Göster"}
          </button>
        </div>
      )}
    </div>
  );
}

export function ProfileAuthorLink({
  displayName,
  authorUsername,
  isAnonymous,
}: {
  displayName: string;
  authorUsername: string | null;
  isAnonymous: boolean;
}) {
  if (isAnonymous || !authorUsername) {
    return <span className="text-sm font-black text-[#0F365C]">{displayName}</span>;
  }

  return (
    <Link
      href={getProfilePath(authorUsername)}
      className="text-sm font-black text-[#0F365C] hover:text-[#00519E] hover:underline underline-offset-2 transition-colors"
    >
      {displayName}
    </Link>
  );
}
