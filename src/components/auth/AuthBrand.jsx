import { Activity, ShieldCheck } from "lucide-react";

export default function AuthBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <Activity size={25} strokeWidth={2.5} />
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Sweety<span className="text-blue-600">.</span>
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Your health, in control
        </p>
      </div>
    </div>
  );
}

export function TrustBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/10 px-4 py-2 text-sm text-blue-50">
      <ShieldCheck size={16} />
      Your health data stays private
    </div>
  );
}