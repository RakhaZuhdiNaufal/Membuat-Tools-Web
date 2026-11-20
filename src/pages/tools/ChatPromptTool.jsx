import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Trash2,
  Cloud,
  HardDrive,
  Key,
  X,
  ShieldCheck
} from 'lucide-react';
import { api, getAnthropicKey, setAnthropicKey } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingState';

// Helper to format inline markdown (bold, inline code)
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

// Full Chat Markdown Renderer
function FormattedMessage({ content }) {
  const navigate = useNavigate();
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Split content by code blocks: ```lang\ncode```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const sections = [];
  let lastIndex = 0;
  let match;
  let blockCount = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      sections.push({
        type: 'text',
        value: content.substring(lastIndex, match.index)
      });
    }
    sections.push({
      type: 'code',
      lang: match[1] || 'prompt',
      code: match[2].trim(),
      index: blockCount++
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    sections.push({
      type: 'text',
      value: content.substring(lastIndex)
    });
  }

  return (
    <div className="space-y-3">
      {sections.map((sec, i) => {
        if (sec.type === 'code') {
          return (
            <div
              key={i}
              className="my-3 rounded-2xl overflow-hidden border border-[#1A4532] bg-[#0B251B] text-[#E9F4ED] shadow-md"
            >
              {/* Code/Prompt header */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#061711] border-b border-[#1A4532] text-xs">
                <span className="font-mono text-[11px] font-bold text-[#67B58A] uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{sec.lang === 'markdown' ? 'Master Prompt' : sec.lang}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(sec.code, sec.index)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-medium text-white transition-colors"
                    title="Salin isi prompt ini"
                  >
                    {copiedCodeIndex === sec.index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/tools/code-preview', { state: { prompt: sec.code } })}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#67B58A] hover:bg-emerald-400 text-[#0B251B] text-[11px] font-bold transition-all shadow-xs"
                    title="Kirim dan buka langsung di Live Preview"
                  >
                    <span>Jalankan di Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code/Prompt content */}
              <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-100 bg-[#071F15] selection:bg-[#245C40]">
                <code>{sec.code}</code>
              </pre>
            </div>
          );
        }

        // Regular text
        const lines = sec.value.split('\n');
        return (
          <div key={i} className="space-y-2 leading-relaxed">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              if (trimmed === '---') {
                return <hr key={lineIdx} className="my-2 border-brand-border/60 dark:border-dark-border/60" />;
              }

              // Headings
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={lineIdx} className="text-xs font-bold uppercase tracking-wider text-brand-secondary dark:text-brand-accent mt-3 mb-1">
                    {formatInlineText(trimmed.replace('#### ', ''))}
                  </h4>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={lineIdx} className="text-sm sm:text-base font-bold text-brand-primary dark:text-brand-accent mt-3 mb-1 flex items-center space-x-1.5">
                    {formatInlineText(trimmed.replace('### ', ''))}
                  </h3>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={lineIdx} className="text-base sm:text-lg font-black text-brand-primary dark:text-brand-accent mt-4 mb-2">
                    {formatInlineText(trimmed.replace('## ', ''))}
                  </h2>
                );
              }

              // Bullets
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex items-start space-x-2 ml-2 my-0.5 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                    <div>{formatInlineText(trimmed.slice(2))}</div>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start space-x-2 ml-2 my-0.5 text-xs sm:text-sm">
                    <span className="font-bold text-brand-secondary dark:text-brand-accent flex-shrink-0 text-xs">
                      {numMatch[1]}.
                    </span>
                    <div>{formatInlineText(numMatch[2])}</div>
                  </div>
                );
              }

              return (
                <p key={lineIdx} className="text-xs sm:text-sm">
                  {formatInlineText(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function ChatPromptTool() {
  const { user } = useAuth();
  const [hasApiKey, setHasApiKey] = useState(!!getAnthropicKey());
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [inputKey, setInputKey] = useState(getAnthropicKey() || '');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Halo **${user?.full_name || user?.username || 'Developer'}**!\n\nSelamat datang di **AI Prompt Chat**. Saya asisten AI Claude yang siap berdiskusi dan membantu merumuskan prompt coding terbaik untuk Anda.\n\nCeritakan kebutuhan proyek Anda—seperti Game interaktif (Tic-Tac-Toe, Kuis, Puzzle), sistem aplikasi Full-Stack CRUD, E-Commerce, SaaS Dashboard, Mobile App, hingga REST API—dan saya akan menganalisis konsepnya lalu menyusun **Master Prompt** terstruktur yang siap Anda gunakan!`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageToSend) => {
    const text = messageToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.chatWithAI({
        message: text.trim(),
        history: messages,
        user_id: user?.id
      });

      if (res.status === 'success' && res.reply) {
        setMessages([...newHistory, { role: 'assistant', content: res.reply }]);
      } else {
        setMessages([
          ...newHistory,
          {
            role: 'assistant',
            content: `⚠️ *Maaf, terjadi masalah saat menghubungi AI: ${res.message || 'Koneksi terputus'}*`
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `⚠️ *Terjadi kesalahan sistem: ${err.message}*`
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

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Apakah Anda yakin ingin membersihkan riwayat percakapan?')) {
      setMessages([
        {
          role: 'assistant',
          content: 'Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan atau buat prompt baru!'
        }
      ]);
    }
  };

  const handleSaveApiKey = () => {
    setAnthropicKey(inputKey);
    setHasApiKey(!!inputKey.trim());
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setApiKeyModalOpen(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col max-w-5xl mx-auto space-y-3 animate-in fade-in duration-300">
      {/* Clean Minimal Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-brand-border dark:border-dark-border flex-shrink-0">
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
                AI Prompt Chat
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-light dark:bg-dark-card text-brand-secondary dark:text-brand-accent border border-brand-border/50 dark:border-dark-border/50">
                Claude Sonnet
              </span>
            </div>
            <p className="text-[11px] text-brand-text-secondary dark:text-dark-muted">
              Ruang chat interaktif untuk konsultasi ide, arsitektur kode, dan meracik prompt.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
              hasApiKey
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-brand-accent border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
            title="Status API Key Anthropic"
          >
            {hasApiKey ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-accent animate-pulse" />
                <span>Claude API Online</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                <span>Local Engine • Pasang Key</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-text-secondary dark:text-dark-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-brand-border dark:border-dark-border transition-colors flex items-center space-x-1.5"
            title="Bersihkan Percakapan"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Full Chat Container */}
      <div className="flex-1 bg-white dark:bg-dark-surface rounded-3xl border border-brand-border dark:border-dark-border shadow-subtle flex flex-col overflow-hidden min-h-0">
        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-brand-primary text-white'
                      : 'bg-gradient-to-br from-brand-secondary to-brand-primary text-brand-accent border border-brand-accent/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-brand-primary text-white shadow-subtle'
                      : 'bg-brand-bg/70 dark:bg-dark-card border border-brand-border/80 dark:border-dark-border/80 text-brand-text-primary dark:text-dark-text shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-black/5 dark:border-white/5">
                    <span className="font-bold text-[11px] opacity-80">
                      {isUser ? user?.full_name || 'Anda' : 'Claude Assistant'}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="text-[10px] font-semibold text-brand-secondary dark:text-brand-accent hover:underline flex items-center space-x-1 ml-2"
                        title="Salin Seluruh Balasan"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Balasan</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Render content */}
                  {isUser ? (
                    <div className="whitespace-pre-line font-sans font-medium">{msg.content}</div>
                  ) : (
                    <FormattedMessage content={msg.content} />
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-2xl bg-brand-primary text-brand-accent flex items-center justify-center flex-shrink-0 shadow-xs animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-3xl bg-brand-bg/70 dark:bg-dark-card border border-brand-border/80 dark:border-dark-border/80 flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className="text-xs text-brand-text-secondary dark:text-dark-muted font-medium">
                  Claude sedang mengetik balasan...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
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
                placeholder="Ketik ide proyek Anda (Game interaktif, Full-Stack CRUD, Web App, Mobile, API)... (Tekan Enter untuk kirim)"
                className="w-full p-3 pr-10 text-xs sm:text-sm bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-2xl text-brand-text-primary dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none transition-all"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center flex-shrink-0"
              title="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-brand-text-secondary dark:text-dark-muted">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-accent" />
              <span>{hasApiKey ? 'Claude AI Connected • Full Chat Experience' : 'Local Engine Ready • Instant Response'}</span>
            </span>
            <span>Shift + Enter untuk baris baru</span>
          </div>
        </div>
      </div>

      {/* Quick API Key Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-brand-light dark:bg-dark-card flex items-center justify-center text-brand-secondary dark:text-brand-accent">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-brand-text-primary dark:text-dark-text">
                  Konfigurasi Anthropic API Key
                </h3>
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-brand-text-secondary dark:text-dark-muted leading-relaxed">
                API Key Anthropic Claude tersimpan aman di browser Anda.
              </p>

              <div>
                <label className="block text-xs font-semibold text-brand-text-primary dark:text-dark-text mb-1">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-border dark:border-dark-border bg-brand-bg/50 dark:bg-dark-card text-xs font-mono text-brand-text-primary dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>

              {keySavedMessage && (
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>API Key berhasil disimpan!</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-text-secondary dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-secondary text-white transition-all shadow-md"
              >
                Simpan & Aktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
