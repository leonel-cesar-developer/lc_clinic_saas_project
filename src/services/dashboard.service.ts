import { databaseCollections } from "../fake-api/database";
import { readCollection } from "../api/core/local-storage";

import type { Appointment } from "../types/appointment.type";
import type { Doctor } from "../types/doctor.types";
import type { Patient } from "../types/patient.types";
import type { MedicalService } from "../types/services.types";

import type {
  AppointmentStatusMetric,
  DashboardAlert,
  DashboardAppointment,
  DashboardAppointmentStatus,
  DashboardData,
  DoctorWorkloadItem,
  MonthlyActivityMetric,
  MonthlyRevenueMetric,
} from "../types/dashboard.types";

import { isFutureDate, isSameMonth, toDateKey } from "../utils/dashboard.utils";

const STATUS_LABELS: Record<DashboardAppointmentStatus, string> = {
  SCHEDULED: "Agendadas",
  CONFIRMED: "Confirmadas",
  IN_PROGRESS: "Em consulta",
  COMPLETED: "Concluídas",
  CANCELLED: "Canceladas",
  NO_SHOW: "Faltas",
  RESCHEDULED: "Reagendadas",
};

const STATUS_ORDER: DashboardAppointmentStatus[] = [
  "SCHEDULED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "RESCHEDULED",
];

function resolveAppointment(
  appointment: Appointment,
  patients: Patient[],
  doctors: Doctor[],
  services: MedicalService[],
): DashboardAppointment {
  const patient = patients.find((item) => item.id === appointment.patientId);

  const doctor = doctors.find((item) => item.id === appointment.doctorId);

  const service = services.find((item) => item.id === appointment.serviceId);

  return {
    id: appointment.id,
    patientName: patient?.name ?? "Paciente desconhecido",
    doctorName: doctor?.name ?? "Médico desconhecido",
    serviceName: service?.name ?? "Serviço desconhecido",
    date: appointment.date,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    status: appointment.status,
  };
}

function calculateStatusMetrics(
  appointments: Appointment[],
): AppointmentStatusMetric[] {
  const total = appointments.length;

  return STATUS_ORDER.map((status): AppointmentStatusMetric => {
    const count = appointments.filter(
      (appointment) => appointment.status === status,
    ).length;

    return {
      status,
      label: STATUS_LABELS[status],
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  }).filter((item) => item.count > 0);
}

function calculateDoctorWorkload(
  doctors: Doctor[],
  appointments: Appointment[],
  today: Date,
): DoctorWorkloadItem[] {
  const todayKey = toDateKey(today);

  return doctors
    .filter((doctor) => doctor.status === "ACTIVE")
    .map((doctor): DoctorWorkloadItem => {
      const doctorAppointments = appointments.filter(
        (appointment) => appointment.doctorId === doctor.id,
      );

      const appointmentsToday = doctorAppointments.filter(
        (appointment) =>
          appointment.date === todayKey && appointment.status !== "CANCELLED",
      ).length;

      const appointmentsThisMonth = doctorAppointments.filter(
        (appointment) =>
          isSameMonth(appointment.date, today) &&
          appointment.status !== "CANCELLED",
      ).length;

      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        appointmentsToday,
        appointmentsThisMonth,
      };
    })
    .sort((a, b) => b.appointmentsToday - a.appointmentsToday);
}

function createAlerts(
  appointments: Appointment[],
  patients: Patient[],
  today: Date,
): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  const todayKey = toDateKey(today);

  const pendingToday = appointments.filter(
    (appointment) =>
      appointment.date === todayKey && appointment.status === "SCHEDULED",
  );

  if (pendingToday.length > 0) {
    alerts.push({
      id: "unconfirmed-today",
      title: "Marcações por confirmar",
      description: `${pendingToday.length} marcação(ões) de hoje ainda estão com estado agendado.`,
      severity: "WARNING",
    });
  }

  const overdueAppointments = appointments.filter(
    (appointment) =>
      appointment.date < todayKey &&
      (appointment.status === "SCHEDULED" ||
        appointment.status === "CONFIRMED"),
  );

  if (overdueAppointments.length > 0) {
    alerts.push({
      id: "overdue-appointments",
      title: "Marcações antigas pendentes",
      description: `${overdueAppointments.length} marcação(ões) anteriores continuam sem estado final.`,
      severity: "CRITICAL",
    });
  }

  const incompletePatients = patients.filter(
    (patient) => !patient.taxNumber || !patient.healthNumber,
  );

  if (incompletePatients.length > 0) {
    alerts.push({
      id: "incomplete-patients",
      title: "Dados de pacientes incompletos",
      description: `${incompletePatients.length} paciente(s) possuem informação administrativa incompleta.`,
      severity: "INFO",
    });
  }

  return alerts;
}

