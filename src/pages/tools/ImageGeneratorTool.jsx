import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  Wand2,
  Layers,
  ExternalLink,
  History,
  Palette
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, ErrorState } from '../../components/LoadingState';

const STYLE_PRESETS = [
  { id: 'Modern 3D Minimalist Tech', label: '3D Minimalist Tech', desc: 'Gaya visual bersih, pencahayaan lembut, matte render' },
  { id: 'Dark Emerald Neon Cyberpunk', label: 'Emerald Cyberpunk', desc: 'Aksen hijau neon, background gelap sinematik, hologram' },
  { id: 'Flat Vector UI Illustration', label: 'Flat Vector UI', desc: 'Ilustrasi 2D modern untuk landing page SaaS' },
  { id: 'Isometric Developer Workspace', label: 'Isometric Workspace', desc: 'Sudut pandang isometrik meja kerja coding dan server' },
  { id: 'App Icon & Logo Emblem', label: 'App Icon / Logo', desc: 'Simbol ikon aplikasi modern berkontur tegas' }
];

const PROMPT_SUGGESTIONS = [
  'Futuristic coding workspace with holographic IDE in dark green emerald neon lights',
  'Minimalist 3D glassmorphism cube showing glowing programming code particles',
  'Modern developer working at ultra-clean desk with plant and curved monitor',
  'Abstract geometric neural network nodes connected by emerald green laser lines'
];

export default function ImageGeneratorTool() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('Futuristic coding workspace with holographic IDE in dark green emerald neon lights');
  const [style, setStyle] = useState('Modern 3D Minimalist Tech');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generated image result
  const [currentImage, setCurrentImage] = useState(
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'
  );
  const [enhancedPrompt, setEnhancedPrompt] = useState(
    'Ultra-detailed 3D render of a futuristic developer workstation, ambient emerald green illumination, sleek dark desk, glowing code interface, 8k resolution.'
  );
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Gallery of session creations
  const [historyImages, setHistoryImages] = useState([
    {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      prompt: 'Futuristic coding workspace with holographic IDE'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      prompt: 'Matrix green falling code abstract background'
    },
    {
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      prompt: 'Modern laptop with coding editor and warm coffee'
    }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Masukkan deskripsi gambar yang ingin Anda buat.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.generateImage({
        prompt: prompt.trim(),
        style,
        aspect_ratio: aspectRatio,
        user_id: user?.id
      });

      if (res.status === 'success' && res.image_url) {
        setCurrentImage(res.image_url);
        setEnhancedPrompt(res.enhanced_prompt || prompt);
        setHistoryImages((prev) => [
          { url: res.image_url, prompt: prompt.trim() },
          ...prev.slice(0, 7)
        ]);
      } else {
        setError(res.message || 'Gagal menghasilkan gambar.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentImage);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
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
                AI Image Generator for Developers
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                Visual Assets
              </span>
            </div>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted mt-0.5">
              Buat aset visual, banner landing page, ilustrasi UI, dan konsep grafis berkualitas tinggi dengan AI.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form & Parameter Controls */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-5">
        <div>
          <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-1.5">
            Prompt / Deskripsi Visual Gambar
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Deskripsikan aset visual yang Anda inginkan..."
              className="w-full p-4 text-xs sm:text-sm bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-2xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none transition-all"
            />
          </div>
        </div>

        {/* Suggestion Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-brand-text-secondary dark:text-dark-muted whitespace-nowrap">
            Ide Cepat:
          </span>
          {PROMPT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(s)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-brand-bg/80 dark:bg-dark-card hover:bg-brand-light dark:hover:bg-dark-card/80 border border-brand-border dark:border-dark-border rounded-lg text-brand-text-secondary hover:text-brand-text-primary dark:text-dark-muted dark:hover:text-dark-text whitespace-nowrap transition-colors"
            >
              {s.slice(0, 35)}...
            </button>
          ))}
        </div>

        {/* Style Presets and Aspect Ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-2 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-brand-secondary dark:text-brand-accent" />
              <span>Gaya Visual (Style Preset)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setStyle(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    style === p.id
                      ? 'border-brand-primary bg-brand-light/60 text-brand-primary dark:border-brand-accent dark:bg-dark-card dark:text-brand-accent font-bold ring-1 ring-brand-primary dark:ring-brand-accent'
                      : 'border-brand-border dark:border-dark-border text-brand-text-secondary dark:text-dark-muted hover:bg-brand-bg/50'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{p.label}</p>
                  <p className="text-[10px] opacity-75 line-clamp-1">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-2">
              Rasio Aspek
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['16:9', '1:1', '4:3'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                    aspectRatio === r
                      ? 'border-brand-primary bg-brand-light/60 text-brand-primary dark:border-brand-accent dark:bg-dark-card dark:text-brand-accent ring-1 ring-brand-primary'
                      : 'border-brand-border dark:border-dark-border text-brand-text-secondary dark:text-dark-muted hover:bg-brand-bg/50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                <span>Merender Gambar AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-brand-accent" />
                <span>Generate Gambar Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={handleGenerate} />}

      {/* Main Image Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rendered Image (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>Hasil Render Visual (8K High-Res)</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyUrl}
                className="px-2.5 py-1 text-xs font-semibold text-brand-primary dark:text-brand-accent hover:underline flex items-center space-x-1"
                title="Salin Link Gambar"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Link Tersalin!' : 'Salin URL'}</span>
              </button>
              <a
                href={currentImage}
                target="_blank"
                rel="noreferrer"
                download="codeforge-ai-image.jpg"
                className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-colors flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-brand-dark flex items-center justify-center min-h-[360px] border border-brand-border/60 dark:border-dark-border/60 group">
            <img
              src={currentImage}
              alt={prompt}
              className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-101"
            />
          </div>

          {/* Enhanced Prompt Details */}
          <div className="p-4 rounded-2xl bg-brand-bg/60 dark:bg-dark-card/60 border border-brand-border dark:border-dark-border text-xs space-y-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-brand-secondary dark:text-brand-accent">
                Enhanced AI Prompt:
              </span>
              <button
                onClick={handleCopyPrompt}
                className="text-[11px] font-semibold text-brand-primary dark:text-brand-accent hover:underline flex items-center space-x-1"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'Tersalin' : 'Salin Prompt'}</span>
              </button>
            </div>
            <p className="text-brand-text-secondary dark:text-dark-muted leading-relaxed">
              {enhancedPrompt}
            </p>
          </div>
        </div>

        {/* Gallery / History (1 col) */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <History className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
              <span>Riwayat Pembuatan</span>
            </span>
            <span className="text-[10px] text-brand-text-secondary dark:text-dark-muted font-medium">
              Sesi Ini
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {historyImages.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setCurrentImage(img.url);
                  setEnhancedPrompt(img.prompt);
                }}
                className="cursor-pointer group relative rounded-xl overflow-hidden border border-brand-border dark:border-dark-border aspect-video bg-black/10 hover:ring-2 hover:ring-brand-accent transition-all"
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-white text-[10px] font-semibold truncate">
                  {img.prompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
