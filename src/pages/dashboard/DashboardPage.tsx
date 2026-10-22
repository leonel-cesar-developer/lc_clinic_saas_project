/* import {
  CalendarCheck,
  CalendarDays,
  Stethoscope,
  TrendingUp,
  UserRound,
  XCircle,
} from "lucide-react";

import PageContainer from "../../components/PageContainer";
import { AppointmentStatusPanel } from "../../components/dashboard/AppointmentStatusPanel";
import { DashboardAlerts } from "../../components/dashboard/DashboardAlert";
import { DashboardStatCard } from "../../components/dashboard/DashboardStartCard";
import { DoctorWorkload } from "../../components/dashboard/DoctorWorkLoad";
import { TodayAppointments } from "../../components/dashboard/TodayAppointment";
import { UpcomingAppointments } from "../../components/dashboard/UpcomingAppointments";
import { useDashboard } from "../../hooks/useDashboard";

import {
  formatCurrency,
  formatDashboardDate,
} from "../../utils/dashboard.utils";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) {
    return (
      <PageContainer
        title="Dashboard"
        description="Visão operacional da clínica."
      >
        <div className="flex min-h-80 items-center justify-center">
          <p className="text-sm text-slate-500">A carregar dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer
        title="Dashboard"
        description="Visão operacional da clínica."
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-slate-900">
            Não foi possível carregar a dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ocorreu um problema ao consultar os dados da clínica.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Tentar novamente
          </button>
        </div>
      </PageContainer>
    );
  }

  const {
    summary,
    todayAppointments,
    upcomingAppointments,
    statusMetrics,
    doctorWorkload,
    alerts,
  } = data;

  return (
    <PageContainer
      title="Dashboard"
      description="Visão operacional da clínica."
    >
      <div className="space-y-8">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm text-slate-500">
              {formatDashboardDate(new Date())}
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              Visão geral da operação
            </h2>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <DashboardStatCard
            title="Consultas hoje"
            value={summary.appointmentsToday}
            description="Agenda clínica de hoje"
            icon={CalendarCheck}
          />

          <DashboardStatCard
            title="Pacientes"
            value={summary.totalPatients}
            description="Pacientes registados"
            icon={UserRound}
          />

          <DashboardStatCard
            title="Médicos ativos"
            value={summary.activeDoctors}
            description="Profissionais disponíveis"
            icon={Stethoscope}
          />

          <DashboardStatCard
            title="Marcações no mês"
            value={summary.monthlyAppointments}
            description="Volume mensal"
            icon={CalendarDays}
          />

          <DashboardStatCard
            title="Receita prevista"
            value={formatCurrency(summary.monthlyExpectedRevenue)}
            description="Marcações válidas do mês"
            icon={TrendingUp}
          />

          <DashboardStatCard
            title="Cancelamentos"
            value={`${summary.cancellationRate}%`}
            description="Taxa mensal"
            icon={XCircle}
          />
        </section>

        <DashboardAlerts alerts={alerts} />

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <TodayAppointments appointments={todayAppointments} />

          <UpcomingAppointments appointments={upcomingAppointments} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <AppointmentStatusPanel metrics={statusMetrics} />

          <DoctorWorkload doctors={doctorWorkload} />
        </div>
      </div>
    </PageContainer>
  );
}
 */

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

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageContainer from "../../components/PageContainer";
import { DashboardAlerts } from "../../components/dashboard/DashboardAlert";
import { TodayAppointments } from "../../components/dashboard/TodayAppointment";
import { UpcomingAppointments } from "../../components/dashboard/UpcomingAppointments";
import { useDashboard } from "../../hooks/useDashboard";

import { DashboardAnalyticsCharts } from "../../components/dashboard/DashboardAnalyticsCharts";

import type {
  AppointmentStatusMetric,
  DashboardAppointment,
  DoctorWorkloadItem,
} from "../../types/dashboard.types";

import {
  formatCurrency,
  formatDashboardDate,
} from "../../utils/dashboard.utils";

// ============================================================
// DESIGN SYSTEM
// ============================================================

const COLORS = {
  blue: "#2563eb",
  lightBlue: "#93c5fd",
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
  violet: "#8b5cf6",
  slate: "#64748b",
};

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: COLORS.blue,
  CONFIRMED: COLORS.green,
  IN_PROGRESS: COLORS.orange,
  COMPLETED: "#059669",
  CANCELLED: COLORS.red,
  NO_SHOW: COLORS.slate,
  RESCHEDULED: COLORS.violet,
};

const numberFormatter = new Intl.NumberFormat("pt-PT");

// ============================================================
// SHARED COMPONENTS
// ============================================================

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "red";
};

const metricColors = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: MetricCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${metricColors[color]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">{subtitle}</p>
    </article>
  );
}

type PanelProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: {
    label: string;
    to: string;
  };
};

