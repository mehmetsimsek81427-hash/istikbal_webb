"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProfilePath } from "@/types/profile";

export default function ProfilRedirectPage() {
  const { kullanici, yukleniyorMu } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (yukleniyorMu) return;

    if (kullanici?.username) {
      router.replace(getProfilePath(kullanici.username));
      return;
    }

    router.replace("/giris?uyari=Bu%20sayfaya%20eri%C5%9Fmek%20i%C3%A7in%20giri%C5%9F%20yapmal%C4%B1s%C4%B1n%C4%B1z.&from=/profil");
  }, [kullanici, router, yukleniyorMu]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#00519E]/20 border-t-[#00519E] rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Yönlendiriliyor...</p>
    </div>
  );
}
