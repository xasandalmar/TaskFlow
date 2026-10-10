'use client';

import { CheckCircle2, Clock, ListTodo, Layers } from 'lucide-react';
import { Task } from '@/types';
import { useApp } from '@/context/AppContext';

interface StatsOverviewProps {
  tasks: Task[];
}

export default function StatsOverview({ tasks }: StatsOverviewProps) {
  const { t } = useApp();
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Tasks */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.stats.total}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{total}</p>
          </div>
        </div>

        {/* To Do */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20 transition-colors">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            <ListTodo className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-800/80 dark:text-amber-300/80">{t.stats.todo}</p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{todo}</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-indigo-200/60 bg-indigo-50/40 p-4 shadow-xs dark:border-indigo-900/40 dark:bg-indigo-950/20 transition-colors">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-indigo-800/80 dark:text-indigo-300/80">{t.stats.inProgress}</p>
            <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{inProgress}</p>
          </div>
        </div>

        {/* Completed */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20 transition-colors">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-300/80">{t.stats.completed}</p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{completed}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-slate-600 dark:text-slate-400">{t.stats.rate}</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
