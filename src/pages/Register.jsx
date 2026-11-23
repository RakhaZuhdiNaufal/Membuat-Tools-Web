import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Terminal,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AtSign,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  Rocket,
  Code2,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoadingSpinner } from '../components/LoadingState';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (username.length < 3) {
      setError('Username minimal 3 karakter.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    setSubmitting(true);
    const result = await register(fullName, username, email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registrasi gagal. Silakan coba kembali.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg flex flex-col lg:grid lg:grid-cols-12 selection:bg-brand-accent selection:text-brand-dark transition-colors">
      
      {/* ========================================================= */}
      {/* LEFT SIDE: Brand & Value Highlights (Desktop / Tablet)   */}
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
                  FREE ACCESS
                </span>
              </div>
              <p className="text-[11px] text-brand-accent/70 font-mono tracking-wider">
                DEVELOPER COMMUNITY
              </p>
            </div>
          </div>
        </div>

        {/* Center: Value Proposition */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-light/90 backdrop-blur-md">
              <Rocket className="w-3.5 h-3.5 text-brand-accent" />
              <span>Mulai dalam Hitungan Detik</span>
            </div>
            <h1 className="text-2xl xl:text-3xl font-black tracking-tight leading-tight">
              Akselerasi Karier Coding Anda dengan Tools AI Modern
            </h1>
            <p className="text-xs xl:text-sm text-brand-light/80 leading-relaxed">
              Daftar sekarang untuk mendapatkan akses ke seluruh rangkaian generator kode, live preview sandbox, dan tantangan interaktif.
            </p>
          </div>

          {/* Benefit Cards */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center flex-shrink-0 text-brand-accent mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Full Access ke 6 AI Studios</h4>
                <p className="text-brand-light/70 text-[11px] mt-0.5 leading-normal">
                  Generator kode, pengubah arsitektur React ke PHP, studio React Native, dan Live Sandbox.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-300 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Interactive Coding Arena</h4>
                <p className="text-brand-light/70 text-[11px] mt-0.5 leading-normal">
                  Selesaikan modul HTML, CSS, JavaScript dengan penilaian instan dan solusi dari Claude AI.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 text-emerald-300 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Akun Aman & Terenkripsi</h4>
                <p className="text-brand-light/70 text-[11px] mt-0.5 leading-normal">
                  Password di-hash dengan standar SHA-256 dan terhubung ke database cloud Google Sheets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-light/70">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Pendaftaran Gratis & Instan</span>
          </div>
          <span className="font-mono text-[11px] text-brand-accent">No Credit Card Needed</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: Register Form                                 */}
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
            {/* Placeholder */}
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
              Buat Akun Baru 🚀
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-brand-text-secondary dark:text-dark-muted">
              Lengkapi data di bawah untuk membuat workspace Tools Web Anda.
            </p>
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
            
            {/* Grid 2 Kolom: Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-subtle"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                  Username
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="budidev"
                    className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-subtle"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
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

            {/* Grid 2 Kolom: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all shadow-subtle"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Requirement Hint */}
            <div className="text-[11px] text-brand-text-secondary dark:text-dark-muted flex items-center space-x-1.5 pt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <span>Gunakan minimal 6 karakter kombinasi huruf dan angka.</span>
            </div>

            {/* Terms of Service Disclaimer */}
            <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted leading-relaxed pt-1">
              Dengan membuat akun, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi platform Tools Web.
            </p>

            {/* Submit Button */}
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
                    <span>Daftar Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Login Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted">
              Sudah memiliki akun?{' '}
              <Link
                to="/login"
                className="font-bold text-brand-primary dark:text-brand-accent hover:underline ml-1"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom System Status */}
        <div className="mt-8 pt-4 border-t border-brand-border/60 dark:border-dark-border/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-text-secondary dark:text-dark-muted gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Tersinkronisasi dengan Google Sheets Cloud DB</span>
          </div>
          <p>© {new Date().getFullYear()} Tools Web. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
