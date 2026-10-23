/* export const fakeApiConfig = {
  databasePrefix: "lc-appointments-db",
  databaseVersion: 1,

  delay: {
    minimum: 500,
    maximum: 1000,
  },
} as const;

export const databaseCollections = {
  users: "users",
  patients: "patients",
  doctors: "doctors",
  appointments: "appointments",
  medicalServices: "medical-services",
} as const;

export type DatabaseCollection =
  (typeof databaseCollections)[keyof typeof databaseCollections]; */

export const fakeApiConfig = {
  databasePrefix: "lc-appointments-db",
  databaseVersion: 1,

  delay: {
    minimum: 500,
    maximum: 1000,
  },
} as const;

export const databaseCollections = {
  users: "users",
  patients: "patients",
  doctors: "doctors",
  appointments: "appointments",
  medicalServices: "medical-services",
} as const;

export type DatabaseCollection =
  (typeof databaseCollections)[keyof typeof databaseCollections];
