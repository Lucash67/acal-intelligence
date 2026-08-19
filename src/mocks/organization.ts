import type { DataProvenance } from "@/domain/provenance";

export const ORGANIZATION_PROFILE = {
  legalName: "ARAUJO CABRAL E ALVES LTDA",
  tradeName: "Acal Home Center",
  taxId: "07.201.916/0001-59",
  foundedYear: 1954,
  headquarters: "Rua Padre Cícero, 400, Rodolfo Teófilo, CEP 60430-585, Fortaleza/CE",
  state: "CE",
  timezone: "America/Fortaleza",
  phones: {
    sac: "(85) 3492-5001",
    sales: "(85) 3492-5000",
    companies: "(85) 3492-5010",
  },
  productName: "ACAL Intelligence",
  productNameStatus: "WORKING_TITLE" as const,
  provenance: "PUBLIC_CONFIRMED" as DataProvenance,
  notes: [
    "TODO(ACAL-BUSINESS): confirmar relação entre os 12 gerentes do spec e as unidades públicas.",
    "TODO(ACAL-DATA): obter código ERP/BI oficial de cada unidade.",
  ],
};
