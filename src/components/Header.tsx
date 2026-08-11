import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Sparkles, 
  Bell, 
  UserPlus, 
  FolderPlus,
  BarChart3,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  X,
  CheckSquare,
  Folder,
  FileText,
  User as UserIcon,
  Tag,
  CornerDownLeft,
  Settings
} from 'lucide-react';
import { ActiveTab, User, Project, Task, Document } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  selectedProject: Project | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: User;
  tasks?: Task[];
  projects?: Project[];
  documents?: Document[];
  users?: User[];
  onSelectTask?: (task: Task) => void;
  onSelectProject?: (projectId: string) => void;
  onSelectDoc?: (doc: Document) => void;
  onSelectUser?: (userId: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenNewProjectModal: () => void;
  onOpenNewUserModal: () => void;
  onExportReport: () => void;
  onOpenAiAssistant: () => void;
  onOpenSettings?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  appName?: string;
  appTagline?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  selectedProject,
  searchQuery,
  setSearchQuery,
  currentUser,
  tasks = [],
  projects = [],
  documents = [],
  users = [],
  onSelectTask,
  onSelectProject,
  onSelectDoc,
  onSelectUser,
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onOpenNewUserModal,
  onExportReport,
  onOpenAiAssistant,
  onOpenSettings,
  isDarkMode = false,
  onToggleDarkMode,
  appName = 'DOKU',
  appTagline = 'Digital Workspace'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching keyword helper
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.trim().toLowerCase() ? (
        <mark key={index} className="bg-rose-100 text-[#ea1d25] dark:bg-rose-950 dark:text-rose-300 rounded font-semibold px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Auto-Suggest Filtering across Tasks, Projects, Docs, and Users
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { tasks: [], projects: [], documents: [], users: [], totalCount: 0 };

    const matchedTasks = tasks.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.description?.toLowerCase().includes(q) ||
      t.projectName?.toLowerCase().includes(q) ||
      t.assigneeName?.toLowerCase().includes(q) ||
      t.tags?.some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedProjects = projects.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedDocs = documents.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.content?.toLowerCase().includes(q) ||
      d.authorName?.toLowerCase().includes(q) ||
      d.tags?.some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedUsers = users.filter(u => 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q) ||
      u.title?.toLowerCase().includes(q)
    ).slice(0, 4);

    const totalCount = matchedTasks.length + matchedProjects.length + matchedDocs.length + matchedUsers.length;

    return {
      tasks: matchedTasks,
      projects: matchedProjects,
      documents: matchedDocs,
      users: matchedUsers,
      totalCount
    };
  }, [searchQuery, tasks, projects, documents, users]);

  const taskAlerts = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const now = new Date();

    return tasks
      .filter(task => task.status !== 'done' && task.dueDate)
      .map(task => {
        const due = new Date(task.dueDate.includes('T') ? task.dueDate : `${task.dueDate}T23:59:59`);
        if (isNaN(due.getTime())) return null;

        const diffMs = due.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffMs < 0) {
          const daysOverdue = Math.max(1, Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24)));
          return {
            task,
            isOverdue: true,
            isDueSoon: false,
            label: daysOverdue === 1 ? 'Overdue today' : `Overdue by ${daysOverdue} days`,
            diffMs
          };
        } else if (diffHours <= 24) {
          const hoursLeft = Math.max(1, Math.round(diffHours));
          return {
            task,
            isOverdue: false,
            isDueSoon: true,
            label: hoursLeft <= 1 ? 'Due within 1 hour' : `Due in ${hoursLeft} hours`,
            diffMs
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.diffMs - b.diffMs);
  }, [tasks]);
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
        return <span className="text-sm font-bold text-slate-900">Dashboard</span>;
      case 'projects':
        return <span className="text-sm font-bold text-slate-900">Project</span>;
      case 'tasks':
        return <span className="text-sm font-bold text-slate-900">Task Board</span>;
      case 'team':
        return <span className="text-sm font-bold text-slate-900">Team</span>;
      case 'docs':
        return <span className="text-sm font-bold text-slate-900">Notes & Docs</span>;
      case 'reports':
        return <span className="text-sm font-bold text-slate-900">Export Reports</span>;
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

      {/* Center Search Input with Auto-Suggest Dropdown */}
      <div className="relative w-80 lg:w-96 hidden md:block" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks, projects, docs, team..."
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSearchFocused(false);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea1d25]/20 focus:border-[#ea1d25] transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-all"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Auto-Suggest Dropdown Popup */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-full mt-2 w-96 lg:w-[480px] left-0 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header bar */}
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#ea1d25]" />
                <span className="font-bold text-xs">Search Auto-Suggestions</span>
              </div>
              <span className="text-[10px] font-bold bg-[#ea1d25] px-2 py-0.5 rounded-full text-white">
                {searchSuggestions.totalCount} match{searchSuggestions.totalCount !== 1 ? 'es' : ''}
              </span>
            </div>

            {/* Suggestions List Container */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
              {searchSuggestions.totalCount === 0 ? (
                <div className="p-6 text-center text-slate-500 space-y-1.5">
                  <Search className="w-6 h-6 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No results found for "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400">
                    Try searching by task name, project code (e.g. DOKU-01), document title, or team member.
                  </p>
                </div>
              ) : (
                <>
                  {/* Category: Tasks */}
                  {searchSuggestions.tasks.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <CheckSquare className="w-3 h-3 text-[#ea1d25]" />
                          Tasks ({searchSuggestions.tasks.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {searchSuggestions.tasks.map(t => (
                          <div
                            key={t.id}
                            onClick={() => {
                              onSelectTask?.(t);
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded shrink-0 mt-0.5 ${
                                t.status === 'done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                t.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {t.status.replace('_', ' ')}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 group-hover:text-[#ea1d25] transition-colors truncate">
                                  {highlightMatch(t.title, searchQuery)}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                  <span className="font-semibold text-slate-600">{t.projectName}</span>
                                  <span>•</span>
                                  <span>{t.assigneeName}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#ea1d25] shrink-0 transition-colors ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Projects */}
                  {searchSuggestions.projects.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <div className="px-2 py-1 flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Folder className="w-3 h-3 text-indigo-600" />
                          Projects ({searchSuggestions.projects.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {searchSuggestions.projects.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onSelectProject?.(p.id);
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base shrink-0">{p.icon}</span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 shrink-0">
                                    {p.code}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                    {highlightMatch(p.name, searchQuery)}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {p.category} • Progress: {p.progress}%
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Documents */}
                  {searchSuggestions.documents.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <div className="px-2 py-1 flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-amber-600" />
                          Documents & Specs ({searchSuggestions.documents.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {searchSuggestions.documents.map(d => (
                          <div
                            key={d.id}
                            onClick={() => {
                              onSelectDoc?.(d);
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base shrink-0">{d.icon || '📄'}</span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                                  {highlightMatch(d.title, searchQuery)}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  Author: {d.authorName} • Updated {d.updatedAt}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 shrink-0 transition-colors ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Team Members */}
                  {searchSuggestions.users.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <div className="px-2 py-1 flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <UserIcon className="w-3 h-3 text-emerald-600" />
                          Team Members ({searchSuggestions.users.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {searchSuggestions.users.map(u => (
                          <div
                            key={u.id}
                            onClick={() => {
                              onSelectUser?.(u.id);
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={u.avatarUrl} alt="" className="w-6 h-6 rounded-full border border-slate-200 shrink-0 object-cover" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                                  {highlightMatch(u.name, searchQuery)}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {u.title} ({u.role.toUpperCase()}) • {u.department}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0 transition-colors ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3 text-slate-400" />
                Click item to view details
              </span>
              <span>Press ESC to dismiss</span>
            </div>
          </div>
        )}
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

        {/* Settings / Branding Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Pengaturan Aplikasi & Branding"
          >
            <Settings className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden xl:inline">Pengaturan</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className={`px-2.5 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-[#000000] hover:bg-[#141414] border-zinc-800 text-amber-400 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 shadow-2xs'
            }`}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden xl:inline text-amber-400">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700 shrink-0" />
                <span className="hidden xl:inline text-slate-700">Dark Mode</span>
              </>
            )}
          </button>
        )}

        {/* Notification Bell Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all relative ${
              taskAlerts.length > 0
                ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title={
              taskAlerts.length > 0
                ? `${taskAlerts.length} task(s) overdue or approaching due date (within 24h)`
                : 'Notifications (No urgent tasks)'
            }
          >
            <Bell className="w-4 h-4 text-slate-700" />

            {/* Red dot indicator / count badge */}
            {taskAlerts.length > 0 && (
              <>
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ea1d25] text-[9px] font-black text-white shadow-xs ring-2 ring-white">
                  {taskAlerts.length}
                </span>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#ea1d25] animate-ping opacity-75" />
              </>
            )}
          </button>

          {/* Task Notifications Popover Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#ea1d25]" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">Task Notifications</h4>
                </div>
                {taskAlerts.length > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#ea1d25] text-[10px] font-bold text-white">
                    {taskAlerts.length} Alert{taskAlerts.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                    All Clear
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {taskAlerts.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No Urgent Tasks</p>
                    <p className="text-[11px] text-slate-400">All tasks are up to date! No tasks are overdue or due within 24 hours.</p>
                  </div>
                ) : (
                  taskAlerts.map(({ task, isOverdue, label }) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        onSelectTask?.(task);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 group"
                    >
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isOverdue ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {label}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 truncate max-w-[110px]">{task.projectName}</span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#ea1d25] transition-colors line-clamp-1">
                          {task.title}
                        </h5>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span className="flex items-center gap-1.5">
                            <img src={task.assigneeAvatar} alt="" className="w-3.5 h-3.5 rounded-full" />
                            <span className="truncate max-w-[120px] text-slate-600 font-medium">{task.assigneeName}</span>
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">Due: {task.dueDate}</span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#ea1d25] shrink-0 self-center transition-colors" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
