import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Code2,
  BookOpen,
  Bug,
  GraduationCap,
  Clock,
  ArrowRight,
  CheckCircle,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import ToolCard from '../components/ToolCard';
import { AVAILABLE_TOOLS } from '../services/mockData';
import { EmptyState, ErrorState, LoadingSpinner } from '../components/LoadingState';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_ai_requests: 0,
    tools_used: 0,
    courses_completed: 0,
    learning_progress: 0
  });
  const [activities, setActivities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, actRes, coursesRes] = await Promise.all([
          api.getDashboardStats(user?.id),
          api.getRecentActivities(user?.id, 6),
          api.getCourses()
        ]);

        if (statsRes.status === 'success') {
          setStats(statsRes.stats);
        }
        if (actRes.status === 'success') {
          setActivities(actRes.activities || []);
        }
        if (coursesRes.status === 'success') {
          setCourses((coursesRes.courses || []).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat beberapa statistik dashboard. Pastikan koneksi atau backend berjalan.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  // Quick access tools (First 4 from AVAILABLE_TOOLS)
  const quickAccessTools = AVAILABLE_TOOLS.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-dark via-brand-primary to-brand-secondary rounded-3xl p-6 sm:p-8 text-white shadow-card">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anthropic Claude Powered</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, <span className="text-brand-accent">{user?.full_name || user?.username || 'Developer'}</span>!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-brand-light/80 leading-relaxed">
            Percepat alur pemrograman Anda hari ini. Hasilkan kode, bedah logika algoritma, dan selesaikan coding challenges interaktif.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tools?tool=code-generator"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              <span>Buka AI Code Generator</span>
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-sm transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Lanjut Belajar Course</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Error alert if any */}
      {error && <ErrorState message={error} />}

      {/* 2. Statistics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text tracking-tight flex items-center space-x-2">
            <Activity className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
            <span>Statistik Penggunaan</span>
          </h2>
          <span className="text-xs text-brand-text-secondary dark:text-dark-muted">
            Data tersinkronisasi dengan database
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total AI Requests"
            value={stats.total_ai_requests}
            subtitle="Permintaan AI dieksekusi"
            icon={Zap}
            loading={loading}
          />
          <StatCard
            title="Tools Used"
            value={`${stats.tools_used} / ${AVAILABLE_TOOLS.length}`}
            subtitle="Variasi alat bantu aktif"
            icon={Layers}
            loading={loading}
          />
          <StatCard
            title="Courses Completed"
            value={stats.courses_completed}
            subtitle="Kurikulum diselesaikan"
            icon={GraduationCap}
            loading={loading}
          />
          <StatCard
            title="Learning Progress"
            value={`${stats.learning_progress}%`}
            subtitle="Tantangan coding berhasil"
            icon={CheckCircle}
            loading={loading}
          />
        </div>
      </div>

      {/* 3. Quick Access Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text tracking-tight flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
              <span>Quick Access Coding Tools</span>
            </h2>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted">
              Pilihan tools utama yang sering digunakan untuk pengembangan aplikasi
            </p>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-brand-primary dark:text-brand-accent hover:underline flex items-center space-x-1"
          >
            <span>Lihat Semua ({AVAILABLE_TOOLS.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* 4. Bottom Grid: Recent Activities & Recommended Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
              <span>Aktivitas Terbaru</span>
            </h3>
            <span className="text-[11px] text-brand-text-secondary dark:text-dark-muted font-medium">
              Riwayat Eksekusi
            </span>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : activities.length === 0 ? (
            <EmptyState
              title="Belum Ada Riwayat"
              description="Aktivitas eksekusi kode dan tantangan yang Anda kerjakan akan otomatis tercatat di sini."
              actionText="Mulai Generate Kode"
              onAction={() => window.location.hash = '#/tools'}
            />
          ) : (
            <div className="divide-y divide-brand-border/60 dark:divide-dark-border/60">
              {activities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 overflow-hidden mr-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-primary dark:text-brand-accent flex-shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-brand-text-primary dark:text-dark-text truncate">
                        {act.tool_name}
                      </p>
                      <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted truncate">
                        {act.prompt_summary || 'Menjalankan operasi coding'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        act.status === 'Success' || act.status === 'Correct'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {act.status}
                    </span>
                    <span className="text-[11px] text-brand-text-secondary/70 dark:text-dark-muted/70 whitespace-nowrap">
                      {new Date(act.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Courses (1 col) */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
                <span>Recommended Courses</span>
              </h3>
              <Link
                to="/courses"
                className="text-xs font-semibold text-brand-primary dark:text-brand-accent hover:underline"
              >
                Semua
              </Link>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="block p-3 rounded-2xl bg-brand-bg/60 dark:bg-dark-card/60 hover:bg-brand-light dark:hover:bg-dark-card border border-brand-border/60 dark:border-dark-border/60 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-brand-text-primary dark:text-dark-text truncate group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted truncate mt-0.5">
                        {course.difficulty} • {course.duration}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border dark:border-dark-border">
            <Link
              to="/courses"
              className="w-full flex items-center justify-center py-2 px-3 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-colors"
            >
              <span>Jelajahi Kurikulum Penuh</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
