import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit. The homepage hero
      // upload goes straight through updateHomepageAction, so this must
      // clear Supabase Storage's 50,000,000-byte bucket cap plus
      // multipart/form-data boundary overhead, not just the raw file size.
      bodySizeLimit: "60mb",
    },
  },
};

export default nextConfig;
