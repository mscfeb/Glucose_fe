import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import GlucoseChart from "../../components/dashboard/GlucoseChart";

import {
  useGetMonthToDateReportQuery,
  useGetPreviousMonthReportQuery,
} from "../../features/reports/reportApi";

import { getApiErrorMessage } from "../../utils/apiError";

function getReportPayload(response) {
  return response?.data ?? response;
}

function getMonthLabel(period) {
  const now = new Date();
  const date =
    period === "current"
      ? now
      : new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const datePart =
    typeof dateString === "string"
      ? dateString.slice(0, 10)
      : new Date(dateString).toISOString().slice(0, 10);

  const [year, month, day] = datePart.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSlot(slotName) {
  if (!slotName) return "—";

  return slotName
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-56 rounded-lg bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-slate-200" />
      <div className="h-64 rounded-2xl bg-slate-200" />
    </div>
  );
}

function EmptyReport() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <BarChart3 size={26} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No readings for this period
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Once you add glucose readings, your monthly statistics and trends will
        appear here.
      </p>
    </div>
  );
}

function ReadingsTable({ readings }) {
  if (!readings.length) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <h2 className="font-bold text-slate-900">Reading history</h2>
        <p className="mt-1 text-sm text-slate-500">
          All glucose readings recorded during this period.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Reading slot</th>
              <th className="px-6 py-4 text-right font-semibold">
                Glucose level
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {readings.map((reading) => (
              <tr key={reading.id} className="hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                  {formatDate(reading.readingDate)}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {formatSlot(reading.slot?.slotName)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className="font-bold text-slate-900">
                    {reading.value}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">mg/dL</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function MonthlyReports() {
  const [period, setPeriod] = useState("current");

  const currentQuery = useGetMonthToDateReportQuery(undefined, {
    skip: period !== "current",
  });

  const previousQuery = useGetPreviousMonthReportQuery(undefined, {
    skip: period !== "previous",
  });

  const activeQuery =
    period === "current" ? currentQuery : previousQuery;

  const report = useMemo(
    () => getReportPayload(activeQuery.data),
    [activeQuery.data]
  );

  const summary = report?.summary ?? {};
  const readings = report?.readings ?? [];

  const hasReadings = readings.length > 0;

  if (activeQuery.isLoading) {
    return <LoadingState />;
  }

  if (activeQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-700">
          Unable to load monthly report
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {getApiErrorMessage(activeQuery.error)}
        </p>
        <button
          type="button"
          onClick={activeQuery.refetch}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Your health overview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Monthly Reports
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your glucose patterns and monthly statistics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm">
          <CalendarDays size={17} className="text-blue-600" />
          {getMonthLabel(period)}
          <ChevronDown size={15} className="text-slate-400" />
        </div>
      </div>

      {/* Period selector */}
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setPeriod("current")}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            period === "current"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          This month
        </button>

        <button
          type="button"
          onClick={() => setPeriod("previous")}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            period === "previous"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Previous month
        </button>
      </div>

      {activeQuery.isFetching && (
        <p className="text-xs font-medium text-blue-600">
          Updating report...
        </p>
      )}

      {!hasReadings ? (
        <EmptyReport />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Average glucose"
              value={summary.average ?? "—"}
              unit="mg/dL"
              description="Average for selected period"
              icon={Activity}
              iconColor="blue"
            />

            <StatCard
              title="Highest reading"
              value={summary.highest ?? "—"}
              unit="mg/dL"
              description="Maximum recorded level"
              icon={TrendingUp}
              iconColor="orange"
            />

            <StatCard
              title="Lowest reading"
              value={summary.lowest ?? "—"}
              unit="mg/dL"
              description="Minimum recorded level"
              icon={TrendingDown}
              iconColor="green"
            />

            <StatCard
              title="Total readings"
              value={summary.count ?? readings.length}
              unit="readings"
              description="Recorded during this period"
              icon={CalendarDays}
              iconColor="purple"
            />
          </div>

          {/* Trend chart */}
          <GlucoseChart
            readings={readings}
            title="Monthly glucose trend"
            subtitle={`Daily average glucose levels for ${getMonthLabel(period)}`}
          />

          {/* Detailed readings */}
          <ReadingsTable readings={readings} />
        </>
      )}

      <p className="text-xs leading-5 text-slate-400">
        These reports are intended for tracking purposes and are not a
        substitute for professional medical advice.
      </p>
    </div>
  );
}