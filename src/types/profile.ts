export type DisplayPreference = "full_name" | "username";

export type ProfileRecord = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  date_of_birth: string | null;
  gender: string | null;
  display_preference: DisplayPreference;
  created_at: string;
};

export type PublicProfileRecord = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  display_preference: DisplayPreference;
  created_at: string;
};

export type ProfileEditableFields = {
  avatar_url: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  bio: string | null;
  display_preference: DisplayPreference;
};

export type UserCommentActivity = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  parentId: string | null;
  identityType: "full_name" | "username" | "anonymous";
  isAnonymous: boolean;
  displayName: string;
  authorUsername: string | null;
};

export const PROFILE_COMMENTS_PAGE_SIZE = 10;

export function encodeUsernameSlug(username: string): string {
  return encodeURIComponent(username.trim());
}

export function decodeUsernameSlug(slug: string): string {
  return decodeURIComponent(slug);
}

export function formatProfileDisplayName(
  preference: DisplayPreference,
  profile: { username?: string | null; full_name?: string | null }
): string {
  const username = profile.username?.trim().replace(/^@/, "") ?? "";
  const fullName = profile.full_name?.trim() ?? "";

  if (preference === "username") {
    return username ? `@${username}` : "—";
  }

  if (fullName && username) {
    return `${fullName} (@${username})`;
  }

  return fullName || (username ? `@${username}` : "—");
}

export function getProfilePath(username: string): string {
  return `/profil/${encodeUsernameSlug(username)}`;
}
