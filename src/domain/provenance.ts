export const DATA_PROVENANCES = [
  "PUBLIC_CONFIRMED",
  "PUBLIC_INFERRED",
  "MOCK",
  "INTERNAL_PENDING",
  "INTERNAL_CONFIRMED",
  "CONFLICTING",
] as const;

export type DataProvenance = (typeof DATA_PROVENANCES)[number];

export const ORGANIZATION_UNIT_TYPES = [
  "STORE",
  "CONCEPT_STORE",
  "SHOWROOM",
  "ADMINISTRATION",
  "DISTRIBUTION_CENTER",
] as const;

export type OrganizationUnitType = (typeof ORGANIZATION_UNIT_TYPES)[number];

export function unitTypeLabel(type: OrganizationUnitType): string {
  switch (type) {
    case "STORE":
      return "Home Center";
    case "CONCEPT_STORE":
      return "Conceito";
    case "SHOWROOM":
      return "Showroom";
    case "ADMINISTRATION":
      return "Administração";
    case "DISTRIBUTION_CENTER":
      return "Centro de distribuição";
  }
}

export function provenanceLabel(value: DataProvenance): string {
  switch (value) {
    case "PUBLIC_CONFIRMED":
      return "Público confirmado";
    case "PUBLIC_INFERRED":
      return "Inferido";
    case "MOCK":
      return "Simulado";
    case "INTERNAL_PENDING":
      return "Pendente interno";
    case "INTERNAL_CONFIRMED":
      return "Interno confirmado";
    case "CONFLICTING":
      return "Conflitante";
  }
}
