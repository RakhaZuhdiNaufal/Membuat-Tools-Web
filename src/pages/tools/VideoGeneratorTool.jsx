import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clapperboard,
  Film,
  Copy,
  Check,
  Maximize2,
  Clock,
  Layers,
  Wand2,
  Tv
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, ErrorState } from '../../components/LoadingState';

export default function VideoGeneratorTool() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('Cinematic 3D animation showing code transformation from HTML to PHP with glowing emerald neon particles');
  const [duration, setDuration] = useState('15s');
  const [style, setStyle] = useState('Cinematic Tech Motion');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Playback simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0); // 0 to 15 seconds
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Default Storyboard Scenes
  const [scenes, setScenes] = useState([
    {
      id: 1,
      title: 'Scene 1: The Digital Genesis',
      duration: '0:00 - 0:05',
      camera: 'Smooth 3D Macro Zoom In',
      description: 'Kamera meluncur melewati pohon sintaksis digital berkilau neon hijau (#67B58A). Partikel data berkedip dalam ruang gelap pekat (#0B251B).',
      prompt: 'Cinematic 3D flying camera into glowing emerald digital cyberspace, holographic code lines floating, 8k hyperrealistic render, smooth 60fps'
    },
    {
      id: 2,
      title: 'Scene 2: Core Code Morphing',
      duration: '0:05 - 0:10',
      camera: '360° Orbital Pan',
      description: 'Blok kode HTML statis memancarkan energi bercahaya dan bermutasi menjadi fungsi PHP backend dinamis secara seamless.',
      prompt: 'Glowing code blocks morphing from HTML structure into PHP functions, dynamic particles connecting nodes, cinematic lighting rays'
    },
    {
      id: 3,
      title: 'Scene 3: Climax & Brand Reveal',
      duration: '0:10 - 0:15',
      camera: 'Dramatic Slow Pull Back',
      description: 'Kamera mundur dramatis menampakkan logo CODEFORGE yang mengkristal dengan pancaran aura hijau keemasan.',
      prompt: 'Dramatic slow pull back revealing crystalline CODEFORGE logo, pulsing green emerald volumetric shockwave, sleek tech commercial outro'
    }
  ]);

  // Video playback timer
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= 15) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 0.1;
          if (next < 5) setActiveSceneIndex(0);
          else if (next < 10) setActiveSceneIndex(1);
          else setActiveSceneIndex(2);
          return Math.round(next * 10) / 10;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Masukkan konsep video yang ingin Anda buat.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setPlaybackTime(0);

    try {
      const res = await api.generateVideo({
        prompt: prompt.trim(),
        duration,
        style,
        user_id: user?.id
      });

      if (res.status === 'success' && res.scenes) {
        setScenes(res.scenes);
        setIsPlaying(true);
      } else {
        setError(res.message || 'Gagal merancang video.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text);
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
                AI Video Studio & Motion Director
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-pink-800 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200 dark:border-pink-800/50">
                Motion & Video
              </span>
            </div>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted mt-0.5">
              Rancang video motion, visual storyboard, prompt video AI sinematik (Sora, Runway Gen-3), dan simulator adegan.
            </p>
          </div>
        </div>
      </div>

      {/* Input Controls Bar */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
        <div>
          <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-1.5">
            Konsep Video / Cerita Visual
          </label>
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Video promosi modern untuk tool AI coding dengan partikel neon hijau dan transisi cepat..."
            className="w-full p-3.5 text-xs sm:text-sm bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-2xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-1">
              Gaya Visual Video
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent font-medium"
            >
              <option value="Cinematic Tech Motion">Cinematic Tech Motion</option>
              <option value="Fast-Paced UI Demo">Fast-Paced UI Screencast</option>
              <option value="3D Holographic Cyberpunk">3D Holographic Cyberpunk</option>
              <option value="Minimalist SaaS Explainer">Minimalist SaaS Explainer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-1">
              Target Durasi
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent font-medium"
            >
              <option value="15s">15 Detik (Shorts / Reels / Teaser)</option>
              <option value="30s">30 Detik (Product Showcase)</option>
              <option value="60s">60 Detik (Full Explainer)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>Merancang Video...</span>
                </>
              ) : (
                <>
                  <Clapperboard className="w-4 h-4 text-brand-accent" />
                  <span>Generate Video Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={handleGenerate} />}

      {/* Video Simulation Player & Storyboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Motion Simulator Player (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-surface p-6 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <Tv className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
              <span>Simulated Motion Player</span>
            </span>
            <span className="text-xs font-mono font-bold text-brand-primary dark:text-brand-accent">
              00:{playbackTime < 10 ? `0${Math.floor(playbackTime)}` : Math.floor(playbackTime)} / 00:15
            </span>
          </div>

          {/* Player Screen */}
          <div className="relative rounded-2xl overflow-hidden bg-brand-dark aspect-video border border-brand-border/60 dark:border-dark-border/60 flex items-center justify-center text-white shadow-elevated">
            {/* Dynamic Animated Scene Background */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ${
                activeSceneIndex === 0
                  ? 'bg-gradient-to-br from-[#0B251B] via-[#123D2A] to-black'
                  : activeSceneIndex === 1
                  ? 'bg-gradient-to-tr from-[#123D2A] via-[#245C40] to-[#081B13]'
                  : 'bg-gradient-to-r from-[#0B251B] via-[#67B58A]/30 to-[#123D2A]'
              }`}
            >
              {/* Particle simulation */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#67B58A_1px,transparent_1px)] [background-size:16px_16px] animate-pulse"></div>
            </div>

            {/* Dynamic Center Visual Content */}
            <div className="relative z-10 text-center p-6 space-y-3 max-w-md">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-accent/20 border border-brand-accent/40 text-brand-accent inline-block">
                {scenes[activeSceneIndex]?.title || 'Scene Active'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
                {activeSceneIndex === 0 && 'CODEFORGE AI MOTION'}
                {activeSceneIndex === 1 && 'HTML ➔ PHP TRANSFORMATION'}
                {activeSceneIndex === 2 && 'EXPERIENCE NEXT-GEN CODING'}
              </h3>
              <p className="text-xs text-brand-light/90 leading-relaxed drop-shadow-sm">
                {scenes[activeSceneIndex]?.visual || scenes[activeSceneIndex]?.description}
              </p>
            </div>

            {/* Camera Movement Indicator Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono text-brand-accent border border-white/10">
              Camera: {scenes[activeSceneIndex]?.camera || 'Dynamic Pan'}
            </div>
          </div>

          {/* Player Timeline Scrubber and Controls */}
          <div className="space-y-3 pt-2">
            {/* Timeline Progress Bar */}
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-dark-card overflow-hidden cursor-pointer">
              <div
                className="h-full bg-brand-accent transition-all duration-100"
                style={{ width: `${(playbackTime / 15) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-secondary transition-transform active:scale-95 shadow-xs"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setPlaybackTime(0);
                    setActiveSceneIndex(0);
                  }}
                  className="p-2.5 rounded-xl bg-brand-light dark:bg-dark-card text-brand-text-secondary hover:text-brand-text-primary dark:text-dark-muted transition-colors"
                  title="Replay dari Awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] text-brand-text-secondary dark:text-dark-muted font-medium">
                Simulasi Gerakan Kamera 60 FPS
              </span>
            </div>
          </div>
        </div>

        {/* Right: Scene-by-Scene Storyboard & AI Export Prompts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <Film className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
              <span>Storyboard Adegan ({scenes.length})</span>
            </span>
            <span className="text-[10px] text-brand-text-secondary dark:text-dark-muted font-medium">
              Sora / Runway Gen-3 Prompts
            </span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {scenes.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <div
                  key={scene.id || idx}
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    setPlaybackTime(idx * 5);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-brand-primary bg-brand-light/50 dark:border-brand-accent dark:bg-dark-card shadow-subtle ring-1 ring-brand-primary dark:ring-brand-accent'
                      : 'border-brand-border dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-brand-bg/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text">
                      {scene.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent font-bold">
                      {scene.duration}
                    </span>
                  </div>

                  <p className="text-xs text-brand-text-secondary dark:text-dark-muted leading-relaxed mb-2">
                    {scene.description || scene.visual}
                  </p>

                  {/* AI Video Prompt Box */}
                  <div className="p-2.5 rounded-xl bg-brand-bg/70 dark:bg-dark-card/70 border border-brand-border/60 dark:border-dark-border/60 text-[11px] font-mono text-brand-text-primary dark:text-dark-text flex justify-between items-start gap-2">
                    <span className="line-clamp-2">{scene.prompt || scene.description}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPrompt(scene.prompt || scene.description);
                      }}
                      className="p-1 hover:text-brand-accent text-brand-text-secondary flex-shrink-0"
                      title="Salin Prompt Video untuk Runway/Sora"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
