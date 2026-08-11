import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Building, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Moon, 
  Sun, 
  Database, 
  ShieldCheck, 
  Palette,
  Laptop
} from 'lucide-react';
import { User } from '../types';

interface SettingsModalProps {
  appName: string;
  appTagline: string;
  onSaveBranding: (name: string, tagline: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  appName,
  appTagline,
  onSaveBranding,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onClose
}) => {
  const [nameInput, setNameInput] = useState(appName);
  const [taglineInput, setTaglineInput] = useState(appTagline);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || 'DOKU';
    const finalTagline = taglineInput.trim() || 'Digital Workspace';
    onSaveBranding(finalName, finalTagline);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setNameInput('DOKU');
    setTaglineInput('Digital Workspace');
    onSaveBranding('DOKU', 'Digital Workspace');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Generate initial badge icon letter
  const logoLetter = (nameInput.trim() || 'DOKU').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ea1d25] rounded-xl text-white shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Pengaturan Workspace & Branding</h2>
              <p className="text-xs text-slate-400">Customized Application Name, Tagline & Preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          {/* Live Branding Preview */}
          <div className="bg-slate-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#ea1d25]" />
                Pratinjau Branding Real-Time (Live Preview)
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Responsive Header & Sidebar
              </span>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-slate-950 to-slate-900 rounded-xl border border-slate-800 text-white flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#ea1d25] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#ea1d25]/40 shrink-0">
                  {logoLetter}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-lg tracking-tight text-white truncate">
                    {nameInput.trim() || 'DOKU'}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    <span className="truncate">{taglineInput.trim() || 'Digital Workspace'}</span>
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-mono text-slate-400">Preview Layout</span>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1 justify-end">
                  <Sparkles className="w-3 h-3" />
                  Customized Active
                </div>
              </div>
            </div>
          </div>

          {/* Form Branding Customization */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              1. Identitas & Nama Aplikasi
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Aplikasi (App Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DOKU, WorkSpace, Enterprise Hub"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-[#ea1d25]"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Nama ini akan muncul di sidebar, header, AI Assistant, dan title browser.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tagline Aplikasi (App Subtitle)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digital Workspace, Project Hub"
                  value={taglineInput}
                  onChange={(e) => setTaglineInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-[#ea1d25]"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Tagline akan mendampingi nama aplikasi secara responsif.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-[#ea1d25] hover:bg-[#c8141b] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Perubahan Disimpan!</span>
                  </>
                ) : (
                  <span>Simpan Perubahan Branding</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
                title="Kembalikan ke Default ('DOKU' & 'Digital Workspace')"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset ke Default</span>
              </button>
            </div>
          </form>

          <hr className="border-slate-200 dark:border-zinc-800" />

          {/* Theme & Display Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              2. Tampilan & Mode Tema
            </h4>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-amber-400 rounded-lg">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {isDarkMode ? 'Dark Theme (Aktif)' : 'Light Theme (Aktif)'}
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Pilih antara mode terang yang bersih atau mode gelap kontras tinggi.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleDarkMode}
                className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-lg shadow-2xs hover:opacity-90 transition-opacity"
              >
                Ganti ke {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-zinc-800" />

          {/* User Session & System Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              3. Informasi Sesi & Sinkronisasi
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] text-slate-400 font-semibold block">Pengguna Aktif:</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.title} ({currentUser.role.toUpperCase()})</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] text-slate-400 font-semibold block">Status Database Firestore:</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  Realtime Cloud Sync Active
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">All changes persist continuously</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-800/80 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            Branding tersimpan otomatis secara lokal dan dapat diperbarui kapan saja.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
