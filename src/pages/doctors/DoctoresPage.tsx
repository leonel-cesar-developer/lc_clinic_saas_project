import { useState } from "react";
import PageContainer from "../../components/PageContainer";

import { DoctorDetailsModal } from "../../components/doctors/DoctorDetailsModal";

import { DoctorFormModal } from "../../components/doctors/DoctorFormModal";
import { DoctorsEmptyState } from "../../components/doctors/DoctorsEmptyStatus";
import { DoctorsPagination } from "../../components/doctors/DoctorsPagination";
import { DoctorsStats } from "../../components/doctors/DoctorStats";
import { DoctorsTable } from "../../components/doctors/DoctorsTable";
import { DoctorsToolbar } from "../../components/doctors/DoctorsToolbar";
import { useDoctors } from "../../hooks/useDoctor";

import type {
  DoctorFormValues,
  DoctorTableRow,
} from "../../types/doctor-dashboard-type";

export default function DoctorsPage() {
  const doctors = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorTableRow | null>(
    null,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  function openCreate(): void {
    setSelectedDoctor(null);
    setDetailsOpen(false);
    setFormOpen(true);
  }

  function openView(doctor: DoctorTableRow): void {
    setSelectedDoctor(doctor);
    setFormOpen(false);
    setDetailsOpen(true);
  }

  function openEdit(doctor: DoctorTableRow): void {
    setSelectedDoctor(doctor);
    setDetailsOpen(false);
    setFormOpen(true);
  }

  function closeForm(): void {
    setSelectedDoctor(null);
    setFormOpen(false);
  }

  function closeDetails(): void {
    setSelectedDoctor(null);
    setDetailsOpen(false);
  }

  async function handleSubmit(values: DoctorFormValues): Promise<void> {
    if (selectedDoctor) {
      await doctors.updateDoctor({
        id: selectedDoctor.id,
        values,
      });
    } else {
      await doctors.createDoctor(values);
    }

    closeForm();
  }

  async function handleDelete(doctor: DoctorTableRow): Promise<void> {
    const confirmed = window.confirm(
      `Tem a certeza que pretende eliminar ${doctor.name}?`,
    );

    if (!confirmed) {
      return;
    }

    await doctors.deleteDoctor(doctor.id);
  }

  if (doctors.isLoading) {
    return (
      <PageContainer
        title="Médicos"
        description="Gestão da equipa médica da clínica."
      >
        <DoctorsPageSkeleton />
      </PageContainer>
    );
  }

  if (doctors.isError) {
    return (
      <PageContainer
        title="Médicos"
        description="Gestão da equipa médica da clínica."
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-slate-900">
            Não foi possível carregar os médicos
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ocorreu um problema ao consultar os dados da equipa médica.
          </p>

          <button
            type="button"
            onClick={() => {
              void doctors.refetch();
            }}
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
      title="Médicos"
      description="Gestão completa da equipa médica e disponibilidade clínica."
    >
      <div className="space-y-6">
        <DoctorsStats doctors={doctors.doctors} />

        <DoctorsToolbar
          search={doctors.search}
          status={doctors.status}
          specialty={doctors.specialty}
          specialties={doctors.specialties}
          onSearchChange={doctors.setSearch}
          onStatusChange={doctors.setStatus}
          onSpecialtyChange={doctors.setSpecialty}
          onCreate={openCreate}
        />

        {doctors.rows.length === 0 ? (
          <DoctorsEmptyState onCreate={openCreate} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <DoctorsTable
              doctors={doctors.rows}
              onView={openView}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSort={doctors.toggleSort}
            />

            <DoctorsPagination
              page={doctors.page}
              totalPages={doctors.totalPages}
              totalItems={doctors.filteredCount}
              onPageChange={doctors.setPage}
            />
          </div>
        )}
      </div>

      <DoctorDetailsModal
        open={detailsOpen}
        doctor={selectedDoctor?.doctor}
        onClose={closeDetails}
      />

      <DoctorFormModal
        open={formOpen}
        doctor={selectedDoctor?.doctor}
        isSubmitting={doctors.isCreating || doctors.isUpdating}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}

function DoctorsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
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
