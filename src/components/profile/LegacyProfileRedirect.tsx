"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePublicProfile } from "@/hooks/useProfile";
import { getProfilePath } from "@/types/profile";

type LegacyProfileRedirectProps = {
  userId: string;
};

export default function LegacyProfileRedirect({ userId }: LegacyProfileRedirectProps) {
  const router = useRouter();
  const { profile, loading, error } = usePublicProfile(userId);

  useEffect(() => {
    if (loading) return;

    if (profile?.username) {
      router.replace(getProfilePath(profile.username));
      return;
    }

    if (error || !profile) {
      router.replace("/");
    }
  }, [profile, loading, error, router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#00519E]/20 border-t-[#00519E] rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Profil yönlendiriliyor...</p>
    </div>
  );
}
