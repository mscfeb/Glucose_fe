export default function StatCard({
  title,
  value,
  unit = "",
  description,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBackground = "bg-blue-50",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <div className="mt-3 flex items-baseline gap-1.5">
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">
              {value ?? "--"}
            </h3>

            {unit && (
              <span className="text-xs font-medium text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
        >
          <Icon size={22} />
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}