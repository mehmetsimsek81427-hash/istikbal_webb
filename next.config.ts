import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/demkamobilya";

const appRoutes = ["giris", "kayit", "profil", "profile", "kullanici", "kullanici-hakkinda", "urun"];

const legacyRouteRedirects = appRoutes.flatMap((route) => [
  {
    source: `/${route}`,
    destination: `${basePath}/${route}`,
    permanent: false as const,
    basePath: false as const,
  },
  {
    source: `/${route}/:path*`,
    destination: `${basePath}/${route}/:path*`,
    permanent: false as const,
    basePath: false as const,
  },
]);

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: basePath,
        permanent: false as const,
        basePath: false as const,
      },
      ...legacyRouteRedirects,
    ];
  },
};

export default nextConfig;
