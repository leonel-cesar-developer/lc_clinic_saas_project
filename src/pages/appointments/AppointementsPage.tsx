
import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "../../components/PageContainer";

import AppointmentsStats from "../../components/appointments/AppointmentsStatus";
import AppointmentsToolbar from "../../components/appointments/AppointmentsToolbar";
import type { StatusFilter } from "../../components/appointments/AppointmentsToolbar";
import AppointmentsTable from "../../components/appointments/AppointmentsTable";
import type { AppointmentRow } from "../../components/appointments/AppointmentsTable";
import AppointmentsPagination from "../../components/appointments/AppointmentsPagination";
import AppointmentFormModal, { type AppointmentFormValues } from "../../components/appointments/AppointmentsFormModal";

import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "../../hooks/useAppointments";

import { readCollection } from "../../api/core/local-storage";
import { databaseCollections } from "../../types/config";

import type {
  Appointment,
  AppointmentStatus,
} from "../../types/appointment.type";

import type { Patient } from "../../types/patient.types";
import type { Doctor } from "../../types/doctor.types";
import type { MedicalService } from "../../types/services.types";

import {
  appointmentStatusLabels,
  formatAppointmentDate,
  normalizeAppointmentSearch,
} from "../../utils/appointments.utils";

const PAGE_SIZE = 8;

const DATA_LIMIT = 100000;

const EMPTY_APPOINTMENTS: Appointment[] = [];
const EMPTY_PATIENTS: Patient[] = [];
const EMPTY_DOCTORS: Doctor[] = [];
const EMPTY_SERVICES: MedicalService[] = [];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado.";
}

