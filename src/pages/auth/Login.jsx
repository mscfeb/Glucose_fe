import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export default function Login({
  onSubmit,
  loading = false,
  serverError = "",
}) {
  const [notice, setNotice] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitForm = async (values) => {
    setNotice("");

    if (onSubmit) {
      await onSubmit(values);
      return;
    }

    setNotice(
      "Form validated successfully. Authentication API integration is the next step."
    );
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your glucose tracking dashboard."
      footer={
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Create account
          </Link>
        </p>
      }
    >
      <form
        onSubmit={handleSubmit(submitForm)}
        className="space-y-5"
        noValidate
      >
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700"
          >
            {notice}
          </div>
        )}

        <FormInput
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between gap-3">
          {/* <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 accent-blue-600"
            />
            Remember me
          </label> */}
          <div></div>

          <span className="text-xs text-slate-400">
            Secure sign in
          </span>
        </div>

        <Button type="submit" loading={loading}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}