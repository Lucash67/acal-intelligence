export type AuthRole = "admin" | "preview";

const PREVIEW_PATHS = ["/", "/relatorios", "/lojas", "/indicadores", "/entregas"];

export function canAccessPath(role: AuthRole, pathname: string): boolean {
  if (role === "admin") return true;
  if (pathname.startsWith("/api/reports/")) return true;
  return PREVIEW_PATHS.some((path) => (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)));
}

export function isPreviewHref(href: string): boolean {
  return PREVIEW_PATHS.includes(href);
}
