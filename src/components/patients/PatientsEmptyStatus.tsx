import {
  Users,
} from "lucide-react";

interface PatientsEmptyStateProps {
  onCreate: () => void;
}

export function PatientsEmptyState({
  onCreate,
}: PatientsEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
        <Users className="h-6 w-6 text-slate-500" />
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">
        Nenhum paciente encontrado
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Não existem pacientes que correspondam aos critérios selecionados.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Cadastrar paciente
      </button>
    </div>
  );
}