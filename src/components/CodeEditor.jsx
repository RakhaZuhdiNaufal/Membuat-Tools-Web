import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Trash2, Code } from 'lucide-react';

export default function CodeEditor({
  code = '',
  onChange,
  language = 'javascript',
  readOnly = false,
  title = 'Code',
  onRegenerate,
  onClear,
  height = '350px'
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = (code || '').split('\n');

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-brand-border dark:border-dark-border bg-brand-dark shadow-card">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#081B13] border-b border-[#1A4532]">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <Code className="w-4 h-4 text-brand-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-light/90">
            {language}
          </span>
          {title && (
            <span className="text-xs text-brand-accent/70 hidden sm:inline border-l border-[#1A4532] pl-2">
              {title}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              type="button"
              className="px-2.5 py-1 text-xs font-medium text-brand-light/80 hover:text-white bg-[#102E20] hover:bg-[#1A4532] rounded-md transition-colors flex items-center space-x-1"
              title="Regenerate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Regenerate</span>
            </button>
          )}

          {onClear && (
            <button
              onClick={onClear}
              type="button"
              className="px-2.5 py-1 text-xs font-medium text-brand-light/80 hover:text-red-400 bg-[#102E20] hover:bg-red-950/40 rounded-md transition-colors flex items-center space-x-1"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            type="button"
            className="px-3 py-1 text-xs font-medium text-brand-dark bg-brand-accent hover:bg-emerald-400 rounded-md transition-all font-semibold flex items-center space-x-1.5 shadow-sm active:scale-95"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative font-mono text-xs sm:text-sm overflow-auto" style={{ minHeight: height, maxHeight: '600px' }}>
        {readOnly ? (
          <div className="flex p-4 text-[#E9F4ED] selection:bg-brand-accent selection:text-brand-dark overflow-x-auto">
            {/* Line numbers */}
            <div className="select-none text-[#4A6B59] text-right pr-4 border-r border-[#1A4532] mr-4 font-mono text-xs leading-6">
              {lines.map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            {/* Code */}
            <pre className="font-mono text-xs sm:text-sm leading-6 flex-1 overflow-x-auto">
              <code>{code || '// Belum ada kode yang dihasilkan.'}</code>
            </pre>
          </div>
        ) : (
          <textarea
            value={code}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder="// Ketik atau tempelkan kode Anda di sini..."
            className="w-full h-full p-4 bg-transparent text-[#E9F4ED] font-mono text-xs sm:text-sm leading-6 focus:outline-none resize-y selection:bg-brand-accent selection:text-brand-dark"
            style={{ minHeight: height }}
            spellCheck="false"
          />
        )}
      </div>
    </div>
  );
}
