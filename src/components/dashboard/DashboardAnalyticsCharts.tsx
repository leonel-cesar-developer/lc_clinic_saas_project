import {
  Activity,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  MonthlyActivityMetric,
  MonthlyRevenueMetric,
} from "../../types/dashboard.types";

import { formatCurrency } from "../../utils/dashboard.utils";

// ============================================================
// TYPES
// ============================================================

interface DashboardAnalyticsChartsProps {
  activity: MonthlyActivityMetric[];
  revenue: MonthlyRevenueMetric[];
}

// ============================================================
// FORMATTERS
// ============================================================

const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-PT").format(value);

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("pt-PT", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value) + " €";

// ============================================================
// SHARED CARD
// ============================================================

interface AnalyticsCardProps {
  title: string;
  description: string;
  icon: typeof Activity;
  children: React.ReactNode;
}

function AnalyticsCard({
  title,
  description,
  icon: Icon,
  children,
}: AnalyticsCardProps) {
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </article>
  );
}

// ============================================================
// ACTIVITY CHART
// ============================================================

function MonthlyActivityChart({
  data,
}: {
  data: MonthlyActivityMetric[];
}) {
  const total = data.reduce(
    (sum, month) => sum + month.total,
    0,
  );

  return (
    <AnalyticsCard
      title="Evolução das marcações"
      description="Últimos seis meses · consultas concluídas e canceladas"
      icon={CalendarDays}
    >
      <div className="mb-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {formatNumber(total)}
        </span>

        <span className="text-xs text-slate-500">
          marcações no período
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 8,
              left: -20,
              bottom: 5,
            }}
            barGap={4}
          >
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <Tooltip
              formatter={(value, name) => [
                formatNumber(Number(value ?? 0)),
                String(name),
              ]}
              labelFormatter={(_label, payload) => {
                const item = payload?.[0]?.payload as
                  | MonthlyActivityMetric
                  | undefined;

                return item?.monthKey ?? "";
              }}
            />

            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
              wrapperStyle={{
                fontSize: 12,
              }}
            />

            <Bar
              dataKey="completed"
              name="Concluídas"
              fill="#2563eb"
              radius={[5, 5, 0, 0]}
              maxBarSize={34}
            />

            <Bar
              dataKey="cancelled"
              name="Canceladas"
              fill="#93c5fd"
              radius={[5, 5, 0, 0]}
              maxBarSize={34}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        O total inclui todos os estados. O gráfico compara
        apenas as marcações concluídas e canceladas.
      </p>
    </AnalyticsCard>
  );
}

// 
// REVENUE CHART
// 

function MonthlyRevenueChart({
  data,
}: {
  data: MonthlyRevenueMetric[];
}) {
  const total = data.reduce(
    (sum, month) => sum + month.expectedRevenue,
    0,
  );

  return (
    <AnalyticsCard
      title="Evolução da receita prevista"
      description="Últimos seis meses · estimativa baseada nas marcações"
      icon={TrendingUp}
    >
      <div className="mb-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {formatCurrency(total)}
        </span>

        <span className="text-xs text-slate-500">
          receita prevista no período
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 12,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
              tickFormatter={formatCompactCurrency}
            />

            <Tooltip
              formatter={(value) => [
                formatCurrency(Number(value ?? 0)),
                "Receita prevista",
              ]}
              labelFormatter={(_label, payload) => {
                const item = payload?.[0]?.payload as
                  | MonthlyRevenueMetric
                  | undefined;

                return item?.monthKey ?? "";
              }}
            />

            <Line
              type="monotone"
              dataKey="expectedRevenue"
              name="Receita prevista"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                fill: "#2563eb",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Estimativa calculada com os preços atuais dos
        serviços. Não representa pagamentos recebidos.
      </p>
    </AnalyticsCard>
  );
}

// 
// EXPORTED COMPONENT
// 

export function DashboardAnalyticsCharts({
  activity,
  revenue,
}: DashboardAnalyticsChartsProps) {
  return (
    <section
      aria-label="Análise histórica da clínica"
      className="grid gap-5 xl:grid-cols-2"
    >
      <MonthlyActivityChart data={activity} />

      <MonthlyRevenueChart data={revenue} />
    </section>
  );
}