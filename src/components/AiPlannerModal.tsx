'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2, Plus, Check, ArrowRight } from 'lucide-react';
import { AiTaskSuggestion, CreateTaskInput } from '@/types';
import { useApp } from '@/context/AppContext';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: CreateTaskInput) => Promise<boolean>;
}

export default function AiPlannerModal({ isOpen, onClose, onAddTask }: AiPlannerModalProps) {
  const { t } = useApp();
  const [goal, setGoal] = useState('');
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<AiTaskSuggestion[]>([]);
  const [addedIndices, setAddedIndices] = useState<number[]>([]);
  const [addingAll, setAddingAll] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError(t.aiModal.enterGoalError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setAddedIndices([]);

      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim(), count }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      setSuggestions(data.suggestions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingle = async (suggestion: AiTaskSuggestion, index: number) => {
    if (addedIndices.includes(index)) return;

    const success = await onAddTask({
      title: suggestion.title,
      description: suggestion.description,
      status: 'todo',
      priority: suggestion.priority,
    });

    if (success) {
      setAddedIndices((prev) => [...prev, index]);
    }
  };

  const handleAddAll = async () => {
    setAddingAll(true);
    for (let i = 0; i < suggestions.length; i++) {
      if (!addedIndices.includes(i)) {
        await handleAddSingle(suggestions[i], i);
      }
    }
    setAddingAll(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-indigo-100 bg-white p-6 shadow-2xl dark:border-indigo-950 dark:bg-slate-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.aiModal.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.aiModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t.aiModal.goalLabel}
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                required
                placeholder={t.aiModal.goalPlaceholder}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>{t.aiModal.planBtn}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{t.aiModal.targetSuggestions}</span>
            {[3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCount(num)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition ${
                  count === num
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {num} {t.aiModal.tasksCount}
              </button>
            ))}
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-600 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.aiModal.resultsTitle} ({suggestions.length})
              </h3>
              <button
                type="button"
                onClick={handleAddAll}
                disabled={addingAll || addedIndices.length === suggestions.length}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/60 disabled:opacity-40"
              >
                {addingAll ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
                {t.aiModal.addAll}
              </button>
            </div>

            <div className="space-y-3">
              {suggestions.map((item, index) => {
                const isAdded = addedIndices.includes(index);
                return (
                  <div
                    key={index}
                    className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      isAdded
                        ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-950/60 dark:bg-emerald-950/20'
                        : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span
                          className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            item.priority === 'high'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : item.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSingle(item, index)}
                      disabled={isAdded}
                      className={`flex shrink-0 items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>{t.aiModal.added}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>{t.aiModal.addSingle}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
