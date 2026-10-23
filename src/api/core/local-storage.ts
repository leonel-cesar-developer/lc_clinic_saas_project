import { fakeApiConfig } from "../../types/config";
import { ApiError } from "./api-error";

function buildStorageKey(collection: string): string {
  return `${fakeApiConfig.databasePrefix}:${collection}`;
}

export function readCollection<T>(collection: string): T[] {
  const storageKey = buildStorageKey(collection);

  try {
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      throw new ApiError({
        code: "STORAGE_ERROR",
        status: 500,
        message: `Os dados da coleção "${collection}" são inválidos.`,
      });
    }

    return parsedValue as T[];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      code: "STORAGE_ERROR",
      status: 500,
      message: `Não foi possível ler a coleção "${collection}".`,
      details: {
        originalError: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export function writeCollection<T>(collection: string, data: T[]): void {
  const storageKey = buildStorageKey(collection);

  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    throw new ApiError({
      code: "STORAGE_ERROR",
      status: 500,
      message: `Não foi possível guardar a coleção "${collection}".`,
      details: {
        originalError: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

/* export function removeCollection(collection: string): void {
  const storageKey = buildStorageKey(collection);

  localStorage.removeItem(storageKey);
} */

export function removeCollection(collection: string): void {
  const storageKey = buildStorageKey(collection);

  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    throw new ApiError({
      code: "STORAGE_ERROR",
      status: 500,
      message: `Não foi possível remover a coleção "${collection}".`,
      details: {
        originalError: error instanceof Error ? error.message : String(error),
      },
    });
  }
}
