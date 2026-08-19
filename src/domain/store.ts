import type { DataProvenance, OrganizationUnitType } from "@/domain/provenance";

export type StoreStatus = "ACTIVE" | "INACTIVE";

export type ManagerProfile = {
  id: string;
  name: string;
  phone: string;
  provenance: DataProvenance;
};

export type StoreProfile = {
  id: string;
  name: string;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  publicPhone: string | null;
  publicHours: string | null;
  unitType: OrganizationUnitType;
  status: StoreStatus;
  reportEnabled: boolean;
  timezone: string;
  dailyTarget: number;
  manager: ManagerProfile;
  sourceStatus: DataProvenance;
  notes: string | null;
  // TODO(ACAL-DATA): obter codigo_erp / codigo_bi / storeId corporativo.
  erpCode: null;
  biCode: null;
};

export function isReportableStore(store: StoreProfile): boolean {
  return (
    store.reportEnabled &&
    store.status === "ACTIVE" &&
    (store.unitType === "STORE" || store.unitType === "CONCEPT_STORE" || store.unitType === "SHOWROOM")
  );
}
