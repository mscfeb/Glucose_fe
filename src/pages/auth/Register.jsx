import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(72, "Password cannot exceed 72 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (values) => values.password === values.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function Register({
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
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitForm = async (values) => {
    setNotice("");

    const { confirmPassword, ...payload } = values;

    if (onSubmit) {
      await onSubmit(payload);
      return;
    }

    setNotice(
      "Registration form validated successfully. Authentication API integration is the next step."
    );
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your blood glucose and understanding your health."
      footer={
        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form
        onSubmit={handleSubmit(submitForm)}
        className="space-y-4"
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
          label="Full name"
          name="name"
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

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
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <FormInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <p className="text-xs leading-5 text-slate-500">
          By creating an account, you agree to use Sweety responsibly
          to track and manage your glucose readings.
        </p>

        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}