import { useState } from "react";
import type { FormEvent } from "react";
import type { Doctor } from "../../types/doctor.types";
import type { DoctorFormValues } from "../../types/doctor-dashboard-type";

interface DoctorFormProps {
  doctor?: Doctor;
  isSubmitting: boolean;
  onSubmit: (values: DoctorFormValues) => Promise<void>;
  onCancel: () => void;
}

const defaultSchedule = [
  {
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  },
];

const initialValues: DoctorFormValues = {
  name: "",
  email: "",
  phone: "",
  licenseNumber: "",
  specialty: "",
  consultationPrice: 0,
  status: "ACTIVE",
  schedule: defaultSchedule,
};

export function DoctorForm({
  doctor,
  isSubmitting,
  onSubmit,
  onCancel,
}: DoctorFormProps) {
  const [values, setValues] = useState<DoctorFormValues>(
    doctor
      ? {
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          licenseNumber: doctor.licenseNumber,
          specialty: doctor.specialty,
          consultationPrice: doctor.consultationPrice,
          status: doctor.status,
          schedule: doctor.schedule,
        }
      : initialValues,
  );

  function updateField<K extends keyof Omit<DoctorFormValues, "schedule">>(
    field: K,
    value: DoctorFormValues[K],
  ): void {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addSchedule(): void {
    setValues((current) => ({
      ...current,

      schedule: [
        ...current.schedule,

        {
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    }));
  }

  function updateSchedule(
    index: number,
    field: "dayOfWeek" | "startTime" | "endTime",
    value: string | number,
  ): void {
    setValues((current) => ({
      ...current,

      schedule: current.schedule.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  }

  function removeSchedule(index: number): void {
    setValues((current) => ({
      ...current,

      schedule: current.schedule.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <section>
        <h3 className="mb-4 font-semibold text-slate-900">
          Informação profissional
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nome completo" required>
            <input
              required
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Cédula profissional" required>
            <input
              required
              value={values.licenseNumber}
              onChange={(event) =>
                updateField("licenseNumber", event.target.value)
              }
              placeholder="Ex: OM-45678"
              className={inputClass}
            />
          </FormField>

          <FormField label="Especialidade" required>
            <input
              required
              value={values.specialty}
              onChange={(event) => updateField("specialty", event.target.value)}
              placeholder="Ex: Cardiologia"
              className={inputClass}
            />
          </FormField>

          <FormField label="Preço da consulta" required>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={values.consultationPrice}
              onChange={(event) =>
                updateField("consultationPrice", Number(event.target.value))
              }
              className={inputClass}
            />
          </FormField>

          <FormField label="Estado" required>
            <select
              value={values.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as DoctorFormValues["status"],
                )
              }
              className={inputClass}
            >
              <option value="ACTIVE">Ativo</option>

              <option value="INACTIVE">Inativo</option>
            </select>
          </FormField>
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-semibold text-slate-900">Contactos</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Email" required>
            <input
              required
              type="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Telefone" required>
            <input
              required
              type="tel"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">Horário semanal</h3>

            <p className="mt-1 text-sm text-slate-500">
              Configure os dias e horários de atendimento.
            </p>
          </div>

          <button
            type="button"
            onClick={addSchedule}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Adicionar horário
          </button>
        </div>

        <div className="space-y-3">
          {values.schedule.map((schedule, index) => (
            <div
              key={`${schedule.dayOfWeek}-${index}`}
              className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.5fr_1fr_1fr_auto]"
            >
              <select
                value={schedule.dayOfWeek}
                onChange={(event) =>
                  updateSchedule(index, "dayOfWeek", Number(event.target.value))
                }
                className={inputClass}
              >
                <option value={1}>Segunda-feira</option>
                <option value={2}>Terça-feira</option>
                <option value={3}>Quarta-feira</option>
                <option value={4}>Quinta-feira</option>
                <option value={5}>Sexta-feira</option>
                <option value={6}>Sábado</option>
                <option value={0}>Domingo</option>
              </select>

              <input
                type="time"
                value={schedule.startTime}
                onChange={(event) =>
                  updateSchedule(index, "startTime", event.target.value)
                }
                className={inputClass}
              />

              <input
                type="time"
                value={schedule.endTime}
                onChange={(event) =>
                  updateSchedule(index, "endTime", event.target.value)
                }
                className={inputClass}
              />

              <button
                type="button"
                disabled={values.schedule.length === 1}
                onClick={() => removeSchedule(index)}
                className="rounded-xl border border-red-100 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "A guardar..."
            : doctor
              ? "Guardar alterações"
              : "Cadastrar médico"}
        </button>
      </div>
    </form>
  );
}

const inputClass = `
  h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-3
  text-sm
  text-slate-900
  outline-none
  transition
  focus:border-slate-400
  focus:ring-2
  focus:ring-slate-100
`;

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, required, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="text-red-500"> *</span>}
      </span>

      {children}
    </label>
  );
}
