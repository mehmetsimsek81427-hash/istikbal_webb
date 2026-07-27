"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { resolveCommentAuthorName } from "@/types/comments";
import { PROFILE_COMMENTS_PAGE_SIZE, type UserCommentActivity } from "@/types/profile";

const USER_COMMENT_SELECT = `
  id,
  content,
  created_at,
  updated_at,
  product_id,
  parent_id,
  identity_type,
  is_anonymous,
  profiles ( id, username, full_name, avatar_url )
`;

function mapCommentRow(row: Record<string, unknown>): UserCommentActivity {
  const profiles = row.profiles;
  const profileRecord = Array.isArray(profiles)
    ? ((profiles[0] as Record<string, unknown> | undefined) ?? null)
    : ((profiles as Record<string, unknown> | null) ?? null);

  const identityType = String(row.identity_type ?? "full_name") as
    | "full_name"
    | "username"
    | "anonymous";
  const isAnonymous = Boolean(row.is_anonymous) || identityType === "anonymous";

  const profile = profileRecord
    ? {
        id: String(profileRecord.id),
        username: String(profileRecord.username ?? ""),
        full_name: profileRecord.full_name ? String(profileRecord.full_name) : null,
        avatar_url: profileRecord.avatar_url ? String(profileRecord.avatar_url) : null,
        display_preference: profileRecord.display_preference
          ? (String(profileRecord.display_preference) as "full_name" | "username")
          : null,
      }
    : null;

  return {
    id: String(row.id),
    content: String(row.content),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    productId: String(row.product_id),
    parentId: row.parent_id ? String(row.parent_id) : null,
    identityType,
    isAnonymous,
    displayName: resolveCommentAuthorName(identityType, profile),
    authorUsername: isAnonymous ? null : profile?.username?.trim() || null,
  };
}

export function useUserComments(userId?: string) {
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );
  const [allComments, setAllComments] = useState<UserCommentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PROFILE_COMMENTS_PAGE_SIZE);

  const loadComments = useCallback(async () => {
    if (!supabase || !userId) {
      setAllComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from("comments")
      .select(USER_COMMENT_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setAllComments([]);
      setLoading(false);
      return;
    }

    const rows = Array.isArray(data) ? data : [];
    setAllComments(rows.map((row) => mapCommentRow(row as Record<string, unknown>)));
    setVisibleCount(PROFILE_COMMENTS_PAGE_SIZE);
    setError(null);
    setLoading(false);
    setLoadingMore(false);
  }, [supabase, userId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadComments();
    });
  }, [loadComments]);

  const topLevelComments = useMemo(
    () => allComments.filter((comment) => !comment.parentId),
    [allComments]
  );

  const replies = useMemo(
    () => allComments.filter((comment) => Boolean(comment.parentId)),
    [allComments]
  );

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setVisibleCount((prev) => prev + PROFILE_COMMENTS_PAGE_SIZE);
    setLoadingMore(false);
  }, []);

  return {
    allComments,
    topLevelComments,
    replies,
    loading,
    loadingMore,
    error,
    visibleCount,
    loadMore,
    refresh: loadComments,
    hasMore: visibleCount < allComments.length,
  };
}
