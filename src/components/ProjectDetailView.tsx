import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FolderKanban, 
  CheckSquare, 
  LayoutGrid, 
  Table as TableIcon, 
  Calendar, 
  FileText, 
  Sparkles, 
  Plus, 
  User, 
  CheckCircle2, 
  Circle, 
  Clock, 
  DollarSign, 
  Tag,
  Loader2,
  Trash2,
  GripVertical,
  GitCommit,
  Globe,
  ExternalLink,
  CalendarDays
} from 'lucide-react';
import { Project, Task, Document, TaskStatus, TaskPriority, ProjectStatus } from '../types';

interface ProjectDetailViewProps {
  project: Project;
  tasks: Task[];
  documents: Document[];
  onBack: () => void;
  onUpdateProjectProgress: (projectId: string, newProgress: number) => void;
  onUpdateProjectStatus?: (projectId: string, newStatus: ProjectStatus) => void;
  onDeleteProject?: (projectId: string) => void;
  onToggleMilestone: (projectId: string, milestoneId: string) => void;
  onAddMilestone?: (projectId: string, title: string, dueDate: string) => void;
  onDeleteMilestone?: (projectId: string, milestoneId: string) => void;
  onOpenNewTaskModal: (projectId?: string) => void;
  onSelectTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  tasks,
  documents,
  onBack,
  onUpdateProjectProgress,
  onUpdateProjectStatus,
  onDeleteProject,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone,
  onOpenNewTaskModal,
  onSelectTask,
  onUpdateTaskStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'kanban' | 'table' | 'timeline' | 'milestones' | 'docs' | 'ai'>('overview');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string>('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectDocs = documents.filter(d => d.projectId === project.id);

  // Auto calculate task stats
  const doneTasks = projectTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = projectTasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = projectTasks.filter(t => t.status === 'todo').length;

  // AI Assist handler
  const handleGenerateAiPlan = async () => {
    setAiGenerating(true);
    setAiResult('');
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'project_plan',
          context: {
            projectName: project.name,
            category: project.category,
            description: project.description
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.text);
      } else {
        setAiResult(data.error || 'Gagal menghasilkan spesifikasi AI.');
      }
    } catch (err: any) {
      setAiResult('Terjadi kesalahan jaringan saat menghubungkan ke AI.');
    } finally {
      setAiGenerating(false);
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 -ml-3" />
            URGENT
          </span>
        );
      case 'high': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            HIGH
          </span>
        );
      case 'medium': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            MEDIUM
          </span>
        );
      case 'low': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete project "${project.name}"? This action cannot be undone.`)) {
                onDeleteProject?.(project.id);
              }
            }}
            className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Delete Project"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Project</span>
          </button>
          <button
            onClick={() => onOpenNewTaskModal(project.id)}
            className="px-3 py-1.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task to Project</span>
          </button>
        </div>
      </div>

      {/* Project Banner Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-3">
            <span className="text-4xl p-3 bg-slate-100 rounded-xl">{project.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {project.code}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{project.category}</span>
                <select
                  value={project.status}
                  onChange={(e) => onUpdateProjectStatus?.(project.id, e.target.value as ProjectStatus)}
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border cursor-pointer focus:outline-none transition-colors ml-1 ${
                    project.status === 'active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : project.status === 'planning'
                      ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                      : project.status === 'on_hold'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{project.name}</h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs font-bold text-slate-500">Target Completion Date</span>
            <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
              <Calendar className="w-4 h-4 text-[#a80800]" />
              {project.targetEndDate}
            </span>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban Board ({projectTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Database Table</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'timeline' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-rose-500" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveSubTab('milestones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'milestones' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Milestones ({project.milestones?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('docs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'docs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents ({projectDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'ai' ? 'bg-purple-600 text-white' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Project Spec</span>
          </button>
        </div>
      </div>

      {/* SubTab Content Rendering */}

      {/* 1. OVERVIEW SUBTAB */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Key Metrics & Milestones */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Completed Tasks</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{doneTasks} / {projectTasks.length}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Overall Progress</span>
                <div className="text-2xl font-extrabold text-[#a80800] mt-1">{project.progress}%</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Project Budget</span>
                <div className="text-lg font-extrabold text-slate-900 mt-1">
                  IDR {(project.budget || 0).toLocaleString('en-US')}
                </div>
              </div>
            </div>

            {/* Milestones Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Key Milestones List</h3>
                <button
                  onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                  className="text-xs text-[#a80800] hover:text-[#800600] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingMilestone ? 'Cancel' : 'Add Milestone'}</span>
                </button>
              </div>

              {isAddingMilestone && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMilestoneTitle.trim()) return;
                    onAddMilestone?.(project.id, newMilestoneTitle.trim(), newMilestoneDueDate || project.targetEndDate);
                    setNewMilestoneTitle('');
                    setNewMilestoneDueDate('');
                    setIsAddingMilestone(false);
                  }}
                  className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
                >
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Milestone Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. System Integration Testing"
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newMilestoneDueDate}
                      onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingMilestone(false)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#a80800] hover:bg-[#800600] text-white rounded font-bold"
                    >
                      Save Milestone
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {project.milestones?.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No milestones defined yet.</p>
                )}
                {project.milestones?.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors group"
                  >
                    <div
                      onClick={() => onToggleMilestone(project.id, m.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {m.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                      <span className={`text-xs font-bold ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {m.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Due: {m.dueDate}
                      </span>
                      {onDeleteMilestone && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMilestone(project.id, m.id);
                          }}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Lead & Recent Tasks */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Project Team</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{project.leadName}</div>
                  <div className="text-[10px] text-slate-500">Project Lead</div>
                </div>
              </div>
            </div>

            {/* Tasks Quick Summary */}
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Project Tasks ({projectTasks.length})</h3>
              <div className="space-y-2">
                {projectTasks.slice(0, 5).map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-slate-800 truncate pr-2">{t.title}</span>
                    {getPriorityBadge(t.priority)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KANBAN SUBTAB */}
      {activeSubTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['todo', 'in_progress', 'in_review', 'done'] as TaskStatus[]).map((colStatus) => {
            const colTasks = projectTasks.filter(t => t.status === colStatus);
            const colTitles: Record<TaskStatus, string> = {
              backlog: 'Backlog',
              todo: 'To Do',
              in_progress: 'In Progress',
              in_review: 'In Review',
              done: 'Done / Completed'
            };

            const isColumnHovered = dragOverCol === colStatus;

            return (
              <div
                key={colStatus}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverCol !== colStatus) setDragOverCol(colStatus);
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setDragOverCol(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
                  if (taskId) {
                    onUpdateTaskStatus(taskId, colStatus);
                  }
                  setDraggedTaskId(null);
                  setDragOverCol(null);
                }}
                className={`bg-slate-100/80 p-3 rounded-xl border transition-all min-h-[400px] flex flex-col ${
                  isColumnHovered
                    ? 'border-[#a80800] ring-2 ring-[#a80800]/30 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-700 uppercase">{colTitles[colStatus]}</span>
                  <span className="text-xs font-bold bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{colTasks.length}</span>
                </div>

                {isColumnHovered && (
                  <div className="mb-2 p-2 rounded-lg border-2 border-dashed border-[#a80800]/40 text-center text-xs font-semibold text-[#a80800] bg-rose-50/60 dark:bg-rose-900/20">
                    Drop task here
                  </div>
                )}

                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 && !isColumnHovered && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200/80 rounded-lg text-xs text-slate-400">
                      No tasks in this column
                    </div>
                  )}

                  {colTasks.map(t => {
                    const isBeingDragged = draggedTaskId === t.id;

                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', t.id);
                          e.dataTransfer.effectAllowed = 'move';
                          setDraggedTaskId(t.id);
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverCol(null);
                        }}
                        onClick={() => onSelectTask(t)}
                        className={`group bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:shadow-md cursor-grab active:cursor-grabbing transition-all ${
                          isBeingDragged ? 'opacity-40 scale-[0.98] ring-2 ring-[#a80800]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0" />
                            <span className="text-[10px] font-semibold text-slate-400">{t.id}</span>
                          </div>
                          {getPriorityBadge(t.priority)}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug mb-2">{t.title}</h4>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                          <span>{t.assigneeName}</span>
                          <span>{t.dueDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TABLE SUBTAB */}
      {activeSubTab === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-3">Task Title</th>
                <th className="p-3">Assignee</th>
                <th className="p-3">Priority</th>
                <th className="p-3">URL / Landing Page</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projectTasks.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td 
                    onClick={() => onSelectTask(t)}
                    className="p-3 font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                  >
                    {t.title}
                  </td>
                  <td className="p-3 text-slate-700">{t.assigneeName}</td>
                  <td className="p-3">{getPriorityBadge(t.priority)}</td>
                  <td className="p-3">
                    {t.url ? (
                      <a
                        href={t.url.startsWith('http') ? t.url : `https://${t.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ea1d25] hover:underline bg-rose-50 border border-rose-200 px-2 py-0.5 rounded max-w-[160px] truncate"
                        title={t.url}
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{t.url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-300 text-[11px] font-mono">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <select
                      value={t.status}
                      onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as TaskStatus)}
                      className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="p-3 text-slate-600">{t.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. TIMELINE SUBTAB */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#ea1d25]" />
                <span>Project Gantt & Roadmap Timeline</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual Schedule & Workstreams for {project.name} ({project.startDate || '2026-08-01'} to {project.targetEndDate})
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Done
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress
              </span>
              <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> To Do
              </span>
            </div>
          </div>

          {/* Project Milestones Banner in Timeline */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <GitCommit className="w-4 h-4 text-rose-600" />
                <span>Key Milestones Schedule</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {project.milestones.map(m => (
                  <div 
                    key={m.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      m.completed 
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => onToggleMilestone(project.id, m.id)}
                        className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                      />
                      <span className={`font-bold truncate ${m.completed ? 'line-through text-emerald-700' : ''}`}>
                        {m.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 shrink-0 ml-2">
                      {m.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Schedule Table / Gantt View */}
          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-12 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider bg-slate-100/80 p-2.5 rounded-lg border border-slate-200">
              <div className="col-span-4">Task Name & URL</div>
              <div className="col-span-2">Assignee</div>
              <div className="col-span-2">Priority & Status</div>
              <div className="col-span-4">Schedule Progress (Due Date)</div>
            </div>

            {projectTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No tasks created yet for this project.
              </div>
            ) : (
              projectTasks.map((t, index) => {
                const isCompleted = t.status === 'done';
                const isInProgress = t.status === 'in_progress' || t.status === 'in_review';
                const progressWidth = isCompleted ? '100%' : isInProgress ? '55%' : '15%';

                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer group shadow-2xs hover:shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                  >
                    {/* Task Title & Landing Page Link */}
                    <div className="md:col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">#{index + 1}</span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ea1d25] transition-colors truncate">
                          {t.title}
                        </h4>
                      </div>
                      {t.url && (
                        <a
                          href={t.url.startsWith('http') ? t.url : `https://${t.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ea1d25] hover:underline bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded max-w-full truncate"
                          title={t.url}
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">{t.url.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      )}
                    </div>

                    {/* Assignee */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <img src={t.assigneeAvatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <span className="text-xs text-slate-700 font-medium truncate">{t.assigneeName}</span>
                    </div>

                    {/* Priority & Status */}
                    <div className="md:col-span-2 flex flex-wrap items-center gap-1.5">
                      {getPriorityBadge(t.priority)}
                    </div>

                    {/* Timeline Bar & Schedule */}
                    <div className="md:col-span-4 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Target: {t.dueDate}</span>
                        <span className="font-bold uppercase text-slate-700">{t.status.replace('_', ' ')}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5 relative">
                        <div
                          style={{ width: progressWidth }}
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500' :
                            isInProgress ? 'bg-amber-500' :
                            'bg-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 5. AI SPEC SUBTAB */}
      {activeSubTab === 'ai' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Gemini AI PRD & Specification Generator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Automatically generate scope draft, milestones, and risk scenarios for {project.name}</p>
            </div>

            <button
              onClick={handleGenerateAiPlan}
              disabled={aiGenerating}
              className="px-4 py-2 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{aiGenerating ? 'Generating...' : 'Generate PRD Spec'}</span>
            </button>
          </div>

          {aiResult && (
            <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-mono">
              {aiResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
