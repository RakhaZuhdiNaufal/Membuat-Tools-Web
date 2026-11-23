import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  ChevronRight,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Code2,
  Terminal,
  Bookmark
} from 'lucide-react';
import { INITIAL_TUTORIALS } from '../services/mockData';

export default function Tutorials() {
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(INITIAL_TUTORIALS.map((t) => t.category))];

  const filteredTutorials = INITIAL_TUTORIALS.filter((tut) => {
    const matchesCategory =
      selectedCategory === 'All' || tut.category === selectedCategory;
    const matchesSearch =
      tut.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-secondary rounded-3xl p-6 sm:p-8 text-white shadow-card">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer Learning Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tutorial & Panduan Praktis Tools Web
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-brand-light/80 leading-relaxed">
            Kumpulan panduan komprehensif mulai dari dasar prompting, teknik debugging berbantuan AI, hingga strategi refactoring kode modern.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white shadow-subtle'
                  : 'bg-white dark:bg-dark-surface text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary dark:hover:text-dark-text border border-brand-border dark:border-dark-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik tutorial..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tut, index) => (
          <div
            key={tut.id}
            onClick={() => setSelectedTutorial(tut)}
            className="bg-white dark:bg-dark-surface rounded-3xl p-6 border border-brand-border dark:border-dark-border shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent">
                  {tut.category}
                </span>
                <span className="text-[11px] text-brand-text-secondary dark:text-dark-muted flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{tut.duration}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-brand-text-primary dark:text-dark-text group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors leading-snug">
                {tut.title}
              </h3>

              <p className="mt-2 text-xs text-brand-text-secondary dark:text-dark-muted line-clamp-3 leading-relaxed">
                {tut.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/60 dark:border-dark-border/60 flex items-center justify-between">
              <span className="text-xs font-medium text-brand-text-secondary dark:text-dark-muted">
                Step-by-step
              </span>
              <button className="inline-flex items-center space-x-1 text-xs font-bold text-brand-primary dark:text-brand-accent group-hover:translate-x-1 transition-transform">
                <span>Baca Panduan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tutorial Reader Modal */}
      {selectedTutorial && (
        <div className="fixed inset-0 bg-brand-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-brand-border dark:border-dark-border shadow-elevated animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-border dark:border-dark-border flex items-center justify-between bg-brand-bg/50 dark:bg-dark-card/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary dark:text-brand-accent">
                    {selectedTutorial.category} • {selectedTutorial.duration}
                  </span>
                  <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text">
                    {selectedTutorial.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedTutorial(null)}
                className="p-2 text-brand-text-secondary hover:text-brand-text-primary dark:text-dark-muted dark:hover:text-dark-text rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-brand-text-primary dark:text-dark-text leading-relaxed prose dark:prose-invert max-w-none">
              <p className="font-semibold text-brand-secondary dark:text-brand-accent">
                {selectedTutorial.description}
              </p>

              <div className="whitespace-pre-line font-sans text-brand-text-secondary dark:text-dark-muted">
                {selectedTutorial.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-brand-border dark:border-dark-border bg-brand-bg/30 dark:bg-dark-card/30 flex justify-end">
              <button
                onClick={() => setSelectedTutorial(null)}
                className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-colors"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
