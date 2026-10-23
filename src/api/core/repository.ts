import { ApiError } from "./api-error";
import { simulateNetworkDelay } from "./delay";
import type {
  BaseEntity,
  CreateEntityInput,
  UpdateEntityInput,
} from "./entity.types";

import { readCollection, writeCollection } from "./local-storage";
import type { PaginatedResult, QueryOptions } from "./query.types";

function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value).toLowerCase();
  }

  return String(value).toLowerCase();
}

function compareValues(firstValue: unknown, secondValue: unknown): number {
  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return firstValue - secondValue;
  }

  const firstString = normalizeValue(firstValue);
  const secondString = normalizeValue(secondValue);

  return firstString.localeCompare(secondString);
}

function valuesAreEqual(entityValue: unknown, filterValue: unknown): boolean {
  if (Array.isArray(filterValue)) {
    return filterValue.some((value) => valuesAreEqual(entityValue, value));
  }

  if (typeof entityValue === "string" && typeof filterValue === "string") {
    return entityValue.toLowerCase() === filterValue.toLowerCase();
  }

  return entityValue === filterValue;
}

export class LocalStorageRepository<T extends BaseEntity> {
  private readonly collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private read(): T[] {
    return readCollection<T>(this.collectionName);
  }

  private write(data: T[]): void {
    writeCollection(this.collectionName, data);
  }

  async getAll(options: QueryOptions<T> = {}): Promise<PaginatedResult<T>> {
    await simulateNetworkDelay();

    const {
      search,
      searchFields = [],
      filters,
      sortBy,
      sortDirection = "asc",
      page = 1,
      pageSize = 10,
    } = options;

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);

    let records = [...this.read()];

    if (search?.trim() && searchFields.length > 0) {
      const normalizedSearch = search.trim().toLowerCase();

      records = records.filter((record) =>
        searchFields.some((field) => {
          const fieldValue = record[field];

          return normalizeValue(fieldValue).includes(normalizedSearch);
        }),
      );
    }

    if (filters) {
      records = records.filter((record) =>
        Object.entries(filters).every(([field, filterValue]) => {
          if (
            filterValue === undefined ||
            filterValue === null ||
            filterValue === ""
          ) {
            return true;
          }

          const recordValue = record[field as keyof T];

          return valuesAreEqual(recordValue, filterValue);
        }),
      );
    }

    if (sortBy) {
      records.sort((firstRecord, secondRecord) => {
        const comparison = compareValues(
          firstRecord[sortBy],
          secondRecord[sortBy],
        );

        return sortDirection === "asc" ? comparison : comparison * -1;
      });
    }

    const totalItems = records.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
    const normalizedPage = Math.min(safePage, totalPages);
    const startIndex = (normalizedPage - 1) * safePageSize;
    const data = records.slice(startIndex, startIndex + safePageSize);

    return {
      data,
      pagination: {
        page: normalizedPage,
        pageSize: safePageSize,
        totalItems,
        totalPages,
        hasNextPage: normalizedPage < totalPages,
        hasPreviousPage: normalizedPage > 1,
      },
    };
  }

  async getById(id: string): Promise<T> {
    await simulateNetworkDelay();

    const record = this.read().find((item) => item.id === id);

    if (!record) {
      throw new ApiError({
        code: "NOT_FOUND",
        status: 404,
        message: `Registo com id "${id}" não encontrado.`,
        details: {
          collection: this.collectionName,
          id,
        },
      });
    }

    return record;
  }

  async create(input: CreateEntityInput<T>): Promise<T> {
    await simulateNetworkDelay();

    const records = this.read();
    const id = input.id?.trim() || generateId();
    const duplicatedRecord = records.some((record) => record.id === id);

    if (duplicatedRecord) {
      throw new ApiError({
        code: "DUPLICATE_ID",
        status: 409,
        message: `Já existe um registo com o id "${id}".`,
      });
    }

    const currentDate = new Date().toISOString();

    const record = {
      ...input,
      id,
      createdAt: currentDate,
      updatedAt: currentDate,
    } as T;

    this.write([...records, record]);

    return record;
  }

  async update(id: string, input: UpdateEntityInput<T>): Promise<T> {
    await simulateNetworkDelay();

    const records = this.read();

    const recordIndex = records.findIndex((record) => record.id === id);

    if (recordIndex === -1) {
      throw new ApiError({
        code: "NOT_FOUND",
        status: 404,
        message: `Não foi possível atualizar o registo "${id}" porque ele não existe.`,
      });
    }

    const currentRecord = records[recordIndex];

    const updatedRecord = {
      ...currentRecord,
      ...input,
      id: currentRecord.id,
      createdAt: currentRecord.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const updatedRecords = [...records];
    updatedRecords[recordIndex] = updatedRecord;

    this.write(updatedRecords);

    return updatedRecord;
  }

  async remove(id: string): Promise<void> {
    await simulateNetworkDelay();

    const records = this.read();

    const recordExists = records.some((record) => record.id === id);

    if (!recordExists) {
      throw new ApiError({
        code: "NOT_FOUND",
        status: 404,
        message: `Não foi possível remover o registo "${id}" porque ele não existe.`,
      });
    }

    const filteredRecords = records.filter((record) => record.id !== id);

    this.write(filteredRecords);
  }

  async exists(id: string): Promise<boolean> {
    await simulateNetworkDelay();

    return this.read().some((record) => record.id === id);
  }

  async count(): Promise<number> {
    await simulateNetworkDelay();

    return this.read().length;
  }
}
