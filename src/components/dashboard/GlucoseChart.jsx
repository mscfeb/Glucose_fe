import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatShortDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

function buildDailyAverages(readings) {
  const grouped = readings.reduce((accumulator, reading) => {
    const date =
      typeof reading.readingDate === "string"
        ? reading.readingDate.slice(0, 10)
        : new Date(reading.readingDate).toISOString().slice(0, 10);

    if (!accumulator[date]) {
      accumulator[date] = { total: 0, count: 0 };
    }

    accumulator[date].total += Number(reading.value);
    accumulator[date].count += 1;

    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([date, values]) => ({
      date,
      label: formatShortDate(date),
      average: Number((values.total / values.count).toFixed(1)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500">
        {formatShortDate(payload[0].payload.date)}
      </p>
      <p className="mt-1 text-lg font-bold text-blue-700">
        {payload[0].value}{" "}
        <span className="text-xs font-medium text-slate-500">mg/dL</span>
      </p>
    </div>
  );
}

export default function GlucoseChart({
  readings = [],
  title = "Glucose trends",
  subtitle = "Daily average glucose readings",
}) {
  const chartData = buildDailyAverages(readings);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center text-center">
          <div>
            <p className="font-semibold text-slate-700">
              No glucose data available
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Readings will appear here once you start tracking.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
                minTickGap={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 3, fill: "#2563EB", strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: "#DBEAFE", strokeWidth: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}