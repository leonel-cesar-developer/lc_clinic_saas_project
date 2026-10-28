import { useState } from "react";

import PageContainer from "../../components/PageContainer";

import { PatientDetailsModal } from "../../components/patients/PatientsDetailsModal";
import { PatientFormModal } from "../../components/patients/PatientFormModal";
import { PatientsEmptyState } from "../../components/patients/PatientsEmptyStatus";
import { PatientsPagination } from "../../components/patients/PatientsPagination";
import { PatientsStats } from "../../components/patients/PatientsStatus";
import { PatientsTable } from "../../components/patients/PatientsTable";
import { PatientsToolbar } from "../../components/patients/PatientToolbar";

import { usePatients } from "../../hooks/usePatients";

import type {
  PatientFormValues,
  PatientTableRow,
} from "../../types/patient-dashboard.type";

export default function PatientsPage() {
  const patients = usePatients();
  const [selectedPatient, setSelectedPatient] =
    useState<PatientTableRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  function openCreate() {
    setSelectedPatient(null);
    setDetailsOpen(false);
    setFormOpen(true);
  }

  function openView(patient: PatientTableRow) {
    setSelectedPatient(patient);
    setFormOpen(false);
    setDetailsOpen(true);
  }

  function openEdit(patient: PatientTableRow) {
    setSelectedPatient(patient);
    setDetailsOpen(false);
    setFormOpen(true);
  }

  function closeForm() {
    setSelectedPatient(null);
    setFormOpen(false);
  }

  function closeDetails() {
    setSelectedPatient(null);
    setDetailsOpen(false);
  }

  async function handleSubmit(values: PatientFormValues) {
    if (selectedPatient) {
      await patients.updatePatient({
        id: selectedPatient.id,
        values,
      });
    } else {
      await patients.createPatient(values);
    }

    closeForm();
  }

  async function handleDelete(patient: PatientTableRow) {
    const confirmed = window.confirm(
      `Tem a certeza que pretende eliminar ${patient.name}?`,
    );

    if (!confirmed) {
      return;
    }

    await patients.deletePatient(patient.id);
  }

  if (patients.isLoading) {
    return (
      <PageContainer
        title="Pacientes"
        description="Gestão de pacientes da clínica."
      >
        <PatientsPageSkeleton />
      </PageContainer>
    );
  }

  if (patients.isError) {
    return (
      <PageContainer
        title="Pacientes"
        description="Gestão de pacientes da clínica."
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-slate-900">
            Não foi possível carregar os pacientes
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ocorreu um problema ao consultar os dados.
          </p>

          <button
            type="button"
            onClick={patients.refetch}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Pacientes"
      description="Gestão completa dos pacientes da clínica."
    >
      <div className="space-y-6">
        <PatientsStats patients={patients.patients} />

        <PatientsToolbar
          search={patients.search}
          status={patients.status}
          onSearchChange={patients.setSearch}
          onStatusChange={patients.setStatus}
          onCreate={openCreate}
        />

        {patients.rows.length === 0 ? (
          <PatientsEmptyState onCreate={openCreate} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <PatientsTable
              patients={patients.rows}
              onView={openView}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSort={patients.toggleSort}
            />

            <PatientsPagination
              page={patients.page}
              totalPages={patients.totalPages}
              totalItems={patients.filteredCount}
              onPageChange={patients.setPage}
            />
          </div>
        )}
      </div>

      <PatientDetailsModal
        open={detailsOpen}
        patient={selectedPatient?.patient}
        onClose={closeDetails}
      />

      <PatientFormModal
        open={formOpen}
        patient={selectedPatient?.patient}
        isSubmitting={patients.isCreating || patients.isUpdating}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}

function PatientsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>

      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />

      <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}
