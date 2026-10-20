import { useMemo } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Patient } from "../../types/patient.types";

interface PatientsStatsProps {
  patients: Patient[];
}

/*
 * FIGMA PALETTE
 */

const COLORS = {
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",

  green: "#10B981",
  greenLight: "#D1FAE5",

  orange: "#F59E0B",
  orangeLight: "#FEF3C7",

  slate: "#CBD5E1",
};

/*
 * HELPERS
 */

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference =
    today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

export function PatientsStats({
  patients,
}: PatientsStatsProps) {

  /*  BASIC METRICS */

  const activePatients = patients.filter(
    (patient) => patient.status === "ACTIVE",
  ).length;

  const inactivePatients = patients.filter(
    (patient) => patient.status === "INACTIVE",
  ).length;

  const activePercentage =
    patients.length === 0
      ? 0
      : Math.round(
          (activePatients / patients.length) * 100,
        );

  const inactivePercentage =
    patients.length === 0
      ? 0
      : Math.round(
          (inactivePatients / patients.length) * 100,
        );

  /* PATIENT GROWTH */

  const patientGrowth = useMemo(() => {
    const monthFormatter = new Intl.DateTimeFormat(
      "pt-PT",
      {
        month: "short",
      },
    );

    const now = new Date();

    const months = Array.from(
      { length: 6 },
      (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - (5 - index),
          1,
        );

        return {
          year: date.getFullYear(),
          month: date.getMonth(),
          label: monthFormatter.format(date),
          total: 0,
        };
      },
    );

    for (const patient of patients) {
      const createdAt = new Date(patient.createdAt);

      const month = months.find(
        (item) =>
          item.year === createdAt.getFullYear() &&
          item.month === createdAt.getMonth(),
      );

      if (month) {
        month.total++;
      }
    }

    let accumulated = 0;

    return months.map((month) => {
      accumulated += month.total;

      return {
        month: month.label,
        patients: accumulated,
      };
    });
  }, [patients]);

  /* AGE DISTRIBUTION */

  const ageDistribution = useMemo(() => {
    const ranges = [
      {
        label: "0–17",
        min: 0,
        max: 17,
      },
      {
        label: "18–30",
        min: 18,
        max: 30,
      },
      {
        label: "31–45",
        min: 31,
        max: 45,
      },
      {
        label: "46–60",
        min: 46,
        max: 60,
      },
      {
        label: "60+",
        min: 61,
        max: Number.POSITIVE_INFINITY,
      },
    ];

    return ranges.map((range) => {
      const total = patients.filter((patient) => {
        const age = calculateAge(patient.birthDate);

        return age >= range.min && age <= range.max;
      }).length;

      return {
        range: range.label,
        total,
      };
    });
  }, [patients]);

  return (
    <section className="grid gap-4 lg:grid-cols-3">

      {/* 1 — PATIENT GROWTH */}

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Crescimento de pacientes
            </p>

            <div className="mt-2 flex items-end gap-2">
              <strong className="text-3xl font-semibold tracking-tight text-slate-900">
                {patients.length}
              </strong>

              <span className="mb-1 text-xs font-medium text-violet-600">
                pacientes
              </span>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            ↗
          </div>
        </div>

        <div className="mt-5 h-32">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={patientGrowth}>
              <defs>
                <linearGradient
                  id="patientsGrowthGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={COLORS.purple}
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="95%"
                    stopColor={COLORS.purple}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                }}
                formatter={(value) => [
                  value,
                  "Pacientes",
                ]}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#94A3B8",
                }}
              />

              <Area
                type="monotone"
                dataKey="patients"
                stroke={COLORS.purple}
                strokeWidth={2.5}
                fill="url(#patientsGrowthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* 2 — TOTAL PATIENTS */}

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total de pacientes
            </p>

            <strong className="mt-2 block text-3xl font-semibold tracking-tight text-slate-900">
              {patients.length}
            </strong>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            ↗
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 divide-x divide-slate-200">
          <div className="pr-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <p className="text-xs text-slate-500">
                Ativos
              </p>
            </div>

            <strong className="mt-2 block text-xl font-semibold text-slate-900">
              {activePatients}
            </strong>

            <span className="text-xs text-slate-400">
              {activePercentage}% do total
            </span>
          </div>

          <div className="pl-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-300" />

              <p className="text-xs text-slate-500">
                Inativos
              </p>
            </div>

            <strong className="mt-2 block text-xl font-semibold text-slate-900">
              {inactivePatients}
            </strong>

            <span className="text-xs text-slate-400">
              {inactivePercentage}% do total
            </span>
          </div>
        </div>

        {/* STATUS DISTRIBUTION */}

        <div className="mt-7">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
            {activePercentage > 0 && (
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{
                  width: `${activePercentage}%`,
                }}
              />
            )}

            {inactivePercentage > 0 && (
              <div
                className="h-full bg-slate-300 transition-all"
                style={{
                  width: `${inactivePercentage}%`,
                }}
              />
            )}
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>
              {activePercentage}% ativos
            </span>

            <span>
              {inactivePercentage}% inativos
            </span>
          </div>
        </div>
      </article>

      {/* =====================================================
          3 — AGE DISTRIBUTION
      ===================================================== */}

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Faixa etária
            </p>

            <div className="mt-2 flex items-end gap-2">
              <strong className="text-3xl font-semibold tracking-tight text-slate-900">
                {patients.length}
              </strong>

              <span className="mb-1 text-xs font-medium text-amber-600">
                registados
              </span>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            ↗
          </div>
        </div>

        <div className="mt-5 h-32">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={ageDistribution}>
              <CartesianGrid
                vertical={false}
                stroke="#F1F5F9"
              />

              <Tooltip
                cursor={{
                  fill: "#FFF7ED",
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                }}
                formatter={(value) => [
                  value,
                  "Pacientes",
                ]}
              />

              <XAxis
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94A3B8",
                }}
              />

              <YAxis hide />

              <Bar
                dataKey="total"
                fill={COLORS.orange}
                radius={[5, 5, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}