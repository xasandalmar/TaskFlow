'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Sparkles,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { Task, CreateTaskInput, TaskStatus, UserProfile } from '@/types';
import StatsOverview from '@/components/StatsOverview';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import AiPlannerModal from '@/components/AiPlannerModal';
import { useApp } from '@/context/AppContext';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useApp();

  // User State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // 1. Check Authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login?redirect=/dashboard');
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            full_name: data.profile?.full_name || data.user.user_metadata?.full_name,
          });
        } else {
          router.push('/login?redirect=/dashboard');
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        router.push('/login?redirect=/dashboard');
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // 2. Fetch Tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (priorityFilter && priorityFilter !== 'all') params.set('priority', priorityFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      setTasks(data.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error occurred');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery]);

  useEffect(() => {
    if (!authChecking && user) {
      fetchTasks();
    }
  }, [authChecking, user, fetchTasks]);

  // 3. Create or Edit Task Handler
  const handleTaskSubmit = async (taskInput: CreateTaskInput): Promise<boolean> => {
    try {
      if (editingTask) {
        // Edit existing task
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskInput),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update task');
        }

        showFeedback(t.feedback.updated);
      } else {
        // Create new task
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskInput),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create task');
        }

        showFeedback(t.feedback.created);
      }

      await fetchTasks();
      return true;
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'Error occurred', 'error');
      return false;
    }
  };

  // 4. Status Toggle Handler
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Optimistic state update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
      showFeedback(t.feedback.statusChanged);
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'Error occurred', 'error');
      await fetchTasks();
    }
  };

  // 5. Delete Task Handler
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete task');
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      showFeedback(t.feedback.deleted);
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'Error occurred', 'error');
    }
  };

  // 6. Add Task from AI Suggestions
  const handleAddAiTask = async (taskInput: CreateTaskInput): Promise<boolean> => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskInput),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add task');
      }

      setTasks((prev) => [data.data, ...prev]);
      showFeedback(`"${taskInput.title}" ${t.feedback.addedFromAi}`);
      return true;
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'Error occurred', 'error');
      return false;
    }
  };

  if (authChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">{t.dashboard.authChecking}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold shadow-xl transition-all ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-rose-600 text-white shadow-rose-600/20'
          }`}
        >
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Greeting & Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {t.dashboard.greeting}, {user?.full_name || user?.email?.split('@')[0]} 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {t.dashboard.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/20 transition hover:from-violet-500 hover:to-indigo-500 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t.dashboard.aiPlannerBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>{t.dashboard.newTaskBtn}</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview tasks={tasks} />

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder={t.dashboard.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2 pr-3 pl-10 text-xs text-slate-900 placeholder-slate-400 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-1 dark:border-slate-800 dark:bg-slate-800/60">
            {[
              { id: 'all', label: t.dashboard.all },
              { id: 'todo', label: 'To Do' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === tab.id
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">{t.dashboard.allPriorities}</option>
              <option value="high">{t.dashboard.priorityHigh}</option>
              <option value="medium">{t.dashboard.priorityMedium}</option>
              <option value="low">{t.dashboard.priorityLow}</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchTasks}
            title={t.dashboard.refreshTitle}
            className="rounded-xl border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchTasks}
            className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-200"
          >
            {t.dashboard.retryBtn}
          </button>
        </div>
      )}

      {/* Task List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-44 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-800 mb-4" />
              <div className="h-5 w-3/4 rounded bg-slate-100 dark:bg-slate-800 mb-2" />
              <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center dark:border-slate-800 dark:bg-slate-900/50 transition-colors">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-4">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? t.dashboard.noResultsTitle
              : t.dashboard.emptyTitle}
          </h3>
          <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? t.dashboard.noResultsSubtitle
              : t.dashboard.emptySubtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>{t.dashboard.createFirstBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-xs font-semibold text-violet-700 shadow-2xs hover:bg-violet-100 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.dashboard.useAiBtn}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Grid of Task Cards */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
      />

      {/* AI Task Planner Modal */}
      <AiPlannerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddTask={handleAddAiTask}
      />
    </div>
  );
}