function Panel({ title, subtitle, children, action }: PanelProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        {action && (
          <Link
            to={action.to}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {action.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyChart({
  message = "Ainda não existem dados para apresentar.",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
      <Activity className="h-9 w-9 text-slate-300" />

      <p className="max-w-xs text-sm text-slate-500">{message}</p>
    </div>
  );
}

// ============================================================
// CHART 1 — CONSULTAS POR HORA
// ============================================================

function AppointmentsChart({
  appointments,
}: {
  appointments: DashboardAppointment[];
}) {
  const hours = Array.from({ length: 12 }, (_, index) => index + 7);

  const chartData = hours.map((hour) => {
    const appointmentsAtHour = appointments.filter(
      (appointment) => Number(appointment.startTime.split(":")[0]) === hour,
    );

    return {
      hour: `${String(hour).padStart(2, "0")}h`,
      active: appointmentsAtHour.filter(
        (appointment) =>
          appointment.status !== "CANCELLED" &&
          appointment.status !== "NO_SHOW",
      ).length,
      cancelled: appointmentsAtHour.filter(
        (appointment) => appointment.status === "CANCELLED",
      ).length,
    };
  });

  const hasData = chartData.some(
    (item) => item.active > 0 || item.cancelled > 0,
  );

  return (
    <Panel
      title="Atividade das marcações"
      subtitle="Distribuição das consultas por hora, hoje"
      action={{
        label: "Ver agenda",
        to: "/appointments",
      }}
    >
      <div className="mb-5 flex flex-wrap items-center gap-5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
          Marcações ativas
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-300" />
          Canceladas
        </div>
      </div>

      {!hasData ? (
        <EmptyChart message="Não existem consultas registadas para hoje." />
      ) : (
        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 8,
                right: 4,
                left: -25,
                bottom: 0,
              }}
              barGap={2}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />

              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                formatter={(value, name) => [
                  Number(value ?? 0),
                  name === "active" ? "Marcações ativas" : "Canceladas",
                ]}
              />

              <Bar
                dataKey="active"
                fill={COLORS.blue}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />

              <Bar
                dataKey="cancelled"
                fill="#fca5a5"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

// ============================================================
// CHART 2 — DISTRIBUIÇÃO POR ESTADO
// ============================================================

function StatusChart({ metrics }: { metrics: AppointmentStatusMetric[] }) {
  const total = metrics.reduce((sum, item) => sum + item.count, 0);

  return (
    <Panel
      title="Distribuição de marcações"
      subtitle="Estados das consultas no mês atual"
    >
      {total === 0 ? (
        <EmptyChart />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-64 w-full shrink-0 sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={65}
                  outerRadius={93}
                  paddingAngle={2}
                  stroke="none"
                >
                  {metrics.map((item) => (
                    <Cell
                      key={item.status}
                      fill={STATUS_COLORS[item.status] ?? COLORS.slate}
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
              <span className="text-3xl font-bold text-slate-900">
                {numberFormatter.format(total)}
              </span>

              <span className="text-xs text-slate-500">Marcações</span>
            </div>
          </div>

          <div className="w-full flex-1 space-y-3">
            {metrics.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[item.status] ?? COLORS.slate,
                    }}
                  />

                  <span className="truncate text-xs text-slate-600">
                    {item.label}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    {item.percentage}%
                  </span>

                  <span className="text-xs text-slate-400">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

// ============================================================
// CHART 3 — CARGA DE TRABALHO
// ============================================================

function WorkloadChart({ doctors }: { doctors: DoctorWorkloadItem[] }) {
  const chartData = [...doctors]
    .sort((a, b) => b.appointmentsThisMonth - a.appointmentsThisMonth)
    .slice(0, 5)
    .map((doctor) => ({
      id: doctor.doctorId,
      name: doctor.doctorName,
      appointments: doctor.appointmentsThisMonth,
    }));

  const maxAppointments = Math.max(
    1,
    ...chartData.map((doctor) => doctor.appointments),
  );

  return (
    <Panel
      title="Carga de trabalho dos médicos"
      subtitle="Marcações por médico no mês atual"
      action={{
        label: "Ver médicos",
        to: "/doctors",
      }}
    >
      {chartData.length === 0 ? (
        <EmptyChart message="Ainda não existem médicos ativos." />
      ) : (
        <div className="space-y-6 py-2">
          {chartData.map((doctor, index) => {
            const percentage = (doctor.appointments / maxAppointments) * 100;

            return (
              <div key={doctor.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                      {doctor.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part.charAt(0))
                        .join("")
                        .toUpperCase()}
                    </div>

                    <span className="truncate text-xs font-semibold text-slate-700">
                      {doctor.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-slate-900">
                    {doctor.appointments}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor:
                        index === 0 ? COLORS.blue : COLORS.lightBlue,
                    }}
                  />
                </div>
              </div>
            );
          })}

          <p className="pt-2 text-xs text-slate-400">
            As barras representam o volume relativo ao médico com mais
            marcações, não a taxa de ocupação da agenda.
          </p>
        </div>
      )}
    </Panel>
  );
}

//
// LOADING / ERROR
//

function DashboardLoading() {
  return (
    <div role="status" className="animate-pulse space-y-6">
      <div className="h-20 rounded-2xl bg-slate-100" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-36 rounded-2xl bg-slate-100" />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-96 rounded-2xl bg-slate-100" />
        ))}
      </div>

      <span className="sr-only">A carregar dashboard...</span>
    </div>
  );
}

//
// MAIN DASHBOARD
//

export default function DashboardPage() {
  const { data, isLoading, isError, isFetching, refetch } = useDashboard();

  if (isLoading) {
    return (
      <PageContainer
        title="Dashboard"
        description="Visão geral da atividade da clínica."
      >
        <DashboardLoading />
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer
        title="Dashboard"
        description="Visão geral da atividade da clínica."
      >
        <div
          role="alert"
          className="rounded-2xl border border-slate-200 bg-white p-10 text-center"
        >
          <CircleAlert className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Não foi possível carregar a Dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ocorreu um erro ao consultar os dados da clínica.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </PageContainer>
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

  const metrics: MetricCardProps[] = [
    {
      title: "Consultas hoje",
      value: numberFormatter.format(summary.appointmentsToday),
      subtitle: "Agenda clínica de hoje",
      icon: CalendarCheck2,
      color: "blue",
    },
    {
      title: "Pacientes",
      value: numberFormatter.format(summary.totalPatients),
      subtitle: "Total de pacientes registados",
      icon: Users,
      color: "blue",
    },
    {
      title: "Médicos ativos",
      value: numberFormatter.format(summary.activeDoctors),
      subtitle: "Profissionais disponíveis",
      icon: Stethoscope,
      color: "blue",
    },
    {
      title: "Marcações no mês",
      value: numberFormatter.format(summary.monthlyAppointments),
      subtitle: "Total de marcações mensais",
      icon: CalendarDays,
      color: "blue",
    },
    {
      title: "Receita prevista",
      value: formatCurrency(summary.monthlyExpectedRevenue),
      subtitle: "Estimativa do mês atual",
      icon: TrendingUp,
      color: "orange",
    },
    {
      title: "Cancelamentos",
      value: `${summary.cancellationRate}%`,
      subtitle: "Taxa mensal de cancelamento",
      icon: XCircle,
      color: "red",
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description="Visão geral da atividade da clínica."
    >
      <div className="space-y-6 pb-8">
        {/* WELCOME HEADER */}

        {/* SIX KPI CARDS */}

        <section
          aria-label="Indicadores principais"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </section>

        {/* GRÁFICOS HISTÓRICOS */}

        <DashboardAnalyticsCharts
          activity={monthlyActivity}
          revenue={monthlyRevenue}
        />

        {/* RESTANTES GRÁFICOS */}

        <section
          aria-label="Análise de atividade"
          className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3"
        >
          <AppointmentsChart appointments={todayAppointments} />
          <StatusChart metrics={statusMetrics} />
          <WorkloadChart doctors={doctorWorkload} />
        </section>

        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Visão geral da clínica
              <span className="ml-2">☀️</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Aqui está o resumo da atividade da tua clínica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              {formatDashboardDate(new Date())}
            </div>

            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
          </div>
        </header>

        {/* SIX KPI CARDS */}

        <section
          aria-label="Indicadores principais"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </section>

        {/* THREE CHARTS */}

        <section
          aria-label="Análise de atividade"
          className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3"
        >
          <AppointmentsChart appointments={todayAppointments} />

          <StatusChart metrics={statusMetrics} />

          <WorkloadChart doctors={doctorWorkload} />
        </section>

        {/* APPOINTMENT TABLES */}

        <section
          aria-label="Agenda clínica"
          className="grid gap-5 xl:grid-cols-[1.4fr_1fr]"
        >
          <TodayAppointments appointments={todayAppointments} />

          <UpcomingAppointments appointments={upcomingAppointments} />
        </section>

        {/* ALERTS AND QUICK ACTIONS */}

        <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <DashboardAlerts alerts={alerts} />

          <Panel
            title="Acessos rápidos"
            subtitle="Principais áreas de gestão clínica"
          >
            <div className="space-y-3">
              <Link
                to="/appointments"
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4" />
                  Gerir marcações
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/patients"
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-3">
                  <Users className="h-4 w-4" />
                  Gerir pacientes
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/doctors"
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-3">
                  <Stethoscope className="h-4 w-4" />
                  Gerir médicos
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Panel>
        </section>

        {/* FOOTER */}

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
          <span>Clinic SaaS · Painel de gestão clínica</span>

          <span className="flex items-center gap-2">
            <Clock3 className="h-3.5 w-3.5" />
            Dados provenientes da Fake API local
          </span>
        </footer>
      </div>
    </PageContainer>
  );
}
