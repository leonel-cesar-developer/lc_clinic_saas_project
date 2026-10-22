export type DoctorStatus = "ACTIVE" | "INACTIVE";

export interface DoctorSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  status: DoctorStatus;
  consultationPrice: number;
  schedule: DoctorSchedule[];
  createdAt: string;
  updatedAt: string;
}
