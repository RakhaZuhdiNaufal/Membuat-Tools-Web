import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Wand2,
  Code2,
  Play,
  Share2
} from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, ErrorState } from '../../components/LoadingState';

const SAMPLE_RN_TEMPLATES = [
  {
    title: 'Mobile Auth Login Screen',
    prompt: 'Buat screen login mobile React Native lengkap dengan logo, input email & password, remember me, tombol login hijau gelap, dan social buttons.'
  },
  {
    title: 'SaaS Mobile Dashboard',
    prompt: 'Rancang dashboard mobile dengan header sapaan user, kartu metrik statistik saldo/request, dan FlatList kartu aktivitas terbaru.'
  },
  {
    title: 'REST API Fetcher Screen',
    prompt: 'Buat screen React Native yang melakukan fetch() ke endpoint REST API backend, menampilkan ActivityIndicator saat loading, dan render list data.'
  },
  {
    title: 'Profile & Settings Mobile Screen',
    prompt: 'Rancang screen profil mobile dengan avatar rounded, badge status pro, switch toggle notifikasi, dan tombol logout merah.'
  }
];

export default function ReactNativeTool() {
  const { user } = useAuth();
  const location = useLocation();
  const initialPrompt = location.state?.prompt || 'Buat screen mobile React Native modern dengan header dark green, kartu metrik saldo, dan tombol aksi cepat.';
  const [prompt, setPrompt] = useState(initialPrompt);
  const [screenType, setScreenType] = useState('Full Screen View');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (location.state?.prompt) {
      setPrompt(location.state.prompt);
      handleGenerate(location.state.prompt);
    }
  }, [location.state]);

  // Default initial React Native code
  const [rnCode, setRnCode] = useState(`import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';

export default function MobileDashboardScreen() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B251B" />

      {/* Mobile Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TOOLS WEB <Text style={styles.accentText}>MOBILE</Text></Text>
        <Text style={styles.headerSubtitle}>React Native Mobile Architecture</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Metric Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TOTAL AI REQUESTS</Text>
          <Text style={styles.cardValue}>1,248</Text>
          <Text style={styles.cardTrend}>+18.4% bulan ini</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setCount(prev => prev + 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Trigger Mobile Action ({count})</Text>
          </TouchableOpacity>
        </View>

        {/* Feature List */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Koneksi API Backend:</Text>
          <Text style={styles.infoText}>• fetch() langsung ke endpoint REST API Anda</Text>
          <Text style={styles.infoText}>• Tanpa Google Apps Script (Direct API Connection)</Text>
          <Text style={styles.infoText}>• Mendukung Expo & React Native Bare CLI</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9F7' },
  header: { padding: 20, backgroundColor: '#0B251B', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  accentText: { color: '#67B58A' },
  headerSubtitle: { fontSize: 11, color: '#E9F4ED', opacity: 0.8, marginTop: 4 },
  scroll: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E5EBE6', marginBottom: 16 },
  cardLabel: { fontSize: 10, fontWeight: '800', color: '#7B887F', letterSpacing: 0.5 },
  cardValue: { fontSize: 32, fontWeight: '900', color: '#17251D', marginVertical: 4 },
  cardTrend: { fontSize: 11, color: '#245C40', fontWeight: '600', marginBottom: 16 },
  actionBtn: { backgroundColor: '#123D2A', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  infoBox: { backgroundColor: '#E9F4ED', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#C4D4CB' },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#123D2A', marginBottom: 6 },
  infoText: { fontSize: 12, color: '#245C40', marginBottom: 4 }
});`);

  const handleGenerate = async (promptOverride) => {
    const textToUse = (typeof promptOverride === 'string' ? promptOverride : prompt).trim();
    if (!textToUse) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateReactNativeCode({
        prompt: textToUse,
        screen_type: screenType,
        user_id: user?.id
      });

      if (res.status === 'success' && res.code) {
        setRnCode(res.code);
      } else {
        setError(res.message || 'Gagal menghasilkan kode React Native.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rnCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rnCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MobileScreen.jsx';
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
                React Native Mobile Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                Mobile React Native
              </span>
            </div>
            <p className="text-xs text-brand-text-secondary dark:text-dark-muted mt-0.5">
              Hasilkan kode screen dan komponen React Native siap pakai untuk aplikasi Android & iOS (Expo / Bare CLI).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-dark-surface hover:bg-brand-light dark:hover:bg-dark-card border border-brand-border dark:border-dark-border text-xs font-bold text-brand-primary dark:text-brand-accent transition-colors flex items-center space-x-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .jsx</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Kode RN'}</span>
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-1">
              Instruksi / Kebutuhan Screen Mobile
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Buat screen detail produk dengan tombol beli dan rating bintang..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text-primary dark:text-dark-text mb-1">
              Tipe Output
            </label>
            <select
              value={screenType}
              onChange={(e) => setScreenType(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-brand-bg/50 dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent font-medium"
            >
              <option value="Full Screen View">Full Screen (SafeAreaView)</option>
              <option value="Custom Component">Modular Component</option>
              <option value="Modal Dialog">Bottom Sheet / Modal</option>
              <option value="API Data List">FlatList API Data Fetcher</option>
            </select>
          </div>
        </div>

        {/* Quick Inspiration Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-brand-text-secondary dark:text-dark-muted whitespace-nowrap">
            Inspirasi:
          </span>
          {SAMPLE_RN_TEMPLATES.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(t.prompt)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-brand-bg/80 dark:bg-dark-card hover:bg-brand-light dark:hover:bg-dark-card/80 border border-brand-border dark:border-dark-border rounded-lg text-brand-text-secondary hover:text-brand-text-primary dark:text-dark-muted dark:hover:text-dark-text whitespace-nowrap transition-colors"
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 dark:border-dark-border/60">
          <span className="text-[11px] text-brand-text-secondary dark:text-dark-muted flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Kode siap dicopy ke project React Native / Expo Anda</span>
          </span>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                <span>Menghasilkan Kode Mobile...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-brand-accent" />
                <span>Generate React Native Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={handleGenerate} />}

      {/* Code Editor and Mobile Frame Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
        {/* Left: Code Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-brand-secondary dark:text-brand-accent" />
              <span>Kode Sumber React Native (.jsx / .tsx)</span>
            </span>
            <span className="text-[11px] text-brand-text-secondary dark:text-dark-muted">
              StyleSheet.create & Hooks
            </span>
          </div>

          <CodeEditor
            code={rnCode}
            onChange={setRnCode}
            language="javascript"
            readOnly={false}
            title="React Native Code"
            height="500px"
            onRegenerate={handleGenerate}
          />
        </div>

        {/* Right: Simulated Mobile Phone Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="flex items-center justify-between w-full max-w-[320px] mb-2 px-1">
            <span className="text-xs font-bold text-brand-text-primary dark:text-dark-text flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-brand-accent" />
              <span>Mobile Phone Mockup</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-brand-accent bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Expo Live Frame
            </span>
          </div>

          {/* Smartphone Bezel Container */}
          <div className="w-full max-w-[320px] h-[540px] bg-[#0B251B] p-3 rounded-[40px] shadow-2xl border-4 border-[#123D2A] relative flex flex-col overflow-hidden">
            {/* Top Speaker / Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#123D2A]/80 mr-3"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500/60"></div>
            </div>

            {/* Inner Mobile Screen */}
            <div className="w-full h-full bg-[#F7F9F7] rounded-[32px] overflow-hidden flex flex-col pt-7 relative text-[#17251D]">
              {/* Header Native */}
              <div className="bg-[#0B251B] p-4 text-white">
                <h3 className="text-sm font-black tracking-tight">TOOLS WEB <span className="text-[#67B58A]">MOBILE</span></h3>
                <p className="text-[10px] text-[#E9F4ED]/80">React Native Active</p>
              </div>

              {/* Scroll Content Simulation */}
              <div className="p-3.5 space-y-3 overflow-y-auto flex-1">
                <div className="bg-white p-4 rounded-2xl border border-[#E5EBE6] shadow-xs">
                  <span className="text-[9px] font-bold text-[#7B887F] uppercase tracking-wider block">REACT NATIVE COMPONENT</span>
                  <h4 className="text-sm font-black text-[#17251D] mt-1">{prompt.slice(0, 30) || 'Screen Mobile'}</h4>
                  <p className="text-[11px] text-[#7B887F] mt-1 leading-snug">
                    Komponen ini dirender sesuai struktur StyleSheet React Native Anda.
                  </p>
                  <button className="w-full mt-3 py-2 bg-[#123D2A] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform">
                    Tap Mobile Action
                  </button>
                </div>

                <div className="p-3 bg-[#E9F4ED] rounded-xl border border-[#C4D4CB]">
                  <p className="text-[11px] font-bold text-[#123D2A]">Koneksi REST API Langsung:</p>
                  <p className="text-[10px] text-[#245C40] mt-0.5">• Tanpa Google Apps Script</p>
                  <p className="text-[10px] text-[#245C40]">• Kompatibel dengan Expo & CLI</p>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="h-4 bg-transparent flex items-center justify-center pb-1">
                <div className="w-24 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
