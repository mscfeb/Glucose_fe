import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./components/auth/AuthInitializer";
import ToastProvider from "./components/ui/ToastProvider";

export default function App() {
  return (
    <ToastProvider>
      <AuthInitializer>
        <AppRoutes />
      </AuthInitializer>
    </ToastProvider>
  );
}