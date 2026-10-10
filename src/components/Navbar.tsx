'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  CheckSquare,
  Sparkles,
  LogOut,
  Menu,
  X,
  User,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { UserProfile } from '@/types';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, toggleLanguage, theme, toggleTheme, t } = useApp();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            full_name: data.profile?.full_name || data.user.user_metadata?.full_name,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Task<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith('/dashboard')
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            {t.nav.dashboard}
          </Link>
        </nav>

        {/* Right CTA / Controls / User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={language === 'so' ? 'U beddel English' : 'Switch to Somali'}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Globe className="h-3.5 w-3.5 text-indigo-500" />
            <span>{language === 'so' ? 'SO 🇸🇴' : 'EN 🇬🇧'}</span>
          </button>

          {/* Theme Toggle (Day / Night Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Shid Habka Maalinta (Light Mode)' : 'Shid Habka Habeenka (Dark Mode)'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <User className="h-3.5 w-3.5 text-indigo-500" />
                <span className="max-w-[130px] truncate">{user.full_name || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t.nav.getStarted}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu and quick toggles */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Quick Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Quick Mobile Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-9 items-center justify-center rounded-xl border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
          >
            {language === 'so' ? 'SO' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white p-4 md:hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t.nav.dashboard}
            </Link>

            <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t.nav.loggedInAs}: <span className="font-semibold">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    {t.nav.signIn}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-medium text-white shadow"
                  >
                    {t.nav.getStarted}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
