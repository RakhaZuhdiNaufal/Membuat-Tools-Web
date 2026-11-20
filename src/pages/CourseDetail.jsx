import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Code2,
  ChevronRight,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import { LoadingSpinner, ErrorState } from '../components/LoadingState';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active view tab: 'lessons' | 'challenges'
  const [activeTab, setActiveTab] = useState('lessons');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Challenge workspace state
  const [userCode, setUserCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    async function loadCourseDetail() {
      setLoading(true);
      setError(null);
      try {
        const [cRes, pRes] = await Promise.all([
          api.getCourseDetail(courseId),
          api.getUserProgress(user?.id)
        ]);

        if (cRes.status === 'success') {
          setCourse(cRes.course);
          setLessons(cRes.lessons || []);
          setChallenges(cRes.challenges || []);

          if (cRes.lessons && cRes.lessons.length > 0) {
            setSelectedLesson(cRes.lessons[0]);
          }
          if (cRes.challenges && cRes.challenges.length > 0) {
            setSelectedChallenge(cRes.challenges[0]);
            setUserCode(cRes.challenges[0].starter_code || '');
          }
        } else {
          setError(cRes.message || 'Gagal memuat detail kursus.');
        }

        if (pRes.status === 'success') {
          setUserProgress(pRes.progress || []);
        }
      } catch (err) {
        console.error('Course detail error:', err);
        setError('Terjadi masalah saat memuat data kursus.');
      } finally {
        setLoading(false);
      }
    }

    loadCourseDetail();
  }, [courseId, user]);

  const handleSelectChallenge = (ch) => {
    setSelectedChallenge(ch);
    setUserCode(ch.starter_code || '');
    setFeedback(null);
    setShowSolution(false);
  };

  const handleSubmitAnswer = async () => {
    if (!userCode.trim()) {
      alert('Silakan tuliskan jawaban kode Anda terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await api.submitChallenge({
        user_id: user?.id,
        course_id: courseId,
        challenge_id: selectedChallenge.id,
        submitted_code: userCode
      });

      if (res.status === 'success') {
        setFeedback(res.result);
        // Refresh progress
        const pRes = await api.getUserProgress(user?.id);
        if (pRes.status === 'success') {
          setUserProgress(pRes.progress || []);
        }
      } else {
        alert(res.message || 'Gagal mengirim evaluasi.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Gagal mengevaluasi kode.');
    } finally {
      setSubmitting(false);
    }
  };

  const isChallengeCompleted = (chId) => {
    return userProgress.some((p) => p.challenge_id === chId && p.status === 'Correct');
  };

  const completedCount = challenges.filter((c) => isChallengeCompleted(c.id)).length;
  const progressPercent = challenges.length > 0 ? Math.round((completedCount / challenges.length) * 100) : 0;

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-semibold text-brand-text-secondary dark:text-dark-muted font-mono">
          MEMUAT KURSUS & TANTANGAN...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState message={error || 'Kursus tidak ditemukan'} />
        <div className="mt-4 text-center">
          <Link
            to="/courses"
            className="text-xs font-bold text-brand-primary dark:text-brand-accent hover:underline inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Kembali ke Daftar Kursus</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary dark:text-dark-muted dark:hover:text-dark-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Kursus</span>
        </Link>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent border border-brand-border dark:border-dark-border">
          {course.difficulty} • {course.duration}
        </span>
      </div>

      {/* Course Header Banner */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-primary to-brand-secondary rounded-3xl p-6 sm:p-8 text-white shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{course.title}</h1>
            <p className="mt-2 text-xs sm:text-sm text-brand-light/80 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[200px]">
            <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-brand-light">
              <span>Progres Anda</span>
              <span className="text-brand-accent font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="mt-2 text-[11px] text-brand-light/70 text-right">
              {completedCount} dari {challenges.length} tantangan selesai
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Lessons vs Coding Challenges */}
      <div className="flex border-b border-brand-border dark:border-dark-border">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center space-x-2 px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'lessons'
              ? 'border-brand-primary dark:border-brand-accent text-brand-primary dark:text-brand-accent'
              : 'border-transparent text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi Pembelajaran ({lessons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center space-x-2 px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'challenges'
              ? 'border-brand-primary dark:border-brand-accent text-brand-primary dark:text-brand-accent'
              : 'border-transparent text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Coding Challenges ({challenges.length})</span>
        </button>
      </div>

      {/* TAB 1: LESSONS VIEW */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons List (1 col) */}
          <div className="bg-white dark:bg-dark-surface p-4 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-2 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary dark:text-dark-muted px-2 py-1">
              Daftar Modul Belajar
            </h3>
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedLesson?.id === lesson.id
                    ? 'bg-brand-primary text-white shadow-subtle'
                    : 'bg-brand-bg/60 dark:bg-dark-card/60 text-brand-text-primary dark:text-dark-text hover:bg-brand-light dark:hover:bg-dark-card'
                }`}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{lesson.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
              </button>
            ))}
          </div>

          {/* Lesson Content Viewer (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle">
            {selectedLesson ? (
              <div className="space-y-4">
                <div className="pb-4 border-b border-brand-border dark:border-dark-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary dark:text-brand-accent">
                    Modul {selectedLesson.order_number || 1}
                  </span>
                  <h2 className="text-xl font-black text-brand-text-primary dark:text-dark-text mt-1">
                    {selectedLesson.title}
                  </h2>
                </div>

                <div className="text-xs sm:text-sm text-brand-text-primary dark:text-dark-text leading-relaxed whitespace-pre-line font-sans">
                  {selectedLesson.content}
                </div>

                <div className="pt-6 border-t border-brand-border dark:border-dark-border flex justify-end">
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-colors inline-flex items-center space-x-1.5"
                  >
                    <span>Lanjut Kerjakan Tantangan</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-brand-text-secondary">Pilih modul di sebelah kiri untuk membaca materi.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CODING CHALLENGES VIEW */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challenge Selector (1 col) */}
          <div className="bg-white dark:bg-dark-surface p-4 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-2 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary dark:text-dark-muted px-2 py-1">
              Pilihan Tantangan
            </h3>
            {challenges.map((ch, idx) => {
              const solved = isChallengeCompleted(ch.id);
              const isSelected = selectedChallenge?.id === ch.id;

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-subtle'
                      : 'bg-brand-bg/60 dark:bg-dark-card/60 text-brand-text-primary dark:text-dark-text hover:bg-brand-light dark:hover:bg-dark-card'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    {solved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent'
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Challenge Workspace (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {selectedChallenge ? (
              <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-5">
                {/* Challenge Info */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary dark:text-brand-accent">
                      Tingkat: {selectedChallenge.difficulty}
                    </span>
                    {isChallengeCompleted(selectedChallenge.id) && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-brand-accent bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terselesaikan</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-brand-text-primary dark:text-dark-text">
                    {selectedChallenge.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-brand-text-secondary dark:text-dark-muted leading-relaxed">
                    {selectedChallenge.description}
                  </p>
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-2xl bg-brand-light/50 dark:bg-dark-card/50 border border-brand-border dark:border-dark-border">
                  <h4 className="text-xs font-bold text-brand-primary dark:text-brand-accent flex items-center space-x-1.5 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Instruksi Pengerjaan:</span>
                  </h4>
                  <p className="text-xs text-brand-text-primary dark:text-dark-text whitespace-pre-line leading-relaxed">
                    {selectedChallenge.instructions}
                  </p>
                </div>

                {/* Code Editor Area */}
                <div>
                  <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-2 flex items-center justify-between">
                    <span>Editor Jawaban Anda</span>
                    <span className="text-[11px] font-normal text-brand-text-secondary dark:text-dark-muted">
                      Tuliskan solusi kode Anda di bawah
                    </span>
                  </label>
                  <CodeEditor
                    code={userCode}
                    onChange={setUserCode}
                    language={
                      course.id.includes('html')
                        ? 'html'
                        : course.id.includes('css')
                        ? 'css'
                        : 'javascript'
                    }
                    readOnly={false}
                    title={selectedChallenge.title}
                    height="280px"
                  />
                </div>

                {/* Submit Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submitting || !userCode.trim()}
                      className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <LoadingSpinner size="sm" className="text-white" />
                          <span>Mengevaluasi Jawaban dengan AI...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Submit Answer</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      type="button"
                      className="px-3.5 py-2.5 text-xs font-semibold text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary border border-brand-border dark:border-dark-border rounded-xl transition-colors flex items-center space-x-1.5"
                    >
                      {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showSolution ? 'Tutup Solusi' : 'Petunjuk Solusi'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Evaluation Feedback Card */}
                {feedback && (
                  <div
                    className={`p-5 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-2 ${
                      feedback.status === 'Correct'
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {feedback.status === 'Correct' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-brand-accent" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        )}
                        <h4
                          className={`text-sm font-bold ${
                            feedback.status === 'Correct'
                              ? 'text-emerald-900 dark:text-emerald-300'
                              : 'text-amber-900 dark:text-amber-300'
                          }`}
                        >
                          {feedback.status === 'Correct' ? 'Jawaban Benar!' : 'Perlu Penyempurnaan'}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                          feedback.status === 'Correct'
                            ? 'bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                            : 'bg-amber-200/70 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                        }`}
                      >
                        Skor: {feedback.score} / 100
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        feedback.status === 'Correct'
                          ? 'text-emerald-800 dark:text-emerald-300/90'
                          : 'text-amber-800 dark:text-amber-300/90'
                      }`}
                    >
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Collapsible Suggested Solution */}
                {showSolution && (
                  <div className="pt-4 border-t border-brand-border dark:border-dark-border animate-in fade-in">
                    <h4 className="text-xs font-bold text-brand-text-primary dark:text-dark-text mb-2 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                      <span>Contoh Kode Solusi:</span>
                    </h4>
                    <CodeEditor
                      code={selectedChallenge.expected_result}
                      readOnly={true}
                      language={
                        course.id.includes('html')
                          ? 'html'
                          : course.id.includes('css')
                          ? 'css'
                          : 'javascript'
                      }
                      height="180px"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-brand-text-secondary">Pilih tantangan untuk mulai coding.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
