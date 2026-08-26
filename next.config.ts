import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Proof media (video, audio, images, fonts) is large and effectively immutable.
        // Next serves /public with `Cache-Control: max-age=0, must-revalidate` by default,
        // so every visit revalidates these bytes. Give them a long cache with
        // stale-while-revalidate: repeat visits are instant, and an occasional file
        // update still propagates within a day.
        source: "/proof/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
