import React, { useState } from 'react';
import { 
  CheckSquare, 
  LayoutGrid, 
  Table as TableIcon, 
  Calendar as CalendarIcon, 
  List, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Tag, 
  ChevronRight,
  Sparkles,
  GripVertical,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Task, Project, User as UserType, TaskStatus, TaskPriority, TaskViewMode } from '../types';
import { CalendarView } from './CalendarView';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  users: UserType[];
  onSelectTask: (task: Task) => void;
  onOpenNewTaskModal: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  users,
  onSelectTask,
  onOpenNewTaskModal,
  onUpdateTaskStatus
}) => {
  const [viewMode, setViewMode] = useState<TaskViewMode>('kanban');
  const [search, setSearch] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  // Filter logic
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.projectName.toLowerCase().includes(search.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesProject = selectedProjectId === 'all' || t.projectId === selectedProjectId;
    const matchesAssignee = selectedAssigneeId === 'all' || t.assigneeId === selectedAssigneeId;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    return matchesSearch && matchesProject && matchesAssignee && matchesPriority && matchesStatus;
  });

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

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'backlog': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Backlog</span>;
      case 'todo': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">To Do</span>;
      case 'in_progress': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">In Progress</span>;
      case 'in_review': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">In Review</span>;
      case 'done': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Done</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Task Management Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage team tasks with Kanban board, Calendar, Database Table, or List views</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-[#ea1d25] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar' ? 'bg-[#ea1d25] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table' ? 'bg-[#ea1d25] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-[#ea1d25] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="px-4 py-2 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search task, tag, or project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            value={selectedAssigneeId}
            onChange={(e) => setSelectedAssigneeId(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Assignees</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
          {(['todo', 'in_progress', 'in_review', 'done'] as TaskStatus[]).map((colStatus) => {
            const colTasks = filteredTasks.filter(t => t.status === colStatus);
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
                className={`bg-slate-100/90 p-3 rounded-xl border transition-all min-h-[500px] flex flex-col ${
                  isColumnHovered
                    ? 'border-[#a80800] ring-2 ring-[#a80800]/30 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{colTitles[colStatus]}</span>
                  </div>
                  <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>

                {isColumnHovered && (
                  <div className="mb-2 p-2 rounded-lg border-2 border-dashed border-[#a80800]/40 text-center text-xs font-semibold text-[#a80800] bg-rose-50/60 dark:bg-rose-900/20">
                    Drop task here
                  </div>
                )}

                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 && !isColumnHovered && (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-slate-200/80 rounded-xl text-xs text-slate-400">
                      No tasks in this column
                    </div>
                  )}

                  {colTasks.map(t => {
                    const completedSubs = t.subtasks?.filter(s => s.completed).length || 0;
                    const totalSubs = t.subtasks?.length || 0;
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
                        className={`group bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-2.5 hover:border-slate-300 relative ${
                          isBeingDragged ? 'opacity-40 scale-[0.98] ring-2 ring-[#a80800]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 min-w-0">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0" />
                            <span className="text-[10px] font-bold text-[#a80800] bg-rose-50 border border-rose-100/80 px-2 py-0.5 rounded truncate">
                              {t.projectName}
                            </span>
                          </div>
                          {getPriorityBadge(t.priority)}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {t.title}
                        </h4>

                        {/* Reference URL badge if available */}
                        {t.url && (
                          <div className="flex items-center gap-1">
                            <a
                              href={t.url.startsWith('http') ? t.url : `https://${t.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ea1d25] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded transition-all max-w-full truncate"
                              title={t.url}
                            >
                              <Globe className="w-3 h-3 shrink-0" />
                              <span className="truncate">{t.url.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </div>
                        )}

                        {/* Subtasks Progress */}
                        {totalSubs > 0 && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                            <span>{completedSubs}/{totalSubs} subtask</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <img src={t.assigneeAvatar} alt={t.assigneeName} className="w-5 h-5 rounded-full object-cover" />
                            <span className="truncate max-w-[90px]">{t.assigneeName}</span>
                          </div>

                          <span className="font-semibold text-slate-700">{t.dueDate}</span>
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

      {/* VIEW MODE 2: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <CalendarView
          tasks={filteredTasks}
          onSelectTask={onSelectTask}
          onOpenNewTaskModal={onOpenNewTaskModal}
        />
      )}

      {/* VIEW MODE 3: DATABASE TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-3">Task Title</th>
                <th className="p-3">Project</th>
                <th className="p-3">Assignee</th>
                <th className="p-3">Priority</th>
                <th className="p-3">URL / Landing Page</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td 
                    onClick={() => onSelectTask(t)}
                    className="p-3 font-semibold text-slate-900 cursor-pointer hover:text-[#a80800]"
                  >
                    {t.title}
                  </td>
                  <td className="p-3 text-slate-600">{t.projectName}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <img src={t.assigneeAvatar} alt={t.assigneeName} className="w-5 h-5 rounded-full object-cover" />
                      <span>{t.assigneeName}</span>
                    </div>
                  </td>
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

      {/* VIEW MODE 3: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              No tasks match the current filter options.
            </div>
          ) : (
            filteredTasks.map(t => {
              const priorityBorderColor = 
                t.priority === 'urgent' ? 'border-l-4 border-l-rose-500' :
                t.priority === 'high' ? 'border-l-4 border-l-amber-500' :
                t.priority === 'medium' ? 'border-l-4 border-l-blue-500' :
                'border-l-4 border-l-slate-300';

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className={`p-3 bg-slate-50 hover:bg-white rounded-lg border border-slate-200 cursor-pointer transition-all hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${priorityBorderColor}`}
                >
                  <div className="flex items-center gap-3">
                    {getStatusBadge(t.status)}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{t.title}</span>
                      </h4>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-700">{t.projectName}</span>
                        <span>•</span>
                        <span>Assignee: {t.assigneeName}</span>
                        {t.url && (
                          <>
                            <span>•</span>
                            <a
                              href={t.url.startsWith('http') ? t.url : `https://${t.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 font-bold text-[#ea1d25] hover:underline bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded"
                              title={t.url}
                            >
                              <Globe className="w-3 h-3" />
                              <span className="max-w-[180px] truncate">{t.url.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">Priority:</span>
                      {getPriorityBadge(t.priority)}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{t.dueDate}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
