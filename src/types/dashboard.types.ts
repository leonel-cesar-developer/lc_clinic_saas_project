import type { AppointmentStatus } from "./appointment.type";

export type DashboardAppointmentStatus = AppointmentStatus;

export interface DashboardAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: DashboardAppointmentStatus;
}

export interface AppointmentStatusMetric {
  status: DashboardAppointmentStatus;
  label: string;
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  appointmentsToday: number;
  totalPatients: number;
  activeDoctors: number;
  monthlyAppointments: number;
  monthlyExpectedRevenue: number;
  cancellationRate: number;
}

export interface DoctorWorkloadItem {
  doctorId: string;
  doctorName: string;
  specialty: string;
  appointmentsToday: number;
  appointmentsThisMonth: number;
}

export type DashboardAlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface DashboardAlert {
  id: string;
  title: string;
  description: string;
  severity: DashboardAlertSeverity;
}

export interface DashboardData {
  summary: DashboardSummary;
  todayAppointments: DashboardAppointment[];
  upcomingAppointments: DashboardAppointment[];
  statusMetrics: AppointmentStatusMetric[];
  doctorWorkload: DoctorWorkloadItem[];
  alerts: DashboardAlert[];

  monthlyActivity: MonthlyActivityMetric[];
  monthlyRevenue: MonthlyRevenueMetric[];
}

export interface MonthlyActivityMetric {
  month: string;
  monthKey: string;
  total: number;
  completed: number;
  cancelled: number;
}

export interface MonthlyRevenueMetric {
  month: string;
  monthKey: string;
  expectedRevenue: number;
}
