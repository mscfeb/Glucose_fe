import { LoaderCircle } from "lucide-react";

export default function Button({
  children,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
    >
      {loading && (
        <LoaderCircle size={18} className="animate-spin" />
      )}

      {loading ? "Please wait..." : children}
    </button>
  );
}