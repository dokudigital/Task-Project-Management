import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  User, 
  Calendar, 
  BarChart2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';
import { Project, Task, ProjectStatus } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (projectId: string) => void;
  onUpdateProjectStatus?: (projectId: string, newStatus: ProjectStatus) => void;
  onDeleteProject?: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onSelectProject,
  onUpdateProjectStatus,
  onDeleteProject,
  onOpenNewProjectModal
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const categories = Array.from(new Set(projects.map(p => p.category)));

  const filteredProjects = projects.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.code.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>;
      case 'planning':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Planning</span>;
      case 'on_hold':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">On Hold</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Completed</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Portfolio Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage all project workspaces, milestones, budgets, and team progress</p>
        </div>

        <button
          onClick={onOpenNewProjectModal}
          className="px-4 py-2.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search projects by name, code, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:inline" />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          const projectTasks = tasks.filter(t => t.projectId === p.id);
          const completedTasksCount = projectTasks.filter(t => t.status === 'done').length;
          const totalMilestones = p.milestones?.length || 0;
          const completedMilestones = p.milestones?.filter(m => m.completed).length || 0;

          return (
            <div
              key={p.id}
              onClick={() => onSelectProject(p.id)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Icon, Code & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 bg-slate-100 rounded-lg group-hover:scale-105 transition-transform">{p.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{p.code}</span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#a80800] transition-colors">
                        {p.name}
                      </h3>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-1.5">
                    <select
                      value={p.status}
                      onChange={(e) => onUpdateProjectStatus?.(p.id, e.target.value as ProjectStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none transition-colors ${
                        p.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : p.status === 'planning'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          : p.status === 'on_hold'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete project "${p.name}"? This action cannot be undone.`)) {
                          onDeleteProject?.(p.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {p.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Completion Progress</span>
                    <span className="text-slate-900 font-bold">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#a80800] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completed Tasks</span>
                    <span className="font-bold text-slate-800">{completedTasksCount} / {projectTasks.length} Tasks</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Milestone</span>
                    <span className="font-bold text-slate-800">{completedMilestones} / {totalMilestones} Done</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Lead & End Date */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700 truncate">{p.leadName}</span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.targetEndDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching projects found</h3>
          <p className="text-xs text-slate-500 mt-1">Try changing your search keywords or reset filters above.</p>
        </div>
      )}
    </div>
  );
};
