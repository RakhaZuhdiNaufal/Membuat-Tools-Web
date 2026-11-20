import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`animate-spin text-brand-primary dark:text-brand-accent ${sizeMap[size] || sizeMap.md} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-brand-border dark:border-dark-border shadow-subtle animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-gray-200 dark:bg-dark-card rounded-xl"></div>
        <div className="w-16 h-5 bg-gray-200 dark:bg-dark-card rounded-full"></div>
      </div>
      <div className="w-3/4 h-5 bg-gray-300 dark:bg-dark-card rounded"></div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-200 dark:bg-dark-card rounded"></div>
        <div className="w-5/6 h-3 bg-gray-200 dark:bg-dark-card rounded"></div>
      </div>
      <div className="pt-4 border-t border-gray-100 dark:border-dark-border flex justify-between">
        <div className="w-20 h-4 bg-gray-200 dark:bg-dark-card rounded"></div>
        <div className="w-16 h-4 bg-gray-200 dark:bg-dark-card rounded"></div>
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'Tidak Ada Data',
  description = 'Belum ada data atau aktivitas yang dapat ditampilkan saat ini.',
  actionText,
  onAction,
  icon: Icon = Inbox
}) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-brand-border dark:border-dark-border p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-brand-text-primary dark:text-dark-text mb-1">
        {title}
      </h3>
      <p className="text-sm text-brand-text-secondary dark:text-dark-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat data dari server. Silakan coba kembali.',
  onRetry
}) {
  return (
    <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-red-900 dark:text-red-300 mb-1">{title}</h4>
      <p className="text-xs text-red-700 dark:text-red-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
