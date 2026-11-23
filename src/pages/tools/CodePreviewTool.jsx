import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Columns,
  Eye,
  FileCode,
  ShieldCheck,
  Layers,
  Wand2
} from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';
import { api, getAnthropicKey } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingState';

// Helper to format inline markdown bold & code
function formatInlineText(text) {
  if (!text) return null;
  const parts = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-brand-light dark:bg-dark-surface border border-brand-border dark:border-dark-border text-brand-secondary dark:text-brand-accent font-mono text-xs"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-brand-text-primary dark:text-dark-text">
          {token.slice(2, -2)}
        </strong>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

const DEFAULT_INITIAL_COMPONENT = `<!-- React Component: Modern Tools Web Card -->
<div class="max-w-md mx-auto my-6 bg-white dark:bg-[#0B251B] rounded-3xl overflow-hidden shadow-xl border border-[#E5EBE6] dark:border-[#1A4532] transition-all hover:shadow-2xl">
  <div class="p-6 bg-gradient-to-r from-[#123D2A] to-[#245C40] text-white">
    <div class="flex items-center justify-between">
      <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
        React Component
      </span>
      <span class="w-2.5 h-2.5 rounded-full bg-[#67B58A] animate-pulse"></span>
    </div>
    <h3 class="text-xl font-black mt-4">Next-Gen React UI Builder</h3>
    <p class="text-xs text-[#E9F4ED]/80 mt-1">Dihasilkan dengan presisi tinggi menggunakan Anthropic Claude.</p>
  </div>
  <div class="p-6 space-y-4 bg-white dark:bg-[#0B251B]">
    <div class="p-3 bg-[#E9F4ED] dark:bg-[#102E20] rounded-2xl border border-[#67B58A]/30 flex items-center justify-between">
      <span class="text-xs font-bold text-[#123D2A] dark:text-[#67B58A]">React State Hook:</span>
      <span class="text-xs font-mono text-[#245C40] dark:text-[#8DA396]">useState (Ready)</span>
    </div>
    <p class="text-xs text-[#7B887F] dark:text-[#8DA396] leading-relaxed">
      Komponen React modular dengan styling Tailwind CSS responsif, kontras tinggi, dan siap disematkan langsung ke aplikasi web React Anda.
    </p>
    <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#1A4532]">
      <span class="text-xs font-bold text-[#123D2A] dark:text-[#67B58A]">Siap Pakai</span>
      <button class="px-4 py-2 bg-[#123D2A] hover:bg-[#245C40] dark:bg-[#67B58A] dark:hover:bg-emerald-400 text-white dark:text-[#0B251B] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95">
        Eksplorasi Sekarang
      </button>
    </div>
  </div>
</div>`;

export default function CodePreviewTool() {
  const { user } = useAuth();
  const location = useLocation();
  const hasApiKey = !!getAnthropicKey();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Halo **${user?.full_name || user?.username || 'Developer'}**!\n\nSelamat datang di **React Component & Live Preview**.\n\nTuliskan ide komponen apa saja di kolom chat di bawah—mulai dari Game interaktif (Tic-Tac-Toe, Kuis, Puzzle), Dashboard Full-Stack CRUD, E-Commerce cart, hingga Landing Page.\n\nSetiap pesan yang Anda kirim akan langsung saya buatkan kodenya dan tampil secara real-time pada panel Preview di sebelah kanan!`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(DEFAULT_INITIAL_COMPONENT);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'preview' | 'code' | 'chat' (mobile)
  const [rightTab, setRightTab] = useState('preview'); // 'preview' | 'code'
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle incoming prompt from navigation (e.g., from AI Prompt Chat)
  useEffect(() => {
    if (location.state?.prompt) {
      handleSend(location.state.prompt);
    }
  }, [location.state]);

  const handleSend = async (messageToSend) => {
    const text = messageToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.generateReactCode({
        prompt: text.trim(),
        framework: 'React JSX + Tailwind',
        user_id: user?.id
      });

      if (res.status === 'success' && res.result) {
        setGeneratedCode(res.result);
        setRightTab('preview');
        // Switch to preview if user was on mobile chat
        if (window.innerWidth < 1024) {
          setViewMode('preview');
        }
        setMessages([
          ...newHistory,
          {
            role: 'assistant',
            content: `Komponen untuk "${text.trim().slice(0, 60)}${text.trim().length > 60 ? '...' : ''}" telah berhasil dibuat! Kode siap pakai langsung tampil pada panel Preview di sebelah kanan. Anda dapat langsung memainkannya atau melihat kode sumber JSX-nya.`
          }
        ]);
      } else {
        setMessages([
          ...newHistory,
          {
            role: 'assistant',
            content: `Maaf, gagal membuat komponen: ${res.message || 'Terjadi kendala pada generator'}`
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `Terjadi kesalahan sistem: ${err.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Bersihkan percakapan generator ini?')) {
      setMessages([
        {
          role: 'assistant',
          content: 'Percakapan telah dibersihkan. Tuliskan komponen baru yang ingin Anda buat di kolom chat di bawah!'
        }
      ]);
      setGeneratedCode(DEFAULT_INITIAL_COMPONENT);
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col max-w-7xl mx-auto space-y-3 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-border dark:border-dark-border flex-shrink-0">
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
              <h1 className="text-lg font-black text-brand-text-primary dark:text-dark-text tracking-tight">
                React Component & Live Preview
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent border border-brand-border/50 dark:border-dark-border/50">
                Claude Sonnet
              </span>
            </div>
            <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted">
              Chat untuk generate kode komponen React dan saksikan preview live-nya seketika.
            </p>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center space-x-2">
          {/* Desktop View Switcher */}
          <div className="hidden lg:flex rounded-2xl bg-white dark:bg-dark-surface p-1 border border-brand-border dark:border-dark-border shadow-2xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'split'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Screen</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'preview'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Only</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'code'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Code Only</span>
            </button>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden rounded-2xl bg-white dark:bg-dark-surface p-1 border border-brand-border dark:border-dark-border shadow-2xs">
            <button
              onClick={() => setViewMode('chat')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'chat' || viewMode === 'split'
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-text-secondary dark:text-dark-muted'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'preview'
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-text-secondary dark:text-dark-muted'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'code'
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-text-secondary dark:text-dark-muted'
              }`}
            >
              Kode
            </button>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-brand-text-secondary dark:text-dark-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-brand-border dark:border-dark-border transition-colors"
            title="Reset Percakapan & Preview"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Container */}
      <div className="flex-1 bg-white dark:bg-dark-surface rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Side: Clean Full Chat (Shown in 'split' or mobile 'chat') */}
        {(viewMode === 'split' || viewMode === 'chat') && (
          <div className="flex-1 lg:max-w-[45%] flex flex-col border-b lg:border-b-0 lg:border-r border-brand-border dark:border-dark-border min-h-0">
            {/* Messages Body */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                        isUser
                          ? 'bg-brand-primary text-white'
                          : 'bg-gradient-to-br from-brand-secondary to-brand-primary text-brand-accent border border-brand-accent/30'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-brand-primary text-white shadow-subtle'
                          : 'bg-brand-bg/70 dark:bg-dark-card border border-brand-border/80 dark:border-dark-border/80 text-brand-text-primary dark:text-dark-text shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 pb-1 border-b border-black/5 dark:border-white/5">
                        <span className="font-bold text-[10px] opacity-80">
                          {isUser ? user?.full_name || 'Anda' : 'Claude Assistant'}
                        </span>
                      </div>
                      <div className="whitespace-pre-line">
                        {msg.content.split('\n').map((line, lIdx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return <div key={lIdx} className="h-1.5" />;
                          return <p key={lIdx} className="my-0.5">{formatInlineText(trimmed)}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center flex-shrink-0 shadow-xs animate-pulse">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-brand-bg/70 dark:bg-dark-card border border-brand-border/80 dark:border-dark-border/80 flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-xs text-brand-text-secondary dark:text-dark-muted font-medium">
                      Claude sedang men-generate kode & preview...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Pinned Bottom Input Bar (Identik seperti Prompt Chat) */}
            <div className="p-3 sm:p-4 border-t border-brand-border dark:border-dark-border bg-brand-bg/40 dark:bg-dark-card/40 flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-end space-x-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    rows={2}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tuliskan komponen yang ingin dibuat (misal: 'buatkan game tic tac toe interaktif')... (Enter untuk kirim)"
                    className="w-full p-3 pr-10 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-2xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none transition-all"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                  title="Generate Komponen"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-brand-text-secondary dark:text-dark-muted">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-accent" />
                  <span>Kirim prompt chat untuk langsung update Live Preview</span>
                </span>
                <span>Enter = Kirim • Shift+Enter = Baris Baru</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Live Interactive Preview & Code Viewer */}
        {(viewMode === 'split' || viewMode === 'preview' || viewMode === 'code') && (
          <div className="flex-1 flex flex-col min-h-0 bg-brand-bg/20 dark:bg-dark-card/20">
            {/* Right Pane Header: Tabs (Preview | Code) & Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border dark:border-dark-border bg-white/70 dark:bg-dark-surface/70 backdrop-blur-xs flex-shrink-0">
              <div className="flex items-center space-x-1 bg-brand-bg dark:bg-dark-card p-1 rounded-xl border border-brand-border dark:border-dark-border">
                <button
                  onClick={() => setRightTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    rightTab === 'preview' && viewMode !== 'code'
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
                <button
                  onClick={() => setRightTab('code')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    rightTab === 'code' || viewMode === 'code'
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'text-brand-text-secondary dark:text-dark-muted hover:text-brand-text-primary'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Kode Sumber JSX</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-dark-surface hover:bg-brand-light dark:hover:bg-dark-card border border-brand-border dark:border-dark-border text-brand-secondary dark:text-brand-accent transition-colors flex items-center space-x-1.5"
                  title="Salin Kode Sumber JSX"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>

                <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-brand-accent text-[11px] font-mono border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Sandbox</span>
                </div>
              </div>
            </div>

            {/* Sandbox Canvas Area */}
            <div className="flex-1 overflow-auto min-h-0 relative p-4 sm:p-6 flex items-center justify-center">
              {(rightTab === 'preview' && viewMode !== 'code') ? (
                <div className="w-full max-w-4xl mx-auto my-auto animate-in zoom-in-95 duration-200">
                  <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl overflow-hidden border border-brand-border dark:border-dark-border shadow-inner">
                  <CodeEditor
                    code={generatedCode}
                    onChange={setGeneratedCode}
                    language="javascript"
                    readOnly={false}
                    title="React JSX Editor"
                    height="100%"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
