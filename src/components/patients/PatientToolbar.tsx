import {
  Plus,
  Search,
} from "lucide-react";

import type {
  PatientStatus,
} from "../../types/patient.types";

interface PatientsToolbarProps {
  search: string;

  status:
    | PatientStatus
    | "ALL";

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value:
      | PatientStatus
      | "ALL",
  ) => void;

  onCreate: () => void;
}

export function PatientsToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onCreate,
}: PatientsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">
            Pesquisar pacientes
          </span>

          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Pesquisar por nome, email ou telefone..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              pl-10
              pr-4
              text-sm
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-slate-400
              focus:ring-2
              focus:ring-slate-100
            "
          />
        </label>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as
                | PatientStatus
                | "ALL",
            )
          }
          className="
            h-11
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            text-sm
            text-slate-700
            outline-none
          "
        >
          <option value="ALL">
            Todos os estados
          </option>

          <option value="ACTIVE">
            Ativos
          </option>

          <option value="INACTIVE">
            Inativos
          </option>
        </select>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="
          inline-flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-4
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-blue-700
        "
      >
        <Plus className="h-4 w-4" />

        Novo paciente
      </button>
    </div>
  );
}