"use client";

import { useState } from "react";
import Link from "next/link";
import CommentAvatar from "@/components/comments/CommentAvatar";
import CommentComposer from "@/components/comments/CommentComposer";
import { formatCommentDate, type CommentNode, type CommentSubmitOptions, type ReactionType } from "@/types/comments";
import { getProfilePath } from "@/types/profile";
import type { KullaniciOzeti } from "@/types/auth";

type CommentItemProps = {
  comment: CommentNode;
  currentUser: KullaniciOzeti | null;
  depth?: number;
  onReply: (content: string, parentId: string, options?: CommentSubmitOptions) => Promise<{ ok: boolean; message: string }>;
  onEdit: (commentId: string, content: string) => Promise<{ ok: boolean; message: string }>;
  onDelete: (commentId: string) => Promise<{ ok: boolean; message: string }>;
  onReaction: (commentId: string, type: ReactionType) => Promise<{ ok: boolean; message: string }>;
  onAuthRequired: () => void;
};

export default function CommentItem({
  comment,
  currentUser,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  onAuthRequired,
}: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [busy, setBusy] = useState(false);
  const isOwner = currentUser?.id === comment.userId;
  const canDelete = isOwner || currentUser?.isAdmin === true;

  const handleReaction = async (type: ReactionType) => {
    if (!currentUser) {
      onAuthRequired();
      return;
    }
    setBusy(true);
    await onReaction(comment.id, type);
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Yorumu silmek istediğinize emin misiniz?")) return;
    setBusy(true);
    await onDelete(comment.id);
    setBusy(false);
  };

  const handleEditSave = async () => {
    if (!editContent.trim()) return;
    setBusy(true);
    const result = await onEdit(comment.id, editContent);
    setBusy(false);
    if (result.ok) setEditOpen(false);
  };

  return (
    <div className={`${depth > 0 ? "ml-4 md:ml-10 pl-4 border-l-2 border-[#F2A900]/40" : ""}`}>
      <article className="flex gap-3 py-5 group">
        <CommentAvatar
          name={comment.username}
          avatarUrl={comment.isAnonymous ? null : comment.avatarUrl}
          size={depth > 0 ? "sm" : "md"}
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {comment.isAnonymous || !comment.authorUsername ? (
              <span className="text-sm font-black text-[#0F365C]">{comment.username}</span>
            ) : (
              <Link
                href={getProfilePath(comment.authorUsername)}
                className="text-sm font-black text-[#0F365C] hover:text-[#00519E] hover:underline underline-offset-2 transition-colors"
              >
                {comment.username}
              </Link>
            )}
            <span className="text-xs text-[#00519E]/60 font-medium">{formatCommentDate(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-[10px] text-[#F2A900] font-semibold italic">(düzenlendi)</span>
            )}
          </div>

          {editOpen ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-[#00519E]/20 bg-[#F8F9FA] px-3 py-2 text-sm text-[#0F365C] focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#F2A900]/30"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={busy}
                  className="px-4 py-1.5 rounded-xl bg-[#00519E] text-white text-xs font-black cursor-pointer disabled:opacity-50 hover:bg-[#0F365C] transition-colors"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditOpen(false);
                    setEditContent(comment.content);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-[#00519E]/70 cursor-pointer hover:text-[#0F365C] transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-[#0F365C]/85 leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleReaction("like")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                comment.userReaction === "like"
                  ? "bg-[#00519E] text-white shadow-sm"
                  : "text-[#00519E]/70 bg-[#00519E]/5 hover:bg-[#00519E]/10 border border-[#00519E]/10"
              }`}
            >
              👍 {comment.likeCount > 0 && comment.likeCount}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleReaction("dislike")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                comment.userReaction === "dislike"
                  ? "bg-[#E30613]/10 text-[#E30613] border border-[#E30613]/20"
                  : "text-[#00519E]/70 bg-[#00519E]/5 hover:bg-[#00519E]/10 border border-[#00519E]/10"
              }`}
            >
              👎 {comment.dislikeCount > 0 && comment.dislikeCount}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  onAuthRequired();
                  return;
                }
                setReplyOpen((prev) => !prev);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#00519E] bg-[#F2A900]/15 hover:bg-[#F2A900]/30 border border-[#F2A900]/30 transition-all duration-200 cursor-pointer"
            >
              Yanıtla
            </button>
            {isOwner && (
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#00519E]/70 hover:bg-[#00519E]/5 border border-transparent hover:border-[#00519E]/15 transition-all cursor-pointer"
              >
                Düzenle
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#E30613] hover:bg-[#E30613]/5 border border-transparent hover:border-[#E30613]/20 transition-all cursor-pointer"
              >
                Sil
              </button>
            )}
          </div>

          {replyOpen && currentUser && (
            <div className="mt-4 p-3 rounded-xl bg-[#F8F9FA] border border-[#00519E]/10">
              <CommentComposer
                user={currentUser}
                placeholder="Yanıtınızı yazın..."
                submitLabel="Yanıtla"
                compact
                onCancel={() => setReplyOpen(false)}
                onSubmit={(content, options) => onReply(content, comment.id, options)}
              />
            </div>
          )}
        </div>
      </article>

      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUser={currentUser}
          depth={depth + 1}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onReaction={onReaction}
          onAuthRequired={onAuthRequired}
        />
      ))}
    </div>
  );
}
