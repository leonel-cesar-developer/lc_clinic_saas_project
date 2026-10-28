import { X } from "lucide-react";
import type { Patient } from "../../types/patient.types";
import type { PatientFormValues } from "../../types/patient-dashboard.type";
import { PatientForm } from "../../components/patients/PatientsForm";

interface PatientFormModalProps {
  open: boolean;
  patient?: Patient;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => Promise<void>;
}

export function PatientFormModal({
  open,
  patient,
  isSubmitting,
  onClose,
  onSubmit,
}: PatientFormModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {patient ? "Editar paciente" : "Cadastrar paciente"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informação clínica e administrativa do paciente.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-6">
          <PatientForm
            patient={patient}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
