const DEFAULT_STRAPI_URL = "http://127.0.0.1:1337";

function normalizeStrapiUrl(url?: string) {
  const value = url?.trim() || DEFAULT_STRAPI_URL;
  return value.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

export const STRAPI_URL = normalizeStrapiUrl(
  process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL
);

export function getStrapiMediaUrl(url?: string | null, fallback = "/placeholder-mate.jpg") {
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/") && !url.startsWith("/uploads/")) return url;
  return `${STRAPI_URL}${url.startsWith("/") ? url : `/${url}`}`;
}
