import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  CircleAlert,
  Clock3,
  RefreshCw,
  Stethoscope,
  TrendingUp,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { paths } from "../../app/router/Paths";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../stores/useAuth";

import { DashboardAlerts } from "../../components/dashboard/DashboardAlert";
import { DashboardAnalyticsCharts } from "../../components/dashboard/DashboardAnalyticsCharts";
import { TodayAppointments } from "../../components/dashboard/TodayAppointment";
import { UpcomingAppointments } from "../../components/dashboard/UpcomingAppointments";

import type {
  AppointmentStatusMetric,
  DoctorWorkloadItem,
} from "../../types/dashboard.types";

import {
  formatCurrency,
  formatDashboardDate,
} from "../../utils/dashboard.utils";

const numberFormatter = new Intl.NumberFormat("pt-PT");

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "#3b82f6",
  CONFIRMED: "#10b981",
  IN_PROGRESS: "#f59e0b",
  COMPLETED: "#059669",
  CANCELLED: "#ef4444",
  NO_SHOW: "#94a3b8",
  RESCHEDULED: "#8b5cf6",
};

type MetricColor = "blue" | "green" | "amber" | "red";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: MetricColor;
}

const metricStyles: Record<MetricColor, { background: string; icon: string }> =
  {
    blue: {
      background: "bg-blue-50",
      icon: "text-blue-600",
    },
    green: {
      background: "bg-emerald-50",
      icon: "text-emerald-600",
    },
    amber: {
      background: "bg-amber-50",
      icon: "text-amber-600",
    },
    red: {
      background: "bg-red-50",
      icon: "text-red-600",
    },
  };

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: MetricCardProps) {
  const styles = metricStyles[color];

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles.background}`}
        >
          <Icon
            className={`h-6 w-6 ${styles.icon}`}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
          Atual
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-1 break-words text-2xl font-extrabold tracking-tight text-[#0B1F44] xl:text-3xl">
        {value}
      </p>

      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}

interface PanelProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    to: string;
  };
  children: React.ReactNode;
}

function Panel({ title, description, action, children }: PanelProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-[#0B1F44]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>

        {action && (
          <Link
            to={action.to}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-800"
          >
            {action.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function StatusDistribution({
  metrics,
}: {
  metrics: AppointmentStatusMetric[];
}) {
  const total = metrics.reduce((sum, item) => sum + item.count, 0);

  return (
    <Panel
      title="Distribuição das marcações"
      description="Estados das marcações no mês atual"
    >
      {total === 0 ? (
        <EmptyState message="Ainda não existem marcações para analisar." />
      ) : (
        <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative mx-auto h-44 w-full max-w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={2}
                  stroke="none"
                >
                  {metrics.map((metric) => (
                    <Cell
                      key={metric.status}
                      fill={STATUS_COLORS[metric.status] ?? "#94a3b8"}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    Number(value ?? 0),
                    String(name),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <strong className="text-2xl font-extrabold text-[#0B1F44]">
                {numberFormatter.format(total)}
              </strong>

              <span className="text-xs text-slate-500">Marcações</span>
            </div>
          </div>

          <div className="space-y-3">
            {metrics.map((metric) => (
              <div
                key={metric.status}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[metric.status] ?? "#94a3b8",
                    }}
                  />

                  <span className="truncate text-xs text-slate-600">
                    {metric.label}
                  </span>
                </div>

                <span className="shrink-0 text-xs font-bold text-slate-800">
                  {metric.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function DoctorWorkloadPanel({ doctors }: { doctors: DoctorWorkloadItem[] }) {
  const topDoctors = [...doctors]
    .sort((a, b) => b.appointmentsThisMonth - a.appointmentsThisMonth)
    .slice(0, 5);

  const maximum = Math.max(
    1,
    ...topDoctors.map((doctor) => doctor.appointmentsThisMonth),
  );

  return (
    <Panel
      title="Atividade por médico"
      description="Marcações por profissional neste mês"
      action={{
        label: "Ver médicos",
        to: paths.app.doctors,
      }}
    >
      {topDoctors.length === 0 ? (
        <EmptyState message="Ainda não existem dados de atividade médica." />
      ) : (
        <div className="space-y-5">
          {topDoctors.map((doctor) => {
            const percentage = (doctor.appointmentsThisMonth / maximum) * 100;

            return (
              <div key={doctor.doctorId}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="truncate text-xs font-medium text-slate-700">
                    {doctor.doctorName}
                  </span>

                  <span className="text-xs font-bold text-[#0B1F44]">
                    {doctor.appointmentsThisMonth}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-xs leading-5 text-slate-400">
            Comparação relativa ao profissional com maior número de marcações.
          </p>
        </div>
      )}
    </Panel>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
      <Activity className="h-8 w-8 text-slate-300" aria-hidden="true" />

      <p className="max-w-xs text-sm text-slate-500">{message}</p>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div role="status" className="animate-pulse space-y-6">
      <div className="h-24 rounded-2xl bg-slate-200/60" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-44 rounded-2xl bg-slate-200/60" />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-96 rounded-2xl bg-slate-200/60" />
        <div className="h-96 rounded-2xl bg-slate-200/60" />
      </div>

      <span className="sr-only">A carregar Dashboard...</span>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      label: "Gerir marcações",
      to: paths.app.appointments,
      icon: CalendarDays,
    },
    {
      label: "Consultar pacientes",
      to: paths.app.patients,
      icon: Users,
    },
    {
      label: "Equipa médica",
      to: paths.app.doctors,
      icon: Stethoscope,
    },
  ];

  return (
    <Panel
      title="Acessos rápidos"
      description="Principais áreas de gestão clínica"
    >
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 transition hover:border-blue-100 hover:bg-blue-50"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-blue-700">
                <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                {action.label}
              </span>

              <ArrowRight
                className="h-4 w-4 text-slate-400 group-hover:text-blue-600"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, isError, isFetching, refetch } = useDashboard();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (isError || !data) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center shadow-sm"
      >
        <CircleAlert
          className="mx-auto h-10 w-10 text-red-500"
          aria-hidden="true"
        />

        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Não foi possível carregar a Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ocorreu um erro ao consultar os dados da clínica.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const {
    summary,
    todayAppointments,
    upcomingAppointments,
    statusMetrics,
    doctorWorkload,
    alerts,
    monthlyActivity,
    monthlyRevenue,
  } = data;

  const firstName = user?.name?.trim().split(/\s+/)[0];

  const metrics: MetricCardProps[] = [
    {
      title: "Consultas hoje",
      value: numberFormatter.format(summary.appointmentsToday),
      description: "Marcações registadas para hoje",
      icon: CalendarCheck2,
      color: "blue",
    },
    {
      title: "Pacientes registados",
      value: numberFormatter.format(summary.totalPatients),
      description: "Total de pacientes da clínica",
      icon: Users,
      color: "green",
    },
    {
      title: "Receita prevista",
      value: formatCurrency(summary.monthlyExpectedRevenue),
      description: "Estimativa para o mês atual",
      icon: TrendingUp,
      color: "amber",
    },
    {
      title: "Taxa de cancelamento",
      value: `${summary.cancellationRate}%`,
      description: "Cancelamentos no mês atual",
      icon: XCircle,
      color: "red",
    },
  ];

  return (
    <div className="min-w-0 space-y-6 pb-8">
      {/* WELCOME HEADER */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
            Dashboard / Visão geral
          </p>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#0B1F44] sm:text-3xl">
            Olá, {firstName ?? "Utilizador"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Aqui está um resumo da atividade da sua clínica hoje.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-600 shadow-sm">
            <CalendarDays
              className="h-4 w-4 text-blue-600"
              aria-hidden="true"
            />

            {formatDashboardDate(new Date())}
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Atualizar dados da Dashboard"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      {/* FOUR KPI CARDS */}
      <section
        aria-label="Indicadores principais"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      {/* MAIN DASHBOARD */}
      <section
        aria-label="Agenda e análise mensal"
        className="grid min-w-0 items-stretch gap-5 xl:grid-cols-2"
      >
        {/* COLUNA ESQUERDA */}
        <div className="grid min-w-0 grid-rows-2 gap-5">
          <div className="min-h-0 [&>section]:h-full">
            <TodayAppointments appointments={todayAppointments} />
          </div>

          <div className="min-h-0 [&>section]:h-full">
            <UpcomingAppointments appointments={upcomingAppointments} />
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="min-w-0">
          <DashboardAnalyticsCharts
            activity={monthlyActivity}
            revenue={monthlyRevenue}
          />
        </div>
      </section>

      {/* ANALYTICS */}
      <section
        aria-label="Indicadores operacionais"
        className="grid min-w-0 items-start gap-5 xl:grid-cols-2"
      >
        <div className="[&>section>div:last-child]:py-4">
          <StatusDistribution metrics={statusMetrics} />
        </div>

        <div className="[&>section>div:last-child]:py-4">
          <DoctorWorkloadPanel doctors={doctorWorkload} />
        </div>
      </section>

      {/* OPERATIONS */}
      <section
        aria-label="Alertas e navegação"
        className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <DashboardAlerts alerts={alerts} />

        <QuickActions />
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
        <span>LC ClinicSaaS · Painel de gestão clínica</span>

        <span className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          Dados da Fake API local
        </span>
      </footer>
    </div>
  );
}
