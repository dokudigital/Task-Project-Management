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
  ChevronRight
} from 'lucide-react';
import { ActiveTab, User, Project, Task } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  selectedProject: Project | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: User;
  tasks?: Task[];
  onSelectTask?: (task: Task) => void;
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
  tasks = [],
  onSelectTask,
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onOpenNewUserModal,
  onExportReport,
  onOpenAiAssistant
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
