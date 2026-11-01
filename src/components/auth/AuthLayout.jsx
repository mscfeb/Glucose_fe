import { Activity, ArrowUpRight, HeartPulse } from "lucide-react";
import AuthBrand, { TrustBadge } from "./AuthBrand";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left branding panel */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[40px] border-white/5" />
          <div className="absolute -bottom-40 -left-20 h-[450px] w-[450px] rounded-full border-[60px] border-white/5" />

          <div className="relative z-10">
            <div className="inline-block rounded-xl bg-white px-4 py-3">
              <AuthBrand />
            </div>
          </div>

          <div className="relative z-10 my-12 max-w-xl">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <HeartPulse size={36} />
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Understand your health.
              <br />
              <span className="text-blue-200">
                Own your progress.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-8 text-blue-100">
              Track your blood glucose readings, understand your
              patterns, and make informed decisions about your
              everyday health.
            </p>

            <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Activity size={23} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Your health journey
                </p>
                <p className="text-xs text-blue-100">
                  One reading at a time
                </p>
              </div>

              <ArrowUpRight className="ml-6 text-blue-200" />
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <TrustBadge />
            <p className="text-xs text-blue-100">
              © {new Date().getFullYear()} Sweety
            </p>
          </div>
        </section>

        {/* Right form panel */}
        <section className="flex min-h-screen flex-col px-5 py-7 sm:px-10 lg:px-12 xl:px-20">
          <div className="mb-12 lg:hidden">
            <AuthBrand />
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                  Welcome to Sweety
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  {subtitle}
                </p>
              </div>

              {children}

              {footer}
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} Sweety. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}