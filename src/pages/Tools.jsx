import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
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
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Layers,
  Wand2
} from 'lucide-react';
import { AVAILABLE_TOOLS } from '../services/mockData';
import ToolCard from '../components/ToolCard';

const CATEGORIES = [
  'All',
  'AI Assistant & Prompt',
  'React & Frontend',
  'React Native & Mobile',
  'Full-Stack & Backend',
  'Media Creation',
  'Understanding',
  'Debugging',
  'Optimization',
  'Database'
];

export default function Tools() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = AVAILABLE_TOOLS.filter((t) => {
    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-primary to-brand-secondary rounded-3xl p-6 sm:p-8 text-white shadow-card">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anthropic Claude Generative Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Coding & Generative Tools Hub
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-brand-light/80 leading-relaxed">
            Pilih generator kartu di bawah ini untuk membuka halaman khusus: mulai dari ruang chat prompt interaktif, studio kode dengan live preview, konverter khusus HTML ke PHP, generator gambar, hingga video motion studio.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari generator atau tool..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-2xs"
          />
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
