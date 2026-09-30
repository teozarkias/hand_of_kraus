import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every `quality` value used by <Image> anywhere on the site has to be
    // listed here (required from Next.js 16; a warning before that).
    // 75 = Next's default (cart + admin thumbnails), 90 = the artwork.
    qualities: [75, 90],
    // Images uploaded through /admin are served from Supabase Storage, so
    // next/image needs permission to optimise images from there.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
