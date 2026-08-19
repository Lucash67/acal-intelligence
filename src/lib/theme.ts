export const THEMES = ["light", "dark", "acal"] as const;

export type ThemeId = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "acal-theme";
export const DEFAULT_THEME: ThemeId = "acal";

export const THEME_OPTIONS: Array<{
  id: ThemeId;
  label: string;
  description: string;
}> = [
  {
    id: "light",
    label: "Claro",
    description: "Fundos claros e neutros, com o azul da marca só nos destaques.",
  },
  {
    id: "dark",
    label: "Escuro",
    description: "Navy marinho sofisticado para operação noturna.",
  },
  {
    id: "acal",
    label: "ACAL",
    description: "Azul bebê institucional como cor predominante da interface.",
  },
];

export function isThemeId(value: string | null): value is ThemeId {
  return value === "light" || value === "dark" || value === "acal";
}
