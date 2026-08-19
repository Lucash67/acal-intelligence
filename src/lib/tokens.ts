/**
 * Tokens oficiais usados pelos relatórios visuais (WhatsApp).
 * O dashboard troca de tema via `data-theme` em CSS; o card enviado
 * permanece no tema ACAL para reconhecimento da marca.
 *
 * `--acal-primary` foi amostrado do wordmark oficial da ACAL
 * (`public/brand/acal-logo-blue-alt.png` → #009CE0).
 *
 * TODO(ACAL-BRAND): validar códigos HEX oficiais da identidade visual da ACAL.
 * TODO(ACAL-BRAND): substituir tokens provisórios pelos códigos cromáticos oficiais do Brandbook ACAL 2024.
 */
export const tokens = {
  acalPrimary: "#009CE0",
  acalPrimaryLight: "#4DB8E8",
  acalPrimaryDark: "#0077AB",
  acalAccent: "#009CE0",
  backgroundPrimary: "#061018",
  backgroundSecondary: "#0A1620",
  surface: "#10202B",
  surfaceHover: "#162833",
  border: "#243644",
  borderStrong: "#314858",
  textPrimary: "#F3F7FA",
  textSecondary: "#8EA3B3",
  textSubtle: "#5E7382",
  success: "#3D9A6E",
  warning: "#D4A017",
  danger: "#D15B5B",
  radiusSm: "10px",
  radiusMd: "16px",
} as const;

export const tokenRgb = {
  acalPrimary: "0, 156, 224",
} as const;
