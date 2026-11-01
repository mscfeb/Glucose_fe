import {
  Activity,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import GlucoseChart from "../../components/dashboard/GlucoseChart";
// import RecentReadings from "../../components/dashboard/RecentReadings";
import ReadingManager from "../../components/readings/ReadingManager";

import {
  useGetDailyReportQuery,
  useGetMonthToDateReportQuery,
} from "../../features/reports/reportApi";

import { getApiErrorMessage } from "../../utils/apiError";

function getToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getReportPayload(response) {
  return response?.data ?? response;
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-24 rounded-2xl bg-slate-200" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-36 rounded-2xl bg-slate-200" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-2xl bg-slate-200" />
        <div className="h-96 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}

function ErrorPanel({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <p className="font-semibold text-slate-800">
        Unable to load dashboard
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}

export default function Dashboard() {
  const today = getToday();

  const {
    data: dailyResponse,
    isLoading: dailyLoading,
    isFetching: dailyFetching,
    error: dailyError,
    refetch: refetchDaily,
  } = useGetDailyReportQuery(today);

  const {
    data: monthResponse,
    isLoading: monthLoading,
    isFetching: monthFetching,
    error: monthError,
    refetch: refetchMonth,
  } = useGetMonthToDateReportQuery();

  const dailyReport = getReportPayload(dailyResponse);
  const monthReport = getReportPayload(monthResponse);

  const dailySummary = dailyReport?.summary ?? {};
  const monthReadings = monthReport?.readings ?? [];

  const isLoading = dailyLoading || monthLoading;

  const error = dailyError || monthError;

  const retry = () => {
    refetchDaily();
    refetchMonth();
  };

  const formattedDate = new Date(
    `${today}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorPanel
        message={getApiErrorMessage(error)}
        onRetry={retry}
      />
    );
  }

  return (
    <div className="space-y-7">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg shadow-blue-700/10 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-sm font-medium text-blue-100">
            Your health overview
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Today's glucose summary
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3">
          <CalendarDays size={21} />

          <div>
            <p className="text-xs text-blue-100">
              Today's readings
            </p>

            <p className="text-lg font-bold">
              {dailySummary.count ?? 0} / 4
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Average glucose"
          value={dailySummary.average}
          unit="mg/dL"
          description="Average for today"
          icon={Activity}
          iconColor="text-blue-600"
          iconBackground="bg-blue-50"
        />

        <StatCard
          title="Highest reading"
          value={dailySummary.highest}
          unit="mg/dL"
          description="Highest value recorded today"
          icon={TrendingUp}
          iconColor="text-orange-600"
          iconBackground="bg-orange-50"
        />

        <StatCard
          title="Lowest reading"
          value={dailySummary.lowest}
          unit="mg/dL"
          description="Lowest value recorded today"
          icon={TrendingDown}
          iconColor="text-emerald-600"
          iconBackground="bg-emerald-50"
        />

        <StatCard
          title="Total readings"
          value={dailySummary.count ?? 0}
          description="Readings recorded today"
          icon={CalendarDays}
          iconColor="text-indigo-600"
          iconBackground="bg-indigo-50"
        />
      </section>

      {/* Chart and recent readings */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GlucoseChart readings={monthReadings} />

        <ReadingManager />
      </section>

      {(dailyFetching || monthFetching) && (
        <p className="text-right text-xs text-slate-400">
          Updating dashboard...
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-xs leading-5 text-slate-400">
        Glucose statistics are provided for tracking purposes only.
        Interpret readings according to your healthcare professional's
        guidance.
      </p>
    </div>
  );
}