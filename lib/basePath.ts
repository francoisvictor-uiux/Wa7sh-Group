/**
 * basePath / asset helpers — for raw <img> tags and other places where
 * Next.js can't auto-prefix the URL when the app is served from a
 * sub-directory (e.g. GitHub Pages at /Wa7sh-Group/).
 *
 * For <Link>, <a>, and Next's <Image> the prefix is applied automatically
 * via next.config.mjs `basePath`.
 */

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public-asset URL with the active basePath. */
export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${basePath}${path.startsWith("/") ? path : "/" + path}`;
}
