import type { NextConfig } from "next";

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL;

function getRemotePattern(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: "/uploads/**",
    };
  } catch {
    return null;
  }
}

const strapiRemotePattern = getRemotePattern(strapiUrl);

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      ...(strapiRemotePattern ? [strapiRemotePattern] : []),
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
