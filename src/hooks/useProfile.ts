"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  mapProfileRow,
  mapPublicProfileRow,
  PROFILE_SELECT_CORE,
  PROFILE_SELECT_FULL,
  PROFILE_SELECT_MINIMAL,
  PROFILE_SELECT_PUBLIC,
  PROFILE_SELECT_STANDARD,
  selectProfileRow,
} from "@/lib/profile-queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ProfileEditableFields, ProfileRecord, PublicProfileRecord } from "@/types/profile";
import { decodeUsernameSlug } from "@/types/profile";

const OWN_PROFILE_SELECTS = [
  PROFILE_SELECT_FULL,
  PROFILE_SELECT_STANDARD,
  PROFILE_SELECT_MINIMAL,
  PROFILE_SELECT_CORE,
];

const PUBLIC_PROFILE_SELECTS = [
  PROFILE_SELECT_PUBLIC,
  PROFILE_SELECT_MINIMAL,
  PROFILE_SELECT_CORE,
];

function formatProfileError(message: string): string {
  if (
    message.includes("bio") ||
    message.includes("phone") ||
    message.includes("address") ||
    message.includes("website") ||
    message.includes("social_") ||
    message.includes("display_preference") ||
    message.includes("orders")
  ) {
    return "Profil bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin.";
  }

  return message;
}

export function useOwnProfile(userId?: string) {
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!supabase || !userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { row, error: fetchError } = await selectProfileRow(
      supabase,
      OWN_PROFILE_SELECTS,
      (query) => query.eq("id", userId)
    );

    if (fetchError) {
      setError(formatProfileError(fetchError));
      setProfile(null);
      setLoading(false);
      return;
    }

    if (!row) {
      setProfile(null);
      setError("Profil bulunamadı.");
      setLoading(false);
      return;
    }

    setProfile(mapProfileRow(row));
    setError(null);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadProfile();
    });
  }, [loadProfile]);

  const updateProfile = useCallback(
    async (fields: Partial<ProfileEditableFields> & { email?: string }) => {
      if (!supabase || !userId) {
        return { ok: false, message: "Giriş gerekli." };
      }

      const profileUpdate: Record<string, unknown> = {};

      if (fields.avatar_url !== undefined) profileUpdate.avatar_url = fields.avatar_url?.trim() || null;
      if (fields.phone !== undefined) profileUpdate.phone = fields.phone?.trim() || null;
      if (fields.address !== undefined) profileUpdate.address = fields.address?.trim() || null;
      if (fields.website !== undefined) profileUpdate.website = fields.website?.trim() || null;
      if (fields.social_instagram !== undefined) {
        profileUpdate.social_instagram = fields.social_instagram?.trim() || null;
      }
      if (fields.social_twitter !== undefined) {
        profileUpdate.social_twitter = fields.social_twitter?.trim() || null;
      }
      if (fields.social_facebook !== undefined) {
        profileUpdate.social_facebook = fields.social_facebook?.trim() || null;
      }
      if (fields.bio !== undefined) profileUpdate.bio = fields.bio?.trim() || null;
      if (fields.display_preference !== undefined) {
        profileUpdate.display_preference = fields.display_preference;
      }

      if (Object.keys(profileUpdate).length > 0) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update(profileUpdate)
          .eq("id", userId);

        if (updateError) {
          const updatableOnly = { ...profileUpdate };
          delete updatableOnly.display_preference;
          delete updatableOnly.website;
          delete updatableOnly.social_instagram;
          delete updatableOnly.social_twitter;
          delete updatableOnly.social_facebook;

          if (Object.keys(updatableOnly).length > 0) {
            const { error: retryError } = await supabase
              .from("profiles")
              .update(updatableOnly)
              .eq("id", userId);

            if (retryError) {
              return { ok: false, message: formatProfileError(retryError.message) };
            }
          } else if (updateError.message.includes("does not exist")) {
            return { ok: false, message: formatProfileError(updateError.message) };
          } else {
            return { ok: false, message: formatProfileError(updateError.message) };
          }
        }
      }

      if (fields.email !== undefined && fields.email.trim()) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: fields.email.trim(),
        });

        if (emailError) {
          return { ok: false, message: emailError.message };
        }
      }

      await loadProfile();
      return { ok: true, message: "Profil güncellendi." };
    },
    [loadProfile, supabase, userId]
  );

  return {
    profile,
    loading,
    error,
    refresh: loadProfile,
    updateProfile,
  };
}

export function usePublicProfileByUsername(usernameSlug?: string) {
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );
  const [profile, setProfile] = useState<PublicProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const username = usernameSlug ? decodeUsernameSlug(usernameSlug).trim() : "";

  const loadProfile = useCallback(async () => {
    if (!supabase || !username) {
      setProfile(null);
      setLoading(false);
      setNotFound(!username);
      return;
    }

    setLoading(true);
    setNotFound(false);

    const { row, error: fetchError } = await selectProfileRow(
      supabase,
      PUBLIC_PROFILE_SELECTS,
      (query) => query.ilike("username", username)
    );

    if (fetchError) {
      setError(formatProfileError(fetchError));
      setProfile(null);
      setLoading(false);
      return;
    }

    if (!row) {
      const { row: exactRow, error: exactError } = await selectProfileRow(
        supabase,
        PUBLIC_PROFILE_SELECTS,
        (query) => query.eq("username", username)
      );

      if (exactError) {
        setError(formatProfileError(exactError));
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!exactRow) {
        setProfile(null);
        setError(null);
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(mapPublicProfileRow(exactRow));
      setError(null);
      setNotFound(false);
      setLoading(false);
      return;
    }

    setProfile(mapPublicProfileRow(row));
    setError(null);
    setNotFound(false);
    setLoading(false);
  }, [supabase, username]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadProfile();
    });
  }, [loadProfile]);

  return { profile, loading, error, notFound, refresh: loadProfile };
}

export function usePublicProfile(userId?: string) {
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );
  const [profile, setProfile] = useState<PublicProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!supabase || !userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { row, error: fetchError } = await selectProfileRow(
      supabase,
      PUBLIC_PROFILE_SELECTS,
      (query) => query.eq("id", userId)
    );

    if (fetchError) {
      setError(formatProfileError(fetchError));
      setProfile(null);
      setLoading(false);
      return;
    }

    if (!row) {
      setError("Kullanıcı bulunamadı.");
      setProfile(null);
      setLoading(false);
      return;
    }

    setProfile(mapPublicProfileRow(row));
    setError(null);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadProfile();
    });
  }, [loadProfile]);

  return { profile, loading, error, refresh: loadProfile };
}
