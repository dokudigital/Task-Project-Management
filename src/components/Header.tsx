import React from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Sparkles, 
  Bell, 
  UserPlus, 
  FolderPlus,
  BarChart3
} from 'lucide-react';
import { ActiveTab, User, Project } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  selectedProject: Project | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: User;
  onOpenNewTaskModal: () => void;
  onOpenNewProjectModal: () => void;
  onOpenNewUserModal: () => void;
  onExportReport: () => void;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  selectedProject,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onOpenNewUserModal,
  onExportReport,
  onOpenAiAssistant
}) => {
  const getBreadcrumbTitle = () => {
    if (selectedProject) {
      return (
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span>{selectedProject.icon}</span>
          <span className="text-slate-500 font-medium">Project</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">{selectedProject.name}</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <span className="text-sm font-bold text-slate-900">Executive Dashboard & Analytics Overview</span>;
      case 'projects':
        return <span className="text-sm font-bold text-slate-900">Project Portfolio Management</span>;
      case 'tasks':
        return <span className="text-sm font-bold text-slate-900">Task Board (Kanban & Database Table)</span>;
      case 'team':
        return <span className="text-sm font-bold text-slate-900">Team & Workload Distribution</span>;
      case 'docs':
        return <span className="text-sm font-bold text-slate-900">DOKU Workspace Notes & Docs</span>;
      case 'reports':
        return <span className="text-sm font-bold text-slate-900">Executive Reports & Data Export</span>;
      default:
        return <span className="text-sm font-bold text-slate-900">Workspace</span>;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        {getBreadcrumbTitle()}
      </div>

      {/* Center Search Input */}
      <div className="relative w-72 max-w-sm hidden md:block">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, projects, docs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea1d25]/20 focus:border-[#ea1d25] transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAiAssistant}
          className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          title="Ask AI Project Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline">AI Assist</span>
        </button>

        <button
          onClick={onOpenNewUserModal}
          className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          title="Add Team Member"
        >
          <UserPlus className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Add User</span>
        </button>

        <button
          onClick={onOpenNewProjectModal}
          className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          title="Create New Project"
        >
          <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        <button
          onClick={onExportReport}
          className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          title="Print & Download PDF/CSV Report"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Print Report</span>
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* Current User Badge */}
        <div className="flex items-center gap-2 pl-1">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-300"
          />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{currentUser.title}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
