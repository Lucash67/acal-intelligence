import { env } from "@/lib/env";
import type { DataSourceProvider } from "@/providers/data-source/data-source-provider";
import { MockDataSourceProvider } from "@/providers/data-source/mock-data-source-provider";

export function getDataSourceProvider(): DataSourceProvider {
  if (env.dataSourceProvider !== "mock") {
    // TODO(ACAL-DATA): substituir pelo provider corporativo quando a fonte for definida.
  }

  return new MockDataSourceProvider();
}

export type { DataSourceProvider } from "@/providers/data-source/data-source-provider";
