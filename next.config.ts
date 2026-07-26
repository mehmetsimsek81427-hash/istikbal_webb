import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/demkamobilya";

const appRoutes = ["giris", "kayit", "sepetim", "profil", "siparislerim"];

const legacyRouteRedirects = appRoutes.flatMap((route) => [
  {
    source: `/${route}`,
    destination: `${basePath}/${route}`,
    permanent: false,
    basePath: false,
  },
  {
    source: `/${route}/:path*`,
    destination: `${basePath}/${route}/:path*`,
    permanent: false,
    basePath: false,
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
        permanent: false,
        basePath: false,
      },
      ...legacyRouteRedirects,
    ];
  },
};

export default nextConfig;
