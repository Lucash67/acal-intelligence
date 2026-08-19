import type { ReportPeriod } from "@/domain/period";
import type { StoreRawData } from "@/domain/raw-data";

export interface DataSourceProvider {
  getStoreData(storeId: string, period: ReportPeriod, referenceDate: string): Promise<StoreRawData>;
}
