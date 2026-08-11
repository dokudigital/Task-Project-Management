import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  FileText, 
  BarChart3, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Layers,
  LogOut,
  Settings
} from 'lucide-react';
import { ActiveTab, Project, User } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  projects: Project[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  onOpenNewProjectModal: () => void;
  onOpenNewTaskModal: () => void;
  onOpenAiAssistant: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  appName?: string;
  appTagline?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  currentUser,
  users,
  setCurrentUser,
  onOpenNewProjectModal,
  onOpenNewTaskModal,
  onOpenAiAssistant,
  onOpenSettings,
  onLogout,
  appName = 'DOKU',
  appTagline = 'Digital Workspace'
}) => {
  const brandInitial = appName.trim().charAt(0).toUpperCase() || 'D';

  return (
    <aside className="w-64 bg-gradient-to-b from-[#000000] to-[#161616] text-slate-300 flex flex-col h-screen border-r border-slate-800 select-none shrink-0 transition-all">
      {/* Workspace Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between group">
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
          title="Klik untuk membuka Pengaturan & Branding"
        >
          <div className="w-8 h-8 rounded-lg bg-[#ea1d25] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#ea1d25]/30 shrink-0">
            {brandInitial}
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-white text-base leading-tight tracking-tight truncate max-w-[140px]">
              {appName}
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 truncate max-w-[140px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
              <span className="truncate">{appTagline}</span>
            </p>
          </div>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="Pengaturan Aplikasi & Branding"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Action Buttons */}
      <div className="p-3 space-y-2">
        <button
          onClick={onOpenNewTaskModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white font-bold text-sm rounded-lg shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>

        <button
          onClick={onOpenAiAssistant}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#ea1d25]/10 hover:bg-[#ea1d25]/20 border border-[#ea1d25]/40 text-white text-xs font-semibold rounded-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ea1d25] animate-pulse" />
          <span className="truncate">{appName} AI Generator</span>
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">
          Main Menu
        </div>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedProjectId(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'dashboard' && !selectedProjectId
              ? 'bg-[#ea1d25] text-white font-bold shadow-xs'
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' && !selectedProjectId ? 'text-white' : 'text-[#ea1d25]'}`} />
          <span>Dashboard & Analytics</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('projects');
            setSelectedProjectId(null);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'projects' && !selectedProjectId
              ? 'bg-[#ea1d25] text-white font-bold shadow-xs'
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <FolderKanban className={`w-4 h-4 ${activeTab === 'projects' && !selectedProjectId ? 'text-white' : 'text-[#ea1d25]'}`} />
            <span>All Projects</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${activeTab === 'projects' && !selectedProjectId ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tasks');
            setSelectedProjectId(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'tasks' && !selectedProjectId
              ? 'bg-[#ea1d25] text-white font-bold shadow-xs'
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${activeTab === 'tasks' && !selectedProjectId ? 'text-white' : 'text-emerald-400'}`} />
          <span>Task Board (Kanban)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('team');
            setSelectedProjectId(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'team'
              ? 'bg-[#ea1d25] text-white font-bold shadow-xs'
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'team' ? 'text-white' : 'text-amber-400'}`} />
          <span>Team Management</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('docs');
            setSelectedProjectId(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'docs'
              ? 'bg-[#ea1d25] text-white font-bold shadow-xs'
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          <FileText className={`w-4 h-4 ${activeTab === 'docs' ? 'text-white' : 'text-teal-400'}`} />
          <span>Docs & Notes</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('reports');
            setSelectedProjectId(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'reports'
              ? 'bg-[#ea1d25] text-white font-bold shadow-xs'
              : 'hover:bg-slate-800/60 text-slate-300'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeTab === 'reports' ? 'text-white' : 'text-rose-400'}`} />
          <span>Reports & Export</span>
        </button>

        {onOpenSettings && (
          <button
            onClick={() => {
              onOpenSettings();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-slate-300 hover:bg-slate-800/60"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Pengaturan & Branding</span>
          </button>
        )}

        {/* Project List Section */}
        <div className="pt-4 mt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Project List
            </span>
            <button
              onClick={onOpenNewProjectModal}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
              title="Add New Project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {projects.map((proj) => {
              const isSelected = selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setActiveTab('projects');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md transition-colors group ${
                    isSelected
                      ? 'bg-[#ea1d25]/20 text-white font-bold border border-[#ea1d25]/50'
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">{proj.icon}</span>
                    <span className="truncate">{proj.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-400">
                    {proj.progress}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Switcher / Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#000000]/80 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold px-1">
          <span>Active Session:</span>
          {currentUser.role === 'admin' && (
            <span className="px-1.5 py-0.2 bg-[#ea1d25] text-white rounded font-bold">ADMIN</span>
          )}
        </div>

        <div className="flex items-center justify-between bg-[#161616] p-2 rounded-lg border border-slate-700/80">
          <div className="flex items-center gap-2 truncate">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full border border-slate-600 object-cover"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.title}</p>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative group pt-1">
          <div className="text-[10px] text-slate-500 mb-1 px-1">Switch Simulated User:</div>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const u = users.find(x => x.id === e.target.value);
              if (u) setCurrentUser(u);
            }}
            className="w-full bg-[#161616] text-slate-300 border border-slate-800 rounded-lg p-1.5 text-[11px] appearance-none focus:outline-none focus:border-[#ea1d25] pr-7 cursor-pointer font-medium"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role.toUpperCase()})
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-[28px] pointer-events-none text-slate-500">
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          </div>
        </div>
      </div>
    </aside>
  );
};
