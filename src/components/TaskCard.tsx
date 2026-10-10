'use client';

import { useState } from 'react';
import { Calendar, Trash2, Edit3, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const { t, language } = useApp();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusToggle = async () => {
    let nextStatus: TaskStatus = 'todo';
    if (task.status === 'todo') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'completed';
    else nextStatus = 'todo';

    try {
      setUpdating(true);
      await onStatusChange(task.id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`${t.taskCard.confirmDelete} "${task.title}"?`)) {
      try {
        setDeleting(true);
        await onDelete(task.id);
      } finally {
        setDeleting(false);
      }
    }
  };

  const priorityStyles = {
    high: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
    medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
    low: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const statusIcons = {
    todo: <ListTodo className="h-3.5 w-3.5 text-amber-500" />,
    in_progress: <Clock className="h-3.5 w-3.5 text-indigo-500" />,
    completed: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  };

  const statusLabels: Record<TaskStatus, string> = {
    todo: language === 'so' ? 'Sugaya' : 'To Do',
    in_progress: language === 'so' ? 'Socda' : 'In Progress',
    completed: language === 'so' ? 'Dhamaystiran' : 'Completed',
  };

  const priorityLabels = {
    high: language === 'so' ? 'SARE' : 'HIGH',
    medium: language === 'so' ? 'DHEX' : 'MED',
    low: language === 'so' ? 'HOOSE' : 'LOW',
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md dark:bg-slate-900 ${
        task.status === 'completed'
          ? 'border-emerald-200/60 bg-emerald-50/10 dark:border-emerald-950/60'
          : 'border-slate-200/80 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-900'
      } ${updating || deleting ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Status badge button (clickable to advance) */}
          <button
            type="button"
            onClick={handleStatusToggle}
            title={t.taskCard.toggleStatusTitle}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:scale-105 active:scale-95 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
          >
            {statusIcons[task.status]}
            <span>{statusLabels[task.status]}</span>
          </button>

          {/* Priority Badge */}
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
              priorityStyles[task.priority] || priorityStyles.medium
            }`}
          >
            {priorityLabels[task.priority] || task.priority}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-semibold text-slate-900 dark:text-white line-clamp-2 ${
            task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Details & Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          {task.due_date ? (
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {formatDate(task.due_date, language)}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 italic">{t.taskCard.noDate}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            title={t.taskCard.editTitle}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            title={t.taskCard.deleteTitle}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
