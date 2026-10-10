'use client';

import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} TaskFlow. {t.home.footerRights}</p>
        <p className="text-slate-400 dark:text-slate-500">
          Powered by Space Cloud
        </p>
      </div>
    </footer>
  );
}