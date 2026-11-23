import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand-accent selection:text-brand-dark transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center shadow-elevated border border-brand-accent/40">
            <Terminal className="w-6 h-6 text-brand-accent" />
          </div>
          <span className="text-2xl font-black tracking-tight text-brand-dark dark:text-white">
            TOOLS <span className="text-brand-accent">WEB</span>
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-extrabold text-brand-text-primary dark:text-dark-text tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1 text-center text-xs text-brand-text-secondary dark:text-dark-muted">
          Masuk untuk mengakses AI coding tools dan progres belajar Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-dark-surface py-8 px-6 sm:px-10 shadow-elevated rounded-3xl border border-brand-border dark:border-dark-border">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
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
                  Forgot Password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-secondary dark:text-dark-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand-primary focus:ring-brand-accent border-brand-border"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-brand-text-secondary dark:text-dark-muted select-none"
              >
                Remember me for 7 days
              </label>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl shadow-md text-xs sm:text-sm font-bold text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all duration-200 disabled:opacity-50"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                ) : (
                  <>
                    <span>Login ke Tools Web</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Fill */}
          <div className="mt-6 pt-5 border-t border-brand-border dark:border-dark-border text-center">
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full py-2 px-3 text-xs font-semibold text-brand-secondary dark:text-brand-accent bg-brand-light dark:bg-dark-card hover:bg-brand-accent/20 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gunakan Akun Demo (1-Click Login)</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted">
              Belum memiliki akun?{' '}
              <Link
                to="/register"
                className="font-bold text-brand-primary dark:text-brand-accent hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-brand-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-2xl max-w-sm w-full p-6 border border-brand-border dark:border-dark-border shadow-elevated">
            <h3 className="text-sm font-bold text-brand-text-primary dark:text-dark-text mb-2">
              Lupa Password?
            </h3>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted mb-4 leading-relaxed">
              Untuk versi MVP, Anda dapat mengatur ulang password Anda langsung melalui menu <strong>Profile</strong> atau login menggunakan akun demo jika diperlukan.
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
