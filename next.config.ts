import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'dpgupggaudnvegctqici.supabase.co', // Your Supabase Project Host
      },
      {
        protocol: 'https',
        hostname: 'tripo-api-bucket.s3.amazonaws.com', // For 3D model previews if used
      }
    ],
  },
};

export default nextConfig;
