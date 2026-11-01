import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
    </div>
  );
}

export function ProtectedRoute() {
  const { accessToken, isInitialized } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  if (!isInitialized) {
    return <RouteLoader />;
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { accessToken, isInitialized } = useSelector(
    (state) => state.auth
  );

  if (!isInitialized) {
    return <RouteLoader />;
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}