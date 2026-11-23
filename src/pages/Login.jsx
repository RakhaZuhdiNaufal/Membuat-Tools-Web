import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Terminal,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  GraduationCap,
  Database,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoadingSpinner } from '../components/LoadingState';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Harap masukkan email dan password Anda.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password, rememberMe);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('developer@toolsweb.dev');
    setPassword('password');
    setSubmitting(true);
    const result = await login('developer@toolsweb.dev', 'password', true);
    setSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg flex flex-col lg:grid lg:grid-cols-12 selection:bg-brand-accent selection:text-brand-dark transition-colors">
      
      {/* ========================================================= */}
      {/* LEFT SIDE: Brand & Feature Showcase (Desktop / Tablet)   */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#07150F] via-[#0B251B] to-[#123D2A] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden border-r border-[#1A4532]">
        
        {/* Ambient Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-secondary/30 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#67B58A_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top: Logo & Version */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-secondary to-[#123D2A] border border-brand-accent/40 flex items-center justify-center shadow-glow">
              <Terminal className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight">
                  TOOLS <span className="text-brand-accent">WEB</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-accent/20 text-brand-accent rounded-full border border-brand-accent/30">
                  v1.0 LIVE
                </span>
              </div>
              <p className="text-[11px] text-brand-accent/70 font-mono tracking-wider">
                AI DEVELOPER STUDIO
              </p>
            </div>
          </div>
        </div>

        {/* Center: Hero Value Proposition & Interactive Cards */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-light/90 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>Ditenagai Anthropic Claude 3.5 Sonnet</span>
            </div>
            <h1 className="text-2xl xl:text-3xl font-black tracking-tight leading-tight">
              Kembangkan Software & Uji Kemampuan dengan AI Cerdas
            </h1>
            <p className="text-xs xl:text-sm text-brand-light/80 leading-relaxed">
              Ekosistem lengkap bagi programmer: 6 specialized AI tools, live code preview sandbox, serta kursus fundamental berpenilaian otomatis.
            </p>
          </div>

          {/* Interactive Feature Cards */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start space-x-3.5 hover:bg-white/[0.07] transition-all">
              <div className="w-8 h-8 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center flex-shrink-0 text-brand-accent mt-0.5">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">6 AI Specialized Studios</h4>
                <p className="text-brand-light/70 text-[11px] mt-0.5 leading-normal">
                  React Live Sandbox, Mobile React Native, PHP REST API, Image Gen & Video Storyboard.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start space-x-3.5 hover:bg-white/[0.07] transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-300 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Interactive Academy & AI Grading</h4>
                <p className="text-brand-light/70 text-[11px] mt-0.5 leading-normal">
                  Praktek coding langsung di browser dengan skor kelulusan dan saran perbaikan instan.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start space-x-3.5 hover:bg-white/[0.07] transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 text-emerald-300 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Cloud Database Google Sheets</h4>
                <p className="text-brand-light/70 text-[11px] mt-0.5 leading-normal">
                  Tersinkronisasi otomatis dengan Google Apps Script & offline browser storage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Social Proof & Security Badge */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-light/70">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-accent" />
            <span>SHA-256 Encrypted Session</span>
          </div>
          <span className="font-mono text-[11px] text-brand-accent">100% Serverless</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: Interactive Login Form                        */}
      {/* ========================================================= */}
      <div className="flex-1 lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative">
        
        {/* Top Bar: Mobile Brand & Theme Toggle */}
        <div className="flex items-center justify-between w-full mb-6 sm:mb-8">
          {/* Mobile-Only Logo */}
          <div className="flex items-center space-x-2.5 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center border border-brand-accent/40 shadow-sm">
              <Terminal className="w-4 h-4 text-brand-accent" />
            </div>
            <span className="text-lg font-black tracking-tight text-brand-dark dark:text-white">
              TOOLS <span className="text-brand-accent">WEB</span>
            </span>
          </div>

          <div className="hidden lg:block">
            {/* Empty placeholder to push toggle right */}
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border text-brand-text-secondary dark:text-dark-muted hover:text-brand-primary dark:hover:text-brand-accent shadow-subtle transition-all"
            title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-primary" />}
          </button>
        </div>

        {/* Main Card Form */}
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Header Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-primary dark:text-dark-text tracking-tight">
              Selamat Datang Kembali 👋
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-brand-text-secondary dark:text-dark-muted">
              Masuk ke akun Anda untuk mengakses AI tools dan progres belajar.
            </p>
          </div>

          {/* 🌟 Highlighted 1-Click Demo Login Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-brand-accent/15 to-teal-500/10 border border-brand-accent/40 shadow-subtle dark:bg-dark-card/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-brand-primary dark:text-brand-accent uppercase tracking-wider">
                  Akses Cepat Pengujian
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 font-semibold">
                Demo Ready
              </span>
            </div>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted leading-relaxed mb-3">
              Ingin meninjau platform tanpa mendaftar manual? Cukup klik tombol di bawah untuk masuk otomatis.
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={submitting}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-brand-dark bg-brand-accent hover:bg-emerald-400 active:scale-[0.99] shadow-sm transition-all duration-150 flex items-center justify-center space-x-2 group"
            >
              <Sparkles className="w-4 h-4 text-brand-dark group-hover:rotate-12 transition-transform" />
              <span>Gunakan Akun Demo (1-Click Login)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border dark:border-dark-border" />
            </div>
            <div className="relative inline-block px-3 text-xs uppercase tracking-wider bg-brand-bg dark:bg-dark-bg text-brand-text-secondary dark:text-dark-muted font-semibold">
              Atau masuk dengan email
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start space-x-2 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                Alamat Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@domain.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-subtle"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-brand-secondary dark:text-brand-accent hover:underline font-medium"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-subtle"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary dark:hover:text-white transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center space-x-2 text-xs text-brand-text-secondary dark:text-dark-muted cursor-pointer select-none">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-accent border-brand-border dark:border-dark-border dark:bg-dark-card accent-brand-primary"
                />
                <span>Ingat saya selama 7 hari</span>
              </label>
            </div>

            {/* Login Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl shadow-md text-xs sm:text-sm font-bold text-white bg-brand-primary hover:bg-brand-secondary active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all duration-150 disabled:opacity-50"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                ) : (
                  <>
                    <span>Masuk ke Akun Anda</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted">
              Belum memiliki akun?{' '}
              <Link
                to="/register"
                className="font-bold text-brand-primary dark:text-brand-accent hover:underline ml-1"
              >
                Daftar sekarang gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom System Status */}
        <div className="mt-8 pt-4 border-t border-brand-border/60 dark:border-dark-border/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-text-secondary dark:text-dark-muted gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Database Google Sheets Terhubung</span>
          </div>
          <p>© {new Date().getFullYear()} Tools Web. All rights reserved.</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-brand-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-sm w-full p-6 sm:p-7 border border-brand-border dark:border-dark-border shadow-elevated animate-fadeIn">
            <div className="w-10 h-10 rounded-2xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-secondary dark:text-brand-accent mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-text-primary dark:text-dark-text mb-2">
              Lupa Password?
            </h3>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted mb-5 leading-relaxed">
              Untuk kemudahan pengujian, Anda dapat masuk menggunakan <strong>1-Click Demo Login</strong> atau mengatur ulang kata sandi kapan saja melalui menu <strong>Profile</strong> setelah masuk.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setForgotModal(false);
                  handleDemoLogin();
                }}
                className="w-full py-2.5 bg-brand-accent text-brand-dark text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Masuk dengan Akun Demo</span>
              </button>
              <button
                onClick={() => setForgotModal(false)}
                className="w-full py-2.5 bg-brand-bg dark:bg-dark-card text-brand-text-secondary dark:text-dark-muted text-xs font-semibold rounded-xl hover:bg-brand-border dark:hover:bg-dark-border transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
