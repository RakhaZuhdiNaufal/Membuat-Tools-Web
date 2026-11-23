import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  AtSign,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoadingSpinner } from '../components/LoadingState';
import AuthIllustration from '../components/AuthIllustration';

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
      setError('Konfirmasi password tidak cocok.');
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
    <div className="min-h-screen bg-[#18191C] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans selection:bg-[#0284C7] selection:text-white">
      
      {/* ========================================================= */}
      {/* BACKGROUND DECORATIVE ORNAMENTS (Matches Mockup)          */}
      {/* ========================================================= */}
      {/* Top Dashed Green Curved Line */}
      <div className="absolute -top-32 -left-20 w-[420px] h-[320px] border-4 border-dashed border-[#22C55E]/40 rounded-[120px] pointer-events-none transform -rotate-12" />
      <div className="absolute top-10 left-1/3 w-64 h-64 border-2 border-dashed border-[#22C55E]/20 rounded-full pointer-events-none" />

      {/* Bottom Right Glowing Solid Curved Lines (Blue & Green) */}
      <div className="absolute -bottom-24 -right-16 w-[450px] h-[400px] border-[5px] border-[#0284C7]/40 rounded-[100px] pointer-events-none transform rotate-12" />
      <div className="absolute -bottom-36 right-36 w-[350px] h-[350px] border-[4px] border-[#22C55E]/30 rounded-[90px] pointer-events-none transform -rotate-6" />

      {/* Subtle Glow Spheres */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Theme Switcher (Top Right Corner) */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          type="button"
          className="p-3 rounded-2xl bg-[#22242A]/80 hover:bg-[#2B2E36] border border-white/10 text-slate-300 hover:text-white backdrop-blur-md shadow-xl transition-all"
          title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>
      </div>

      {/* ========================================================= */}
      {/* MAIN FLOATING CARD (Matches Mockup Design)                 */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-[#111915] text-[#1E293B] dark:text-slate-100 rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65)] overflow-hidden border border-white/10 transition-colors">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[640px]">
          
          {/* ===================================================== */}
          {/* LEFT SECTION: Fluid Wave & Developer Desk Illustration */}
          {/* ===================================================== */}
          <div className="lg:col-span-6 relative flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#F0F7FF] to-white dark:from-[#0E1713] dark:to-[#111915] overflow-hidden">
            <div className="w-full max-w-[460px] lg:max-w-none h-[250px] sm:h-[340px] lg:h-full flex items-center justify-center">
              <AuthIllustration className="w-full h-full max-h-[460px] object-contain drop-shadow-md" />
            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT SECTION: Registration Form                      */}
          {/* ===================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 py-8 sm:py-10 bg-white dark:bg-[#111915]">
            
            <div className="w-full max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center space-x-2.5 mb-1.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shadow-md">
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
                    tools<span className="text-[#0284C7]">web</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Crie sua conta / Buat akun baru
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Form Inputs (Minimalist Underline / Border Style) */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 2-Column Grid: Full Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div className="relative border-b-2 border-slate-200 dark:border-slate-700/80 focus-within:border-[#0284C7] dark:focus-within:border-[#38BDF8] transition-colors py-1 flex items-center">
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none py-1.5"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="relative border-b-2 border-slate-200 dark:border-slate-700/80 focus-within:border-[#0284C7] dark:focus-within:border-[#38BDF8] transition-colors py-1 flex items-center">
                    <AtSign className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="Nome de usuário"
                      className="w-full bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none py-1.5"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <div className="relative border-b-2 border-slate-200 dark:border-slate-700/80 focus-within:border-[#0284C7] dark:focus-within:border-[#38BDF8] transition-colors py-1 flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none py-1.5"
                      required
                    />
                  </div>
                </div>

                {/* 2-Column Grid: Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Password */}
                  <div className="relative border-b-2 border-slate-200 dark:border-slate-700/80 focus-within:border-[#0284C7] dark:focus-within:border-[#38BDF8] transition-colors py-1 flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha (min. 6)"
                      className="w-full bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none py-1.5 pr-7"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? 'Sembunyikan' : 'Lihat'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative border-b-2 border-slate-200 dark:border-slate-700/80 focus-within:border-[#0284C7] dark:focus-within:border-[#38BDF8] transition-colors py-1 flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmar senha"
                      className="w-full bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none py-1.5"
                      required
                    />
                  </div>
                </div>

                {/* Password hint */}
                <p className="text-[11px] text-slate-400 pt-0.5">
                  Gunakan minimal 6 karakter kombinasi alfanumerik.
                </p>

                {/* SIGNATURE PILL ACTION BUTTON */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full group relative flex items-center justify-center bg-[#0284C7] hover:bg-[#0369A1] active:scale-[0.99] text-white py-2 px-3 rounded-full shadow-lg shadow-sky-500/25 transition-all duration-200 disabled:opacity-50"
                  >
                    {/* Left Circular Arrow Badge */}
                    <span className="absolute left-1.5 w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-sm group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    
                    {/* Center Text */}
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase pl-6 pr-2">
                      {submitting ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
                    </span>
                  </button>
                </div>

                {/* Bottom Login Link */}
                <div className="pt-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Já tem uma conta?{' '}
                    <Link
                      to="/login"
                      className="text-[#0284C7] dark:text-[#38BDF8] hover:underline font-semibold ml-1"
                    >
                      Entrar / Masuk di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