// ============================================================
// MONTHLY ANALYTICS
// ============================================================

function getLastSixMonths(reference: Date) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      reference.getFullYear(),
      reference.getMonth() - (5 - index),
      1,
    );

    const monthKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    const month = new Intl.DateTimeFormat("pt-PT", {
      month: "short",
    })
      .format(date)
      .replace(".", "");

    return {
      month,
      monthKey,
    };
  });
}

function calculateMonthlyActivity(
  appointments: Appointment[],
  reference: Date,
): MonthlyActivityMetric[] {
  return getLastSixMonths(reference).map(({ month, monthKey }) => {
    const monthAppointments = appointments.filter((appointment) =>
      appointment.date.startsWith(`${monthKey}-`),
    );

    return {
      month,
      monthKey,
      total: monthAppointments.length,

      completed: monthAppointments.filter(
        (appointment) => appointment.status === "COMPLETED",
      ).length,

      cancelled: monthAppointments.filter(
        (appointment) => appointment.status === "CANCELLED",
      ).length,
    };
  });
}

function calculateMonthlyRevenue(
  appointments: Appointment[],
  services: MedicalService[],
  reference: Date,
): MonthlyRevenueMetric[] {
  const pricesByServiceId = new Map(
    services.map((service) => [service.id, service.price]),
  );

  return getLastSixMonths(reference).map(({ month, monthKey }) => {
    const validAppointments = appointments.filter(
      (appointment) =>
        appointment.date.startsWith(`${monthKey}-`) &&
        appointment.status !== "CANCELLED" &&
        appointment.status !== "NO_SHOW",
    );

    const expectedRevenue = validAppointments.reduce((total, appointment) => {
      const price = pricesByServiceId.get(appointment.serviceId) ?? 0;

      return total + price;
    }, 0);

    return {
      month,
      monthKey,
      expectedRevenue,
    };
  });
}

export async function getDashboardData(
  today = new Date(),
): Promise<DashboardData> {
  const patients = readCollection<Patient>(databaseCollections.patients);

  const doctors = readCollection<Doctor>(databaseCollections.doctors);

  const services = readCollection<MedicalService>(
    databaseCollections.medicalServices,
  );

  const appointments = readCollection<Appointment>(
    databaseCollections.appointments,
  );

  const todayKey = toDateKey(today);

  const todayAppointments = appointments
    .filter((appointment) => appointment.date === todayKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const monthlyAppointments = appointments.filter((appointment) =>
    isSameMonth(appointment.date, today),
  );

  const validMonthlyAppointments = monthlyAppointments.filter(
    (appointment) =>
      appointment.status !== "CANCELLED" && appointment.status !== "NO_SHOW",
  );

  const monthlyExpectedRevenue = validMonthlyAppointments.reduce(
    (total, appointment) => {
      const service = services.find(
        (item) => item.id === appointment.serviceId,
      );

      return total + (service?.price ?? 0);
    },
    0,
  );

  const cancelledAppointments = monthlyAppointments.filter(
    (appointment) => appointment.status === "CANCELLED",
  ).length;

  const cancellationRate =
    monthlyAppointments.length === 0
      ? 0
      : Math.round((cancelledAppointments / monthlyAppointments.length) * 100);

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        isFutureDate(appointment.date, today) &&
        appointment.status !== "CANCELLED",
    )
    .sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 6);

  return {
    summary: {
      appointmentsToday: todayAppointments.length,
      totalPatients: patients.length,
      activeDoctors: doctors.filter((doctor) => {
        return doctor.status === "ACTIVE";
      }).length,

      monthlyAppointments: monthlyAppointments.length,
      monthlyExpectedRevenue,
      cancellationRate,
    },

    todayAppointments: todayAppointments.map((appointment) =>
      resolveAppointment(appointment, patients, doctors, services),
    ),

    upcomingAppointments: upcomingAppointments.map((appointment) =>
      resolveAppointment(appointment, patients, doctors, services),
    ),

    statusMetrics: calculateStatusMetrics(monthlyAppointments),
    doctorWorkload: calculateDoctorWorkload(doctors, appointments, today),
    alerts: createAlerts(appointments, patients, today),
    monthlyActivity: calculateMonthlyActivity(appointments, today),
    monthlyRevenue: calculateMonthlyRevenue(appointments, services, today),
  };
}
