import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import {
  useRestoreSessionMutation,
  useLazyGetMeQuery,
} from "../../features/auth/authApi";

export default function AuthInitializer({ children }) {
  const isInitialized = useSelector(
    (state) => state.auth.isInitialized
  );

  const [restoreSession] = useRestoreSessionMutation();
  const [getMe] = useLazyGetMeQuery();

  const started = useRef(false);

  useEffect(() => {
    if (started.current || isInitialized) {
      return;
    }

    started.current = true;

    const initialize = async () => {
      try {
        const response = await restoreSession().unwrap();
        const payload = response?.data ?? response;

        if (payload?.accessToken && !payload?.user) {
          await getMe().unwrap();
        }
      } catch {
        // Session restoration failed. The user will be treated as logged out.
      }
    };

    initialize();
  }, [isInitialized, restoreSession, getMe]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

        <p className="text-sm font-medium text-slate-500">
          Restoring your session...
        </p>
      </div>
    );
  }

  return children;
}