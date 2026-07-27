import type { DisplayPreference, ProfileRecord, PublicProfileRecord } from "@/types/profile";

export const PROFILE_SELECT_FULL =
  "id, username, full_name, avatar_url, bio, phone, address, website, social_instagram, social_twitter, social_facebook, date_of_birth, gender, display_preference, created_at";

export const PROFILE_SELECT_STANDARD =
  "id, username, full_name, avatar_url, bio, phone, address, is_admin";

export const PROFILE_SELECT_PUBLIC =
  "id, username, full_name, avatar_url, bio, display_preference, created_at";

export const PROFILE_SELECT_MINIMAL = "id, username, full_name, avatar_url, bio";

export const PROFILE_SELECT_CORE = "id, username, avatar_url, full_name";

export const PROFILE_COMMENT_JOIN =
  "id, username, full_name, avatar_url, display_preference";

export const PROFILE_COMMENT_JOIN_MINIMAL = "id, username, full_name, avatar_url";

type ProfileRow = Record<string, unknown>;

function isMissingColumnError(message: string): boolean {
  return message.includes("does not exist") || message.includes("42703");
}

export function isProfileSchemaError(message: string): boolean {
  return isMissingColumnError(message);
}

function readString(row: ProfileRow, key: string): string | null {
  const value = row[key];
  if (value == null || value === "") return null;
  return String(value);
}

export function mapProfileRow(row: ProfileRow): ProfileRecord {
  return {
    id: String(row.id),
    username: String(row.username ?? ""),
    full_name: readString(row, "full_name"),
    avatar_url: readString(row, "avatar_url"),
    bio: readString(row, "bio"),
    phone: readString(row, "phone"),
    address: readString(row, "address"),
    website: readString(row, "website"),
    social_instagram: readString(row, "social_instagram"),
    social_twitter: readString(row, "social_twitter"),
    social_facebook: readString(row, "social_facebook"),
    date_of_birth: readString(row, "date_of_birth"),
    gender: readString(row, "gender"),
    display_preference: (readString(row, "display_preference") as DisplayPreference | null) ?? "full_name",
    created_at: readString(row, "created_at") ?? new Date().toISOString(),
  };
}

export function mapPublicProfileRow(row: ProfileRow): PublicProfileRecord {
  const profile = mapProfileRow(row);
  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    display_preference: profile.display_preference,
    created_at: profile.created_at,
  };
}

export async function selectProfileRow(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  selects: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applyFilter: (query: any) => any
): Promise<{ row: ProfileRow | null; error: string | null }> {
  let lastError: string | null = null;

  for (const select of selects) {
    let query = supabase.from("profiles").select(select);
    query = applyFilter(query) as typeof query;

    const { data, error } = await query.maybeSingle();

    if (!error) {
      return { row: (data as ProfileRow | null) ?? null, error: null };
    }

    lastError = error.message;

    if (!isMissingColumnError(error.message)) {
      return { row: null, error: error.message };
    }
  }

  return { row: null, error: lastError };
}
