import { Activity, Clock3 } from "lucide-react";

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSlot(slotName = "") {
  return slotName
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function RecentReadings({ readings = [] }) {
  const recentReadings = [...readings]
    .sort((a, b) => {
      const dateDifference = b.readingDate.localeCompare(a.readingDate);

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return (
        (b.slot?.displayOrder ?? b.slotId ?? 0) -
        (a.slot?.displayOrder ?? a.slotId ?? 0)
      );
    })
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent readings
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your latest glucose records
          </p>
        </div>

        <Activity className="text-blue-600" size={21} />
      </div>

      {recentReadings.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-slate-600">
            No readings yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your readings will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Slot</th>
                  <th className="pb-3 text-right font-medium">
                    Glucose
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentReadings.map((reading) => (
                  <tr
                    key={reading.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-4 text-sm font-medium text-slate-600">
                      {formatDate(reading.readingDate)}
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      {formatSlot(reading.slot?.slotName)}
                    </td>

                    <td className="py-4 text-right">
                      <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                        {reading.value} mg/dL
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {recentReadings.map((reading) => (
              <div
                key={reading.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {formatSlot(reading.slot?.slotName)}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 size={12} />
                    {formatDate(reading.readingDate)}
                  </p>
                </div>

                <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                  {reading.value} mg/dL
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}