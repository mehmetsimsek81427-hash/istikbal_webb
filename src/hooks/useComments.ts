"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  buildCommentTree,
  COMMENTS_PAGE_SIZE,
  normalizeCommentRows,
  type CommentRow,
  type ReactionType,
  type CommentSubmitOptions,
} from "@/types/comments";

const COMMENT_SELECT = `
  id,
  user_id,
  product_id,
  content,
  parent_id,
  is_anonymous,
  identity_type,
  created_at,
  updated_at,
  profiles ( id, username, full_name, avatar_url ),
  comment_reactions ( id, comment_id, user_id, reaction_type )
`;

export function useComments(productId: string, currentUserId?: string) {
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );
  const [rawRows, setRawRows] = useState<CommentRow[]>([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allComments = useMemo(
    () => buildCommentTree(rawRows, currentUserId),
    [rawRows, currentUserId]
  );

  const fetchComments = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError("Supabase yapılandırması eksik.");
      return;
    }

    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from("comments")
      .select(COMMENT_SELECT)
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setRawRows(normalizeCommentRows(data));
    setError(null);
    setLoading(false);
    setLoadingMore(false);
  }, [productId, supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchComments();
    });
  }, [fetchComments]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`comments:${productId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `product_id=eq.${productId}`,
        },
        () => {
          void fetchComments();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comment_reactions",
        },
        () => {
          void fetchComments();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchComments, productId, supabase]);

  const comments = useMemo(
    () => allComments.slice(0, visibleCount),
    [allComments, visibleCount]
  );

  const hasMore = visibleCount < allComments.length;

  const addComment = useCallback(
    async (
      content: string,
      parentId?: string | null,
      options?: CommentSubmitOptions
    ) => {
      if (!supabase || !currentUserId) return { ok: false, message: "Giriş gerekli." };

      const identityType = options?.identityType ?? "full_name";
      const isAnonymous = identityType === "anonymous";

      const { error: insertError } = await supabase.from("comments").insert({
        user_id: currentUserId,
        product_id: productId,
        content: content.trim(),
        parent_id: parentId ?? null,
        is_anonymous: isAnonymous,
        identity_type: identityType,
      });

      if (insertError) {
        return { ok: false, message: insertError.message };
      }

      await fetchComments();
      return { ok: true, message: "Yorum paylaşıldı." };
    },
    [currentUserId, fetchComments, productId, supabase]
  );

  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      if (!supabase || !currentUserId) return { ok: false, message: "Giriş gerekli." };

      const { error: updateError } = await supabase
        .from("comments")
        .update({ content: content.trim() })
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (updateError) {
        return { ok: false, message: updateError.message };
      }

      await fetchComments();
      return { ok: true, message: "Yorum güncellendi." };
    },
    [currentUserId, fetchComments, supabase]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!supabase || !currentUserId) return { ok: false, message: "Giriş gerekli." };

      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (deleteError) {
        return { ok: false, message: deleteError.message };
      }

      await fetchComments();
      return { ok: true, message: "Yorum silindi." };
    },
    [currentUserId, fetchComments, supabase]
  );

  const toggleReaction = useCallback(
    async (commentId: string, reactionType: ReactionType) => {
      if (!supabase || !currentUserId) return { ok: false, message: "Giriş gerekli." };

      const { data: existing } = await supabase
        .from("comment_reactions")
        .select("id, reaction_type")
        .eq("comment_id", commentId)
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (existing?.reaction_type === reactionType) {
        await supabase.from("comment_reactions").delete().eq("id", existing.id);
      } else if (existing) {
        await supabase
          .from("comment_reactions")
          .update({ reaction_type: reactionType })
          .eq("id", existing.id);
      } else {
        await supabase.from("comment_reactions").insert({
          comment_id: commentId,
          user_id: currentUserId,
          reaction_type: reactionType,
        });
      }

      await fetchComments();
      return { ok: true, message: "" };
    },
    [currentUserId, fetchComments, supabase]
  );

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setVisibleCount((prev) => prev + COMMENTS_PAGE_SIZE);
    setLoadingMore(false);
  }, [hasMore, loadingMore]);

  return {
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
    refresh: fetchComments,
  };
}
