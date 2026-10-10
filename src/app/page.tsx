'use client';

import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ListTodo,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function HomePage() {
  const { t } = useApp();

  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10 blur-3xl dark:from-indigo-900/20 dark:via-violet-900/15" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>{t.home.badge}</span>
        </div>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
          {t.home.heroTitle1}{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {t.home.heroTitle2}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          {t.home.heroDesc}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/35 active:scale-95"
          >
            <span>{t.home.startFree}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span>{t.home.gotoDashboard}</span>
          </Link>
        </div>

        {/* Mock Preview Card */}
        <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-slate-200/80 bg-white/70 p-4 shadow-xl backdrop-blur-md sm:p-6 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.home.previewTitle}
              </span>
            </div>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              {t.home.previewBadge}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <ListTodo className="h-3.5 w-3.5" /> To Do
                </span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] dark:bg-amber-900/50">HIGH</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">UI/UX Design Concept</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Prepare wireframes, accessible colors, and light/dark themes.</p>
            </div>

            <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/40 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> In Progress
                </span>
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] dark:bg-indigo-900/50">HIGH</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Supabase Auth & Database</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PostgreSQL schema, RLS policies, and SSR cookie synchronization.</p>
            </div>

            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] dark:bg-emerald-900/50">MED</span>
              </div>
              <p className="text-sm font-semibold line-through text-slate-400 dark:text-slate-500">Next.js 15 Project Setup</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">App Router, TypeScript and Tailwind CSS configured.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/70 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.home.featuresHeading}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {t.home.featuresSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.home.feature1Title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.home.feature1Desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400 mb-5">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.home.feature2Title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.home.feature2Desc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.home.feature3Title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.home.feature3Desc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