function useAppointmentRelationships() {
  return useQuery({
    queryKey: ["appointment-relationships"],
    queryFn: () => ({
      patients: readCollection<Patient>(
        databaseCollections.patients,
      ),
      doctors: readCollection<Doctor>(
        databaseCollections.doctors,
      ),
      services: readCollection<MedicalService>(
        databaseCollections.medicalServices,
      ),
    }),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<StatusFilter>("ALL");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] =
    useState<Appointment | null>(null);
  const [selected, setSelected] =
    useState<Appointment | null>(null);
  const [deleting, setDeleting] =
    useState<Appointment | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);
  const [actionError, setActionError] =
    useState<string | null>(null);
  const [notice, setNotice] =
    useState<string | null>(null);

  const appointmentsQuery = useAppointments({
    page: 1,
    pageSize: DATA_LIMIT,
    sortBy: "date",
    sortDirection: "desc",
  });

  const relationshipsQuery =
    useAppointmentRelationships();

  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

const appointments =
  appointmentsQuery.data?.data ?? EMPTY_APPOINTMENTS;

const patients =
  relationshipsQuery.data?.patients ?? EMPTY_PATIENTS;

const doctors =
  relationshipsQuery.data?.doctors ?? EMPTY_DOCTORS;

const services =
  relationshipsQuery.data?.services ?? EMPTY_SERVICES;

  const rows = useMemo<AppointmentRow[]>(() => {
    const patientMap = new Map(
      patients.map((patient) => [
        patient.id,
        patient.name,
      ]),
    );

    const doctorMap = new Map(
      doctors.map((doctor) => [
        doctor.id,
        doctor.name,
      ]),
    );

    const serviceMap = new Map(
      services.map((service) => [
        service.id,
        service.name,
      ]),
    );

    return appointments.map((appointment) => ({
      appointment,
      patientName:
        patientMap.get(appointment.patientId) ??
        "Paciente não encontrado",
      doctorName:
        doctorMap.get(appointment.doctorId) ??
        "Médico não encontrado",
      serviceName:
        serviceMap.get(appointment.serviceId) ??
        "Serviço não encontrado",
    }));
  }, [appointments, patients, doctors, services]);

  const filteredRows = useMemo(() => {
    const normalizedSearch =
      normalizeAppointmentSearch(search);

    return rows
      .filter((row) => {
        const matchesStatus =
          status === "ALL" ||
          row.appointment.status === status;

        const matchesDate =
          !date || row.appointment.date === date;

        const searchableText =
          normalizeAppointmentSearch(
            [
              row.patientName,
              row.doctorName,
              row.serviceName,
              row.appointment.reason ?? "",
            ].join(" "),
          );

        return (
          matchesStatus &&
          matchesDate &&
          searchableText.includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        const dateComparison =
          b.appointment.date.localeCompare(
            a.appointment.date,
          );

        if (dateComparison !== 0) {
          return dateComparison;
        }

        return a.appointment.startTime.localeCompare(
          b.appointment.startTime,
        );
      });
  }, [rows, search, status, date]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / PAGE_SIZE),
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedRows = filteredRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function resetFilters() {
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(appointment: Appointment) {
    setEditing(appointment);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(
    values: AppointmentFormValues,
  ) {
    setFormError(null);
    setActionError(null);

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          input: values,
        });

        setNotice("Marcação atualizada com sucesso.");
      } else {
        await createMutation.mutateAsync({
          ...values,
          status: "SCHEDULED",
        });

        setNotice("Marcação criada com sucesso.");
      }

      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  async function handleStatusChange(
    appointment: Appointment,
    nextStatus: AppointmentStatus,
  ) {
    const confirmed = window.confirm(
      `Alterar o estado para "${appointmentStatusLabels[nextStatus]}"?`,
    );

    if (!confirmed) return;

    setActionError(null);
    setNotice(null);

    try {
      await updateMutation.mutateAsync({
        id: appointment.id,
        input: { status: nextStatus },
      });

      setNotice("Estado atualizado com sucesso.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!deleting) return;

    setActionError(null);
    setNotice(null);

    try {
      await deleteMutation.mutateAsync(deleting.id);

      setDeleting(null);
      setNotice("Marcação eliminada com sucesso.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  const isLoading =
    appointmentsQuery.isPending ||
    relationshipsQuery.isPending;

  const isError =
    appointmentsQuery.isError ||
    relationshipsQuery.isError;

  const loadError =
    appointmentsQuery.error ??
    relationshipsQuery.error;

  return (
    <PageContainer
      title="Marcações"
      description="Consulte e administre todas as marcações."
      action={
        <button
          type="button"
          onClick={openCreate}
          disabled={isLoading || isError || busy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Nova marcação
        </button>
      }
    >
      <div className="space-y-6">
        {notice && (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {notice}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        {isLoading ? (
          <div
            role="status"
            className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500"
          >
            A carregar marcações...
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-white p-8 text-center"
          >
            <p className="font-semibold text-red-700">
              Não foi possível carregar os dados.
            </p>

            <p className="mt-2 text-sm text-slate-600">
              {getErrorMessage(loadError)}
            </p>

            <button
              type="button"
              onClick={() => {
                void appointmentsQuery.refetch();
                void relationshipsQuery.refetch();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <AppointmentsStats
              appointments={appointments}
            />

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-base font-semibold text-slate-900">
                  Lista de marcações
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Pesquisa, gestão e acompanhamento das consultas.
                </p>
              </div>

              <AppointmentsToolbar
                search={search}
                status={status}
                date={date}
                onSearchChange={(value) => {
                  setSearch(value);
                  resetFilters();
                }}
                onStatusChange={(value) => {
                  setStatus(value);
                  resetFilters();
                }}
                onDateChange={(value) => {
                  setDate(value);
                  resetFilters();
                }}
              />

              <AppointmentsTable
                rows={paginatedRows}
                busy={busy}
                onView={setSelected}
                onEdit={openEdit}
                onDelete={setDeleting}
                onStatusChange={(appointment, nextStatus) => {
                  void handleStatusChange(
                    appointment,
                    nextStatus,
                  );
                }}
              />

              <AppointmentsPagination
                page={page}
                pageSize={PAGE_SIZE}
                totalItems={filteredRows.length}
                onPageChange={setPage}
              />
            </section>
          </>
        )}
      </div>

      {formOpen && (
        <AppointmentFormModal
          key={editing?.id ?? "new"}
          appointment={editing}
          patients={patients}
          doctors={doctors}
          services={services}
          saving={busy}
          error={formError}
          onClose={() => {
            if (!busy) {
              setFormOpen(false);
              setEditing(null);
            }
          }}
          onSubmit={(values) => {
            void handleSubmit(values);
          }}
        />
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-details-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="appointment-details-title"
              className="text-lg font-semibold text-slate-900"
            >
              Detalhes da marcação
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["Paciente", patients.find(
                  (p) => p.id === selected.patientId,
                )?.name ?? "Não encontrado"],
                ["Médico", doctors.find(
                  (d) => d.id === selected.doctorId,
                )?.name ?? "Não encontrado"],
                ["Serviço", services.find(
                  (s) => s.id === selected.serviceId,
                )?.name ?? "Não encontrado"],
                ["Data", formatAppointmentDate(selected.date)],
                ["Horário", `${selected.startTime} – ${selected.endTime}`],
                ["Estado", appointmentStatusLabels[selected.status]],
                ["Motivo", selected.reason || "Não indicado"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-slate-100 pb-3"
                >
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Fechar
            </button>
          </section>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-appointment-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-appointment-title"
              className="text-lg font-semibold text-slate-900"
            >
              Eliminar marcação?
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Esta operação elimina definitivamente o
              registo selecionado.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setDeleting(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  void handleDelete();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? "A eliminar..." : "Eliminar"}
              </button>
            </div>
          </section>
        </div>
      )}
    </PageContainer>
  );
}
