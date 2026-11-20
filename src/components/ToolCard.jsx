import React from 'react';
import {
  ArrowRight,
  Code2,
  BookOpen,
  Bug,
  Zap,
  Database,
  Layout,
  MessageSquareCode,
  FileCode2,
  Image,
  Video,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Code2,
  BookOpen,
  Bug,
  Zap,
  Database,
  Layout,
  MessageSquareCode,
  FileCode2,
  Image,
  Video,
  Smartphone
};

export default function ToolCard({ tool }) {
  const IconComponent = iconMap[tool.icon] || Code2;
  const targetUrl = tool.route || `/tools?tool=${tool.id}`;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 border border-brand-border dark:border-dark-border shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-all duration-200 shadow-xs">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent border border-brand-border/50 dark:border-dark-border/50">
            {tool.badge || tool.category}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-brand-text-primary dark:text-dark-text group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors leading-snug">
          {tool.name}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-brand-text-secondary dark:text-dark-muted line-clamp-3 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-brand-border/60 dark:border-dark-border/60 flex items-center justify-between">
        <span className="text-[11px] font-medium text-brand-text-secondary dark:text-dark-muted flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-brand-accent" />
          <span>Claude AI</span>
        </span>
        <Link
          to={targetUrl}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-primary/5 hover:bg-brand-primary text-brand-primary hover:text-white dark:bg-brand-accent/10 dark:text-brand-accent dark:hover:bg-brand-accent dark:hover:text-brand-dark text-xs font-bold transition-all group-hover:scale-102"
        >
          <span>Buka Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
