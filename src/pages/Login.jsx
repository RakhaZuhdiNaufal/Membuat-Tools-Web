import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoadingSpinner } from '../components/LoadingState';
import AuthIllustration from '../components/AuthIllustration';

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
    <div className="min-h-screen bg-[#18191C] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans selection:bg-[#0284C7] selection:text-white">
      
      {/* ========================================================= */}
      {/* BACKGROUND DECORATIVE ORNAMENTS (As seen in the Mockup)   */}
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
      {/* MAIN FLOATING CARD (Matches Design Mockup)                 */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-[#111915] text-[#1E293B] dark:text-slate-100 rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65)] overflow-hidden border border-white/10 transition-colors">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[620px]">
          
          {/* ===================================================== */}
          {/* LEFT SECTION: Fluid Wave & Developer Desk Illustration */}
          {/* ===================================================== */}
          <div className="lg:col-span-7 relative flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#F0F7FF] to-white dark:from-[#0E1713] dark:to-[#111915] overflow-hidden">
            {/* The Custom Vector Illustration */}
            <div className="w-full max-w-[480px] lg:max-w-none h-[280px] sm:h-[360px] lg:h-full flex items-center justify-center">
              <AuthIllustration className="w-full h-full max-h-[460px] object-contain drop-shadow-md" />
            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT SECTION: Brand, Inputs & Signature Action Button */}
          {/* ===================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 py-8 sm:py-12 bg-white dark:bg-[#111915]">
            
            <div className="w-full max-w-sm mx-auto">
              {/* Brand Logo Header (Matches 'docjus' styling in mockup) */}
              <div className="text-center mb-7 sm:mb-8">
                <div className="inline-flex items-center justify-center space-x-2.5 mb-1.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shadow-md">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-white">
                    tools<span className="text-[#0284C7]">web</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Acesse sua conta / Masuk ke akun
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Form Inputs (Minimalist Underline / Border Style) */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                
                {/* Email Field */}
                <div>
                  <div className="relative border-b-2 border-slate-200 dark:border-slate-700/80 focus-within:border-[#0284C7] dark:focus-within:border-[#38BDF8] transition-colors py-1 flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-3 flex-shrink-0" />
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

                {/* Password Field */}
                <div>
                  <div className="relative border-b-2 border-slate-200 dark:border-slate-700/80 focus-within:border-[#0284C7] dark:focus-within:border-[#38BDF8] transition-colors py-1 flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-3 flex-shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha / Password"
                      className="w-full bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none py-1.5 pr-8"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password (Matches Mockup) */}
                <div className="flex items-center justify-between text-[11px] sm:text-xs pt-1">
                  <label className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#0284C7] focus:ring-[#0284C7] border-slate-300 dark:border-slate-600 accent-[#0284C7]"
                    />
                    <span>Manter-me conectado</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    className="text-[#0284C7] dark:text-[#38BDF8] hover:underline font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                {/* SIGNATURE PILL ACTION BUTTON (Exact Match to Mockup) */}
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
                      {submitting ? 'PROCESSANDO...' : 'ENTRAR'}
                    </span>
                  </button>
                </div>

                {/* Quick 1-Click Demo Login Pill */}
                <div className="pt-2 text-center">
                  <button
                    onClick={handleDemoLogin}
                    disabled={submitting}
                    type="button"
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/40 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>1-Click Demo Login (Akun Pengujian)</span>
                  </button>
                </div>

                {/* Bottom Register Link (Matches "Crie uma conta") */}
                <div className="pt-4 text-center">
                  <Link
                    to="/register"
                    className="text-xs text-[#0284C7] dark:text-[#38BDF8] hover:underline font-semibold"
                  >
                    Crie uma conta / Daftar akun baru
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2922] rounded-3xl max-w-sm w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-2xl text-[#0F172A] dark:text-white animate-fadeIn">
            <h3 className="text-base font-bold mb-2">Esqueceu a senha?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Anda dapat masuk langsung menggunakan <strong>1-Click Demo Login</strong> atau mengatur ulang kata sandi melalui menu Profile setelah berhasil masuk.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setForgotModal(false);
                  handleDemoLogin();
                }}
                className="w-full py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded-full hover:bg-[#0369A1] transition-colors"
              >
                Entrar com Demo
              </button>
              <button
                onClick={() => setForgotModal(false)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Fechar / Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
