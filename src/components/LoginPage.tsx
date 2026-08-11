import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
  appName?: string;
  appTagline?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin, appName = 'DOKU', appTagline = 'Digital Workspace' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDemoSection, setShowDemoSection] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);

    if (nextClicks >= 5) {
      setShowDemoSection(true);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      const foundUser = users.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      if (!foundUser) {
        setError('Email is not registered in the DOKU system.');
        setLoading(false);
        return;
      }

      // Check password (matching specified password or default 'doku123' if empty)
      const validPass = foundUser.password || 'doku123';
      if (cleanPass !== validPass) {
        setError('The password you entered is incorrect.');
        setLoading(false);
        return;
      }

      setLoading(false);
      onLogin(foundUser);
    }, 400);
  };

  const demoAccounts = [
    {
      label: 'Super Admin',
      role: 'Super Administrator',
      email: 'superadmin@doku.com',
      pass: 'superadmin123',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20',
      badge: 'Full Access'
    },
    {
      label: 'Admin Hub',
      role: 'VP Technology',
      email: 'admin@doku.com',
      pass: 'admin123',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
      badge: 'System Admin'
    },
    {
      label: 'Project Manager',
      role: 'Lead PM',
      email: 'budi.santoso@doku.com',
      pass: 'budi123',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20',
      badge: 'Manager'
    },
    {
      label: 'Developer',
      role: 'Engineering',
      email: 'rian.hidayat@doku.com',
      pass: 'rian123',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
      badge: 'Dev'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ea1d25]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#ea1d25]/10 border border-[#ea1d25]/30 text-[#ea1d25] text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#ea1d25]" />
            <span>{appName} {appTagline} Gateway</span>
          </div>

          <div 
            onClick={handleLogoClick} 
            className="flex items-center justify-center gap-3 cursor-pointer group active:scale-95 transition-transform"
            title={`${appName} Gateway`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#ea1d25] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#ea1d25]/40 group-hover:bg-[#c8141b] transition-colors">
              {(appName.trim().charAt(0) || 'D').toUpperCase()}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{appName}</h1>
          </div>

          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Sign in to access Analytics Dashboard, Kanban Task Boards, Executive Reports, and {appName} AI Assistant.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur-md">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">User Sign In</h2>
            <span className="text-[10px] text-slate-500 font-medium">v2.4 Secure Auth</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">User Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@doku.com or admin@doku.com"
                  className="w-full bg-[#1e1e1e] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ea1d25] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">Password *</label>
                {showDemoSection && <span className="text-[10px] text-[#ea1d25] font-medium">Default admin: admin123</span>}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="w-full bg-[#1e1e1e] border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ea1d25] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#ea1d25]/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Management Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Credentials Chips (Hidden by default, unlocked by 5 clicks on DOKU logo) */}
          {showDemoSection && (
            <div className="pt-3 border-t border-slate-800 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-slate-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea1d25]" />
                  Demo & Testing Accounts (Unlocked):
                </span>
                <span className="text-[10px] text-slate-500">Click to auto-fill</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickFill(acc.email, acc.pass)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${acc.color} flex flex-col justify-between group cursor-pointer`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-extrabold text-xs text-white group-hover:text-[#ea1d25] transition-colors">{acc.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 font-mono font-bold">{acc.badge}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono truncate">{acc.email}</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">pass: {acc.pass}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          DOKU Task & Project Management System &bull; Confidential & Executive Internal Tool
        </div>
      </div>
    </div>
  );
};
