import { databaseCollections, fakeApiConfig } from "../types/config";
import { writeCollection } from "../api/core/local-storage";

import type { Appointment } from "../types/appointment.type";
import type { Doctor } from "../types/doctor.types";
import type { Patient } from "../types/patient.types";
import type { MedicalService } from "../types/services.types";
import type { User } from "../types/user.types";

const DATABASE_VERSION_KEY = `${fakeApiConfig.databasePrefix}:version`;

const seedDate = "2026-08-01T09:00:00.000Z";

const usersSeed: User[] = [
  {
    id: "user-admin-1",
    name: "Leonel César",
    email: "admin@clinic.pt",
    password: "123456",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "user-doctor-1",
    name: "Dra. Eloa Maria Neves César",
    email: "eloamaria@clinic.pt",
    password: "123456",
    role: "DOCTOR",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
];

const patientsSeed: Patient[] = [
  {
    id: "patient-1",
    name: "Rita da Costa César",
    email: "rita.cesar@email.pt",
    phone: "+351 912 345 678",
    birthDate: "1988-04-14",
    gender: "FEMALE",
    taxNumber: "245678901",
    healthNumber: "123456789",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "patient-2",
    name: "Adão Domingos",
    email: "adao.domingos@email.pt",
    phone: "+351 913 222 111",
    birthDate: "1975-09-22",
    gender: "MALE",
    taxNumber: "256789012",
    healthNumber: "987654321",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "patient-3",
    name: "Lanira Reis Brito Neves",
    email: "lanira.reis@email.pt",
    phone: "+351 914 555 123",
    birthDate: "1992-06-01",
    gender: "FEMALE",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
];

const doctorsSeed: Doctor[] = [
  {
    id: "doctor-1",
    name: "Dra. Henriqueta Bengui César",
    email: "henriqueta@clinic.pt",
    phone: "+351 211 000 101",
    licenseNumber: "OM-45678",
    specialty: "Cardiologia",
    status: "ACTIVE",
    consultationPrice: 85,
    schedule: [
      {
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        dayOfWeek: 3,
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        dayOfWeek: 5,
        startTime: "09:00",
        endTime: "13:00",
      },
    ],
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "doctor-2",
    name: "Dr. António Liquine Costa",
    email: "antonio.liquine@clinic.pt",
    phone: "+351 211 000 102",
    licenseNumber: "OM-78542",
    specialty: "Clínica Geral",
    status: "ACTIVE",
    consultationPrice: 60,
    schedule: [
      {
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "16:00",
      },
      {
        dayOfWeek: 2,
        startTime: "08:00",
        endTime: "16:00",
      },
      {
        dayOfWeek: 4,
        startTime: "08:00",
        endTime: "16:00",
      },
    ],
    createdAt: seedDate,
    updatedAt: seedDate,
  },
];

const medicalServicesSeed: MedicalService[] = [
  {
    id: "service-1",
    name: "Consulta de Cardiologia",
    description: "Avaliação cardiológica completa.",
    durationInMinutes: 45,
    price: 85,
    specialty: "Cardiologia",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "service-2",
    name: "Consulta de Clínica Geral",
    description: "Consulta médica de avaliação geral.",
    durationInMinutes: 30,
    price: 60,
    specialty: "Clínica Geral",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "service-3",
    name: "Eletrocardiograma",
    description: "Exame de avaliação da atividade elétrica cardíaca.",
    durationInMinutes: 20,
    price: 35,
    specialty: "Cardiologia",
    status: "ACTIVE",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
];

const appointmentsSeed: Appointment[] = [
  {
    id: "appointment-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    serviceId: "service-1",
    date: "2026-08-03",
    startTime: "09:00",
    endTime: "09:45",
    status: "CONFIRMED",
    reason: "Avaliação de palpitações.",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "appointment-2",
    patientId: "patient-2",
    doctorId: "doctor-2",
    serviceId: "service-2",
    date: "2026-08-03",
    startTime: "10:00",
    endTime: "10:30",
    status: "SCHEDULED",
    reason: "Consulta de rotina.",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "appointment-3",
    patientId: "patient-3",
    doctorId: "doctor-1",
    serviceId: "service-3",
    date: "2026-08-04",
    startTime: "11:00",
    endTime: "11:20",
    status: "SCHEDULED",
    reason: "Realização de eletrocardiograma.",
    createdAt: seedDate,
    updatedAt: seedDate,
  },
];

/**
 * Cria uma coleção apenas quando a respetiva chave
 * ainda não existe no localStorage.
 *
 * Uma coleção existente com [] é preservada.
 */
function seedCollection<T>(collection: string, records: T[]): void {
  const storageKey = `${fakeApiConfig.databasePrefix}:${collection}`;

  if (localStorage.getItem(storageKey) !== null) {
    return;
  }

  writeCollection(collection, records);
}

/**
 * Inicializa todas as coleções da Fake API.
 */
function initializeDatabase(): void {
  seedCollection(databaseCollections.users, usersSeed);
  seedCollection(databaseCollections.patients, patientsSeed);
  seedCollection(databaseCollections.doctors, doctorsSeed);
  seedCollection(databaseCollections.medicalServices, medicalServicesSeed);
  seedCollection(databaseCollections.appointments, appointmentsSeed);
}

/**
 * Verifica se já existem coleções armazenadas.
 * Isto permite distinguir uma instalação nova
 * de uma base de dados antiga sem chave de versão.
 */
function hasExistingDatabase(): boolean {
  return Object.values(databaseCollections).some((collection) => {
    const storageKey = `${fakeApiConfig.databasePrefix}:${collection}`;

    return localStorage.getItem(storageKey) !== null;
  });
}

/**
 * Inicializa a base de dados e verifica a sua versão.
 * Não executa migrações automaticamente.
 */

export function seedDatabase(): void {
  const storedVersionValue = localStorage.getItem(DATABASE_VERSION_KEY);
  const currentVersion = fakeApiConfig.databaseVersion;

  if (storedVersionValue === null) {
    if (hasExistingDatabase()) {
      throw new Error(
        "Foram encontrados dados existentes sem versão registada. " +
          "É necessário verificar a base de dados antes de a inicializar.",
      );
    }

    initializeDatabase();
    localStorage.setItem(DATABASE_VERSION_KEY, String(currentVersion));

    return;
  }

  const storedVersion = Number(storedVersionValue);

  if (!Number.isSafeInteger(storedVersion) || storedVersion < 1) {
    throw new Error(`Versão da base de dados inválida: ${storedVersionValue}`);
  }

  if (storedVersion === currentVersion) {
    return;
  }

  if (storedVersion > currentVersion) {
    throw new Error(
      "A versão da base de dados é superior à suportada pela aplicação.",
    );
  }

  throw new Error(
    `Migração da versão ${storedVersion} para ${currentVersion} ainda não implementada.`,
  );
}
