import { databaseCollections, fakeApiConfig } from "../../types/config";

const DATABASE_VERSION_KEY = `${fakeApiConfig.databasePrefix}:version`;

export function exportDatabaseBackup(): string {
  const collections = Object.values(databaseCollections);

  const data: Record<string, unknown> = {};

  for (const collection of collections) {
    const key = `${fakeApiConfig.databasePrefix}:${collection}`;

    data[collection] = localStorage.getItem(key);
  }

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      databaseVersion: localStorage.getItem(DATABASE_VERSION_KEY),
      collections: data,
    },
    null,
    2,
  );
}
