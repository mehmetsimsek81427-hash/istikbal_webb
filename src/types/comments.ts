export type Profile = {
  id: string;
  username: string;
  full_name?: string | null;
  avatar_url: string | null;
  display_preference?: "full_name" | "username" | null;
};

export type CommentIdentityType = "full_name" | "username" | "anonymous";

export type CommentSubmitOptions = {
  identityType: CommentIdentityType;
};

export type ReactionType = "like" | "dislike";

export type CommentReaction = {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: ReactionType;
};

export type CommentRow = {
  id: string;
  user_id: string;
  product_id: string;
  content: string;
  parent_id: string | null;
  is_anonymous: boolean;
  identity_type: CommentIdentityType;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
  comment_reactions: CommentReaction[];
};

export type CommentNode = {
  id: string;
  userId: string;
  productId: string;
  content: string;
  parentId: string | null;
  isAnonymous: boolean;
  identityType: CommentIdentityType;
  createdAt: string;
  updatedAt: string;
  username: string;
  authorUsername: string | null;
  avatarUrl: string | null;
  likeCount: number;
  dislikeCount: number;
  userReaction: ReactionType | null;
  replies: CommentNode[];
};

export type UserProfile = {
  full_name: string | null;
  username: string | null;
};

export const COMMENTS_PAGE_SIZE = 10;

export function isProfileComplete(profile: UserProfile | null): boolean {
  return Boolean(profile?.full_name?.trim() && profile?.username?.trim());
}

export function normalizeCommentRows(data: unknown): CommentRow[] {
  if (!Array.isArray(data)) return [];

  return data.map((row) => {
    const record = row as Record<string, unknown>;
    const profiles = record.profiles;
    const reactions = record.comment_reactions;
    const isAnonymous = Boolean(record.is_anonymous);

    const identityType = record.identity_type
      ? (String(record.identity_type) as CommentIdentityType)
      : isAnonymous
        ? "anonymous"
        : "full_name";

    const profileRecord = Array.isArray(profiles)
      ? ((profiles[0] as Record<string, unknown> | undefined) ?? null)
      : ((profiles as Record<string, unknown> | null) ?? null);

    return {
      id: String(record.id),
      user_id: String(record.user_id),
      product_id: String(record.product_id),
      content: String(record.content),
      parent_id: record.parent_id ? String(record.parent_id) : null,
      is_anonymous: isAnonymous,
      identity_type: identityType,
      created_at: String(record.created_at),
      updated_at: String(record.updated_at),
      profiles: profileRecord
        ? {
            id: String(profileRecord.id),
            username: String(profileRecord.username ?? ""),
            full_name: profileRecord.full_name ? String(profileRecord.full_name) : null,
            avatar_url: profileRecord.avatar_url ? String(profileRecord.avatar_url) : null,
            display_preference: profileRecord.display_preference
              ? (String(profileRecord.display_preference) as "full_name" | "username")
              : null,
          }
        : null,
      comment_reactions: Array.isArray(reactions)
        ? (reactions as CommentReaction[])
        : [],
    };
  });
}

import { formatProfileDisplayName } from "./profile";

export function resolveCommentAuthorName(
  identityType: CommentIdentityType,
  profile: Profile | null
): string {
  if (identityType === "anonymous") return "Gizli Kullanıcı";
  if (!profile) return "—";

  const preference = profile.display_preference ?? "full_name";
  return formatProfileDisplayName(preference, profile);
}

export function mapCommentRow(row: CommentRow, currentUserId?: string): CommentNode {
  const reactions = row.comment_reactions ?? [];
  let likeCount = 0;
  let dislikeCount = 0;
  let userReaction: ReactionType | null = null;

  for (const reaction of reactions) {
    if (reaction.reaction_type === "like") likeCount += 1;
    if (reaction.reaction_type === "dislike") dislikeCount += 1;
    if (currentUserId && reaction.user_id === currentUserId) {
      userReaction = reaction.reaction_type;
    }
  }

  const isAnonymous = row.identity_type === "anonymous";

  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    content: row.content,
    parentId: row.parent_id,
    isAnonymous,
    identityType: row.identity_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    username: resolveCommentAuthorName(row.identity_type, row.profiles),
    authorUsername: row.is_anonymous || row.identity_type === "anonymous"
      ? null
      : row.profiles?.username?.trim() || null,
    avatarUrl: isAnonymous ? null : row.profiles?.avatar_url ?? null,
    likeCount,
    dislikeCount,
    userReaction,
    replies: [],
  };
}

export function buildCommentTree(rows: CommentRow[], currentUserId?: string): CommentNode[] {
  const nodes = new Map<string, CommentNode>();

  for (const row of rows) {
    nodes.set(row.id, mapCommentRow(row, currentUserId));
  }

  const roots: CommentNode[] = [];

  for (const node of nodes.values()) {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.replies.push(node);
    } else if (!node.parentId) {
      roots.push(node);
    }
  }

  const sortByNewest = (a: CommentNode, b: CommentNode) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  roots.sort(sortByNewest);
  for (const node of nodes.values()) {
    node.replies.sort(sortByNewest);
  }

  return roots;
}

export function formatCommentDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
