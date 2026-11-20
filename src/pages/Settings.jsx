import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Shield,
  Bell,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Save,
  RefreshCw,
  Sliders,
  Eye,
  EyeOff,
  Cloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAnthropicKey, setAnthropicKey, api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingState';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Anthropic API Key configuration state
  const [apiKey, setApiKeyState] = useState(getAnthropicKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [codeAutoFormat, setCodeAutoFormat] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setAnthropicKey(apiKey);
    setConnectionStatus({
      success: true,
      message: apiKey.trim()
        ? 'Anthropic API Key berhasil disimpan! Aplikasi terhubung langsung ke Claude API.'
        : 'API Key dihapus. Aplikasi kembali ke mode Local Simulation.'
    });
    setTimeout(() => setConnectionStatus(null), 4000);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setConnectionStatus({
        success: false,
        message: 'Masukkan API Key Anthropic terlebih dahulu.'
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus(null);

    const isAlive = await api.testConnection(apiKey.trim());
    setTestingConnection(false);

    if (isAlive) {
      setConnectionStatus({
        success: true,
        message: 'Koneksi ke Anthropic Claude API berhasil diverifikasi!'
      });
    } else {
      setConnectionStatus({
        success: false,
        message: 'Gagal memverifikasi API Key. Pastikan format key benar (sk-ant-...) dan kuota aktif.'
      });
    }
  };

  const handleSavePreferences = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-brand-text-primary dark:text-dark-text tracking-tight flex items-center space-x-2.5">
          <SettingsIcon className="w-6 h-6 text-brand-secondary dark:text-brand-accent" />
          <span>Pengaturan & Preferensi</span>
        </h1>
        <p className="text-xs text-brand-text-secondary dark:text-dark-muted mt-1">
          Konfigurasikan API Anthropic Claude langsung, sesuaikan tema, dan preferensi editor.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferensi Anda berhasil disimpan!</span>
        </div>
      )}

      {/* 1. Direct Anthropic API Key Manager (No Apps Script required) */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
            <span>Anthropic Claude API (Koneksi Langsung)</span>
          </h2>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              apiKey
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
            }`}
          >
            {apiKey ? 'API Key Terhubung' : 'Local Engine Mode'}
          </span>
        </div>

        <p className="text-xs text-brand-text-secondary dark:text-dark-muted leading-relaxed">
          CODEFORGE terhubung langsung ke <strong>Anthropic Claude API</strong> tanpa memerlukan perantara Google Apps Script. Masukkan API Key Anthropic Anda di bawah untuk mengaktifkan AI secara live:
        </p>

        {connectionStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              connectionStatus.success
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200'
                : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 border border-red-200'
            }`}
          >
            {connectionStatus.success ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{connectionStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleSaveApiKey} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1">
              Anthropic API Key (sk-ant-...)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full pl-3.5 pr-10 py-2 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Key</span>
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-4 py-2 bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent hover:bg-brand-accent/20 border border-brand-border dark:border-dark-border text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                {testingConnection ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Uji API Key</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted mt-1.5">
              * API Key disimpan dengan aman di penyimpanan lokal (localStorage) browser Anda. Tanpa server pihak ketiga.
            </p>
          </div>
        </form>
      </div>

      {/* 2. Appearance / Tema */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-2">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-brand-accent" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>Appearance & Tema</span>
        </h2>
        <p className="text-xs text-brand-text-secondary dark:text-dark-muted">
          Pilih tema tampilan yang Anda sukai.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'light'
                ? 'border-brand-primary bg-brand-light/60 ring-2 ring-brand-primary'
                : 'border-brand-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-xs border border-gray-100">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-text-primary dark:text-dark-text">Light Mode</p>
                <p className="text-[11px] text-brand-text-secondary">Background putih bersih, teks kontras tinggi</p>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-brand-primary" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              theme === 'dark'
                ? 'border-brand-accent bg-[#0B251B] ring-2 ring-brand-accent'
                : 'border-brand-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#081B13] flex items-center justify-center text-brand-accent shadow-xs border border-[#1A4532]">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-text-primary dark:text-dark-text">Dark Green Mode</p>
                <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted">Nyaman untuk mata saat coding malam hari</p>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-brand-accent" />}
          </button>
        </div>
      </div>

      {/* 3. Notification & Editor Preferences */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
          <span>Editor & Notifikasi</span>
        </h2>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between py-2 border-b border-brand-border/60 dark:border-dark-border/60">
            <div>
              <p className="text-xs font-bold text-brand-text-primary dark:text-dark-text">
                Notifikasi Progres Kursus
              </p>
              <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted">
                Dapatkan notifikasi dalam aplikasi saat tantangan berhasil diselesaikan.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary focus:ring-brand-accent"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-brand-text-primary dark:text-dark-text">
                Format Kode Otomatis
              </p>
              <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted">
                Otomatis rapikan indentasi pada output AI Code Generator.
              </p>
            </div>
            <input
              type="checkbox"
              checked={codeAutoFormat}
              onChange={(e) => setCodeAutoFormat(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary focus:ring-brand-accent"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl transition-colors"
          >
            Simpan Preferensi
          </button>
        </div>
      </div>

      {/* 4. Session & Logout */}
      <div className="bg-red-50/50 dark:bg-red-950/20 p-6 rounded-3xl border border-red-200 dark:border-red-900/40 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-red-900 dark:text-red-300">Keluar dari Sesi</h3>
          <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">
            Akhiri sesi Anda pada perangkat ini dengan aman.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
