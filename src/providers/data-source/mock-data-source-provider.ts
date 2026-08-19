import type { ReportPeriod } from "@/domain/period";
import type { StoreRawData } from "@/domain/raw-data";
import { getMockStoreRawData } from "@/mocks/raw-data";
import type { DataSourceProvider } from "@/providers/data-source/data-source-provider";

export class MockDataSourceProvider implements DataSourceProvider {
  async getStoreData(
    storeId: string,
    period: ReportPeriod,
    referenceDate: string,
  ): Promise<StoreRawData> {
    return getMockStoreRawData(storeId, period, referenceDate);
  }
}

// TODO(ACAL-DATA): implementar SqlServerDataSourceProvider / PowerBIDataSourceProvider
// quando a origem oficial dos datasets do Power BI for definida.
