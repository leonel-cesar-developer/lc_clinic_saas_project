import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";

import type {
  PatientSortField,
  PatientTableRow,
} from "../../types/patient-dashboard.type";

import { formatPatientDate } from "../../utils/patient.utils";
import { PatientStatusBadge } from "./PatientStatusBadge";

interface PatientsTableProps {
  patients: PatientTableRow[];
  onView: (patient: PatientTableRow) => void;
  onEdit: (patient: PatientTableRow) => void;
  onDelete: (patient: PatientTableRow) => void;
  onSort: (field: PatientSortField) => void;
}

export function PatientsTable({
  patients,
  onView,
  onEdit,
  onDelete,
  onSort,
}: PatientsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <SortableHeader label="Paciente" onClick={() => onSort("name")} />

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contacto
            </th>

            <SortableHeader label="Idade" onClick={() => onSort("age")} />

            <SortableHeader
              label="Última consulta"
              onClick={() => onSort("lastConsultation")}
            />

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Estado
            </th>

            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {patients.map((patient) => (
            <tr key={patient.id} className="transition hover:bg-slate-50">
              <td className="px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {patient.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {patient.patient.identificationNumber ??
                      patient.patient.healthNumber ??
                      patient.patient.taxNumber ??
                      "Sem identificação"}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="text-sm text-slate-700">{patient.email}</p>

                <p className="mt-1 text-xs text-slate-500">{patient.phone}</p>
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                {patient.age} anos
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                {formatPatientDate(patient.lastConsultation)}
              </td>

              <td className="px-5 py-4">
                <PatientStatusBadge status={patient.status} />
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView(patient)}
                    aria-label={`Ver ${patient.name}`}
                    title="Ver paciente"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(patient)}
                    aria-label={`Editar ${patient.name}`}
                    title="Editar paciente"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(patient)}
                    aria-label={`Eliminar ${patient.name}`}
                    title="Eliminar paciente"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SortableHeaderProps {
  label: string;
  onClick: () => void;
}

function SortableHeader({ label, onClick }: SortableHeaderProps) {
  return (
    <th className="px-5 py-4 text-left">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-900"
      >
        {label}

        <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    </th>
  );
}
