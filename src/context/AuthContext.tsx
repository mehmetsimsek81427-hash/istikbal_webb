"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { KayitVerisi, GirisVerisi, AuthYanit, KullaniciOzeti } from "@/types/auth";

interface AuthContextType {
  kullanici: KullaniciOzeti | null;
  yukleniyorMu: boolean;
  girisYap: (veri: GirisVerisi) => Promise<AuthYanit>;
  kayitOl: (veri: KayitVerisi) => Promise<AuthYanit>;
  cikisYap: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(user: User): KullaniciOzeti {
  const meta = user.user_metadata ?? {};
  const fullName = `${(meta.first_name as string) ?? ""} ${(meta.last_name as string) ?? ""}`.trim();

  return {
    id: user.id,
    email: user.email ?? "",
    firstName: (meta.first_name as string) ?? "",
    lastName: (meta.last_name as string) ?? "",
    username:
      (meta.username as string) ??
      (fullName || user.email?.split("@")[0] || "Kullanıcı"),
    avatarUrl: (meta.avatar_url as string) ?? null,
    isAdmin: false,
  };
}

async function enrichWithProfile(
  supabase: ReturnType<typeof createClient>,
  user: User
): Promise<KullaniciOzeti> {
  const base = mapSupabaseUser(user);
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    return {
      ...base,
      username: profile.username,
      avatarUrl: profile.avatar_url,
      isAdmin: profile.is_admin === true,
    };
  }

  return base;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [kullanici, setKullanici] = useState<KullaniciOzeti | null>(null);
  const [yukleniyorMu, setYukleniyorMu] = useState(isSupabaseConfigured());
  const router = useRouter();
  const supabase = useMemo(() => (isSupabaseConfigured() ? createClient() : null), []);

  useEffect(() => {
    if (!supabase) return;

    let active = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (session?.user) {
        const enriched = await enrichWithProfile(supabase, session.user);
        if (active) setKullanici(enriched);
      } else {
        setKullanici(null);
      }

      if (active) setYukleniyorMu(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (session?.user) {
        void enrichWithProfile(supabase, session.user).then((enriched) => {
          if (active) setKullanici(enriched);
        });
      } else {
        setKullanici(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const girisYap = useCallback(
    async (veri: GirisVerisi): Promise<AuthYanit> => {
      if (!supabase) {
        return { basarili: false, mesaj: "Supabase yapılandırması eksik." };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: veri.email.toLowerCase().trim(),
        password: veri.password,
      });

      if (error) {
        return { basarili: false, mesaj: error.message };
      }

      if (data.user) {
        const enriched = await enrichWithProfile(supabase, data.user);
        setKullanici(enriched);
        return { basarili: true, mesaj: "Giriş başarılı.", kullanici: enriched };
      }

      return { basarili: false, mesaj: "Giriş başarısız." };
    },
    [supabase]
  );

  const kayitOl = useCallback(
    async (veri: KayitVerisi): Promise<AuthYanit> => {
      if (!supabase) {
        return { basarili: false, mesaj: "Supabase yapılandırması eksik." };
      }

      const { data, error } = await supabase.auth.signUp({
        email: veri.email.toLowerCase().trim(),
        password: veri.password,
        options: {
          data: {
            first_name: veri.firstName.trim(),
            last_name: veri.lastName.trim(),
          },
        },
      });

      if (error) {
        return { basarili: false, mesaj: error.message };
      }

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          username: `${veri.firstName.trim()} ${veri.lastName.trim()}`.trim(),
          full_name: `${veri.firstName.trim()} ${veri.lastName.trim()}`.trim(),
          phone: veri.phone?.trim() || null,
          date_of_birth: veri.dateOfBirth || null,
          gender: veri.gender?.trim() || null,
        });

        if (data.session) {
          const enriched = await enrichWithProfile(supabase, data.user);
          setKullanici(enriched);
          return { basarili: true, mesaj: "Kayıt başarılı.", kullanici: enriched };
        }

        return {
          basarili: true,
          mesaj: "Kayıt başarılı! E-posta doğrulaması gerekebilir; ardından giriş yapabilirsiniz.",
        };
      }

      return { basarili: false, mesaj: "Kayıt başarısız." };
    },
    [supabase]
  );

  const cikisYap = useCallback(async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setKullanici(null);
    router.push("/");
    router.refresh();
  }, [router, supabase]);

  return (
    <AuthContext.Provider value={{ kullanici, yukleniyorMu, girisYap, kayitOl, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth bir AuthProvider içinde kullanılmalıdır!");
  }
  return context;
}
