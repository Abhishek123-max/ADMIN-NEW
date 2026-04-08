/**
 * Turns relative asset paths from the API into absolute URLs using VITE_API_BASE_URL.
 * Same rules as banners: base ending in `/api` → use origin only for static files.
 */
export function resolveAssetUrl(imagePath: string | null | undefined): string {
  if (imagePath == null) return '';
  const trimmed = String(imagePath).trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim();
  if (!apiBase) return trimmed;

  const normalizedApiBase = apiBase.replace(/\/+$/, '');
  const originBase = normalizedApiBase.endsWith('/api')
    ? normalizedApiBase.slice(0, -4)
    : normalizedApiBase;

  if (trimmed.startsWith('/')) return `${originBase}${trimmed}`;
  return `${originBase}/${trimmed}`;
}
