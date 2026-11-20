import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  loading = false,
  color = '#123D2A'
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-brand-border dark:border-dark-border shadow-subtle animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-4 bg-gray-200 dark:bg-dark-card rounded"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-dark-card rounded-xl"></div>
        </div>
        <div className="w-16 h-8 bg-gray-300 dark:bg-dark-card rounded mb-2"></div>
        <div className="w-32 h-3 bg-gray-200 dark:bg-dark-card rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-brand-border dark:border-dark-border shadow-subtle hover:shadow-card transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary dark:text-dark-muted">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent group-hover:scale-105 transition-transform">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-brand-text-primary dark:text-dark-text tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 dark:text-brand-accent">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-brand-text-secondary dark:text-dark-muted font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
