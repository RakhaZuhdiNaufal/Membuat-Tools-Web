import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  Layers,
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorState } from '../components/LoadingState';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      setError(null);
      try {
        const [cRes, pRes] = await Promise.all([
          api.getCourses(),
          api.getUserProgress(user?.id)
        ]);

        if (cRes.status === 'success') {
          setCourses(cRes.courses || []);
        }
        if (pRes.status === 'success') {
          setUserProgress(pRes.progress || []);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
        setError('Gagal mengambil daftar kursus.');
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [user]);

  // Calculate completion percentage per course
  const getCourseProgress = (courseId) => {
    const courseChallengesSolved = userProgress.filter(
      (p) => p.course_id === courseId && p.status === 'Correct'
    );
    // Each course has 3 challenges
    const percentage = Math.min(100, Math.round((courseChallengesSolved.length / 3) * 100));
    return percentage;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-primary to-brand-secondary rounded-3xl p-6 sm:p-8 text-white shadow-card">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Interactive Learning Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Interactive Courses & Challenges
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-brand-light/80 leading-relaxed">
            Kuasai fondasi web development modern mulai dari HTML, CSS, hingga logika algoritma JavaScript dengan evaluasi jawaban instan berbasis Claude AI.
          </p>
        </div>
      </div>

      {error && <ErrorState message={error} />}

      {/* Courses List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text tracking-tight flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
            <span>Daftar Course Tersedia</span>
          </h2>
          <span className="text-xs text-brand-text-secondary dark:text-dark-muted">
            {courses.length} Kursus Aktif
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = getCourseProgress(course.id);
              const isCompleted = progress === 100;

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-dark-surface rounded-3xl overflow-hidden border border-brand-border dark:border-dark-border shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white border border-white/20">
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center space-x-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-brand-accent" />
                        <span>{course.duration}</span>
                      </span>
                      {isCompleted && (
                        <span className="flex items-center space-x-1 text-brand-accent font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Selesai</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-brand-text-primary dark:text-dark-text group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-xs text-brand-text-secondary dark:text-dark-muted line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-4 border-t border-brand-border/60 dark:border-dark-border/60">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-brand-text-secondary dark:text-dark-muted">
                          Progres Kursus
                        </span>
                        <span className="font-bold text-brand-primary dark:text-brand-accent">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-brand-light dark:bg-dark-card overflow-hidden">
                        <div
                          className="h-full bg-brand-accent rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/courses/${course.id}`}
                          className="w-full flex items-center justify-center py-2.5 px-4 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-sm transition-all group-hover:shadow-md"
                        >
                          <span>{progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Kursus'}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
