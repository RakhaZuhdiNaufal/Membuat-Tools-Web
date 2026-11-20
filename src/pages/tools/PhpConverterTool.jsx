import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  FileCode2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Database,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Terminal,
  Globe
} from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, ErrorState } from '../../components/LoadingState';

const SAMPLE_REACT_INPUT = `// Komponen Form React yang ingin dihubungkan ke PHP REST API
import React, { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'developer' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kirim payload JSON ke endpoint PHP backend (api.php)
    const res = await fetch("http://localhost/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    setStatus(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-md">
      <input 
        type="text" 
        placeholder="Nama Lengkap" 
        value={formData.name} 
        onChange={e => setFormData({...formData, name: e.target.value})} 
        required 
      />
      <input 
        type="email" 
        placeholder="Alamat Email" 
        value={formData.email} 
        onChange={e => setFormData({...formData, email: e.target.value})} 
        required 
      />
      <button type="submit">Kirim ke Backend PHP</button>
    </form>
  );
}`;

export default function PhpConverterTool() {
  const { user } = useAuth();
  const location = useLocation();
  const initialInput = location.state?.prompt || SAMPLE_REACT_INPUT;
  const [reactInput, setReactInput] = useState(initialInput);
  const [integrationMode, setIntegrationMode] = useState('Full REST API Endpoint');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phpOutput, setPhpOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (location.state?.prompt) {
      setReactInput(location.state.prompt);
      handleConvert(location.state.prompt);
    }
  }, [location.state]);

  const handleConvert = async (inputOverride) => {
    const textToUse = (typeof inputOverride === 'string' ? inputOverride : reactInput).trim();
    if (!textToUse) {
      setError('Harap masukkan kode React atau spesifikasi endpoint.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.convertReactToPhpApi({
        react_code: textToUse,
        mode: integrationMode,
        user_id: user?.id
      });

      if (res.status === 'success' && res.result) {
        setPhpOutput(res.result);
      } else {
        setError(res.message || 'Gagal menghasilkan backend PHP.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!phpOutput) return;
    navigator.clipboard.writeText(phpOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!phpOutput) return;
    const blob = new Blob([phpOutput], { type: 'application/x-httpd-php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api.php';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border dark:border-dark-border">
        <div className="flex items-center space-x-3">
          <Link
            to="/tools"
            className="p-2 rounded-xl bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border text-brand-text-secondary hover:text-brand-text-primary dark:text-dark-muted dark:hover:text-dark-text transition-colors"
            title="Kembali ke Katalog Tools"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-brand-text-primary dark:text-dark-text tracking-tight">
                React to PHP REST API Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent border border-brand-border/50 dark:border-dark-border/50">
                React & PHP Backend
              </span>
            </div>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted mt-0.5">
              Hubungkan antarmuka React / React Native Anda dengan backend REST API PHP (api.php) yang menangani CORS, JSON, sanitasi, dan database.
            </p>
          </div>
        </div>

        {phpOutput && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-dark-surface hover:bg-brand-light dark:hover:bg-dark-card border border-brand-border dark:border-dark-border text-xs font-bold text-brand-primary dark:text-brand-accent transition-colors flex items-center space-x-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download api.php</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode PHP'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mode Selector and Quick Actions */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-1.5">
              Pilih Arsitektur REST API PHP
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'Full REST API Endpoint', label: '1. Endpoint REST API (GET, POST, OPTIONS)' },
                { id: 'Form Handling & Sanitization', label: '2. Sanitasi JSON & Validasi Input Defensif' },
                { id: 'Database PDO Integration', label: '3. Query Database PDO / MySQLi Prepared' },
                { id: 'JWT & Token Auth Handler', label: '4. Session & Bearer Token Authentication' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setIntegrationMode(m.id)}
                  type="button"
                  className={`px-3 py-2 text-xs font-semibold rounded-xl text-left border transition-all ${
                    integrationMode === m.id
                      ? 'border-brand-primary bg-brand-light/60 text-brand-primary dark:border-brand-accent dark:bg-dark-card dark:text-brand-accent font-bold ring-1 ring-brand-primary dark:ring-brand-accent'
                      : 'border-brand-border dark:border-dark-border text-brand-text-secondary dark:text-dark-muted hover:bg-brand-bg/50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <button
              onClick={handleConvert}
              disabled={loading || !reactInput.trim()}
              className="w-full py-3 bg-brand-primary hover:bg-brand-secondary text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>Merancang Backend PHP...</span>
                </>
              ) : (
                <>
                  <FileCode2 className="w-4 h-4 text-brand-accent" />
                  <span>Generate Backend PHP REST API</span>
                </>
              )}
            </button>
            <button
              onClick={() => setReactInput(SAMPLE_REACT_INPUT)}
              type="button"
              className="text-[11px] font-semibold text-brand-secondary dark:text-brand-accent hover:underline text-center"
            >
              Muat Contoh Form React
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={handleConvert} />}

      {/* Split Code View: Input React vs Output PHP API */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[520px]">
        {/* Left: React Frontend Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
              <span>Kode Frontend React / React Native</span>
            </span>
            <span className="text-[11px] text-brand-text-secondary dark:text-dark-muted">
              Client fetch() & State
            </span>
          </div>

          <CodeEditor
            code={reactInput}
            onChange={setReactInput}
            language="javascript"
            readOnly={false}
            title="React Client"
            height="480px"
          />
        </div>

        {/* Right: Converted PHP REST API Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <FileCode2 className="w-4 h-4 text-emerald-600 dark:text-brand-accent" />
              <span>Backend REST API PHP (api.php)</span>
            </span>
            {phpOutput && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-brand-accent bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                JSON REST API
              </span>
            )}
          </div>

          <CodeEditor
            code={phpOutput || '// Klik tombol "Generate Backend PHP REST API" untuk menghasilkan file api.php siap pakai...'}
            language="php"
            readOnly={true}
            title="api.php (REST API)"
            height="480px"
            onRegenerate={handleConvert}
          />
        </div>
      </div>
    </div>
  );
}
