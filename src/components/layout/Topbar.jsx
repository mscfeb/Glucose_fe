import { Menu, LogOut, UserRound } from "lucide-react";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../../features/auth/authApi";

export default function Topbar({ onMenuClick, title }) {
  const user = useSelector((state) => state.auth.user);

  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // Local logout is handled by the mutation lifecycle.
    }
  };

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
            {title}
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            Your personal glucose overview
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
            {initials}
          </div>

          <div className="hidden xl:block">
            <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role || "Patient"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <LogOut size={17} />
          <span className="hidden sm:inline">
            {isLoading ? "Signing out" : "Logout"}
          </span>
        </button>
      </div>
    </header>
  );
}