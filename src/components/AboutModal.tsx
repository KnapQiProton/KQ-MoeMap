import { useState } from 'react';
import { Sparkles, Globe, X, ExternalLink, Copy, Check, Heart, ShieldCheck, Layers } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const siteUrl = 'https://knapqiproton.github.io/KQ-MoeMap/';
  const repoUrl = 'https://github.com/KnapQiProton/KQ-MoeMap';

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(siteUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-pink-400 to-purple-500 shadow-glow-pink flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-sky-500 via-pink-500 to-purple-600 bg-clip-text text-transparent font-['Plus_Jakarta_Sans']">
                KQ-MoeMap
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/60 rounded-full border border-sky-200/60 dark:border-sky-800/50">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Smart SVG Gradient Map Studio
            </p>
          </div>
        </div>

        {/* Live Website Section */}
        <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-800 dark:text-sky-300">
            <span className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Official Live Website:</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-sky-200/60 dark:bg-sky-900/60 px-2 py-0.5 rounded-full text-sky-700 dark:text-sky-300">
              Online
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200/40 dark:border-sky-800/40">
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-sky-600 dark:text-sky-400 hover:underline truncate"
            >
              {siteUrl}
            </a>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={handleCopyUrl}
                className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Copy website link"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Open live website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Description & Mechanics */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>KQ-MoeMap</strong> applies real-time multi-stop gradient maps to any image using hardware-accelerated SVG filter primitives.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Rec. 709 Luminance Matrix</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-pink-500" />
              <span>feComponentTransfer sRGB</span>
            </div>
          </div>
        </div>

        {/* Creator & Links */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>by</span>
            <a
              href="https://github.com/KnapQiProton"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-800 dark:text-slate-200 hover:underline"
            >
              KnapQiProton
            </a>
          </div>

          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 transition"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};
