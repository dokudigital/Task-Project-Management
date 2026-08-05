import React from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  CheckSquare, 
  ChevronRight,
  Plus,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { Project, Task, User, ActivityLog } from '../types';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  users: User[];
  activities: ActivityLog[];
  onSelectProject: (projectId: string) => void;
  onSelectTask: (task: Task) => void;
  onOpenNewTaskModal: () => void;
  onOpenNewProjectModal: () => void;
  onOpenNewUserModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  tasks,
  users,
  activities,
  onSelectProject,
  onSelectTask,
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onOpenNewUserModal
}) => {
  // Calculations
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Upcoming Due Dates (Next 7 days or overdue)
  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = [...tasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  // Status Chart Data
  const statusCounts = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    in_review: tasks.filter(t => t.status === 'in_review').length,
    done: doneTasks,
  };

  const statusPieData = [
    { name: 'Completed (Done)', value: statusCounts.done, color: '#10b981' },
    { name: 'In Progress', value: statusCounts.in_progress, color: '#3b82f6' },
    { name: 'In Review', value: statusCounts.in_review, color: '#f59e0b' },
    { name: 'To Do', value: statusCounts.todo, color: '#64748b' },
  ].filter(d => d.value > 0);

  // Workload Chart Data
  const workloadData = users.map(u => {
    const userTasks = tasks.filter(t => t.assigneeId === u.id);
    const active = userTasks.filter(t => t.status !== 'done').length;
    const completed = userTasks.filter(t => t.status === 'done').length;
    return {
      name: u.name.split(' ')[0],
      Active: active,
      Completed: completed
    };
  });

  // Project Progress Bar Chart Data
  const projectProgressData = projects.map(p => ({
    name: p.code,
    fullName: p.name,
    Progress: p.progress
  }));

  // Priority Breakdown Data
  const priorityData = [
    { priority: 'Urgent', count: tasks.filter(t => t.priority === 'urgent').length, color: '#ef4444' },
    { priority: 'High', count: tasks.filter(t => t.priority === 'high').length, color: '#f97316' },
    { priority: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: '#eab308' },
    { priority: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#000000] via-[#161616] to-[#000000] rounded-2xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ea1d25] text-white">
              DOKU Executive Hub
            </span>
            <span className="text-xs text-slate-400">Real-Time Workspaces Overview</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome to DOKU Task & Project Management
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Monitor project portfolio performance, task completion progress, team workload allocation, and upcoming deadlines in a single integrated analytics dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewProjectModal}
            className="px-4 py-2 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
          <button
            onClick={onOpenNewTaskModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 border border-slate-700"
          >
            <CheckSquare className="w-4 h-4 text-[#ea1d25]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Projects</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalProjects}</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {activeProjects} Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Average portfolio progress: <strong className="text-slate-800">{Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / (totalProjects || 1))}%</strong>
          </p>
        </div>

        {/* Total Tasks Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Tasks</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalTasks}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {inProgressTasks} In Progress
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Active tasks across all projects
          </p>
        </div>

        {/* Status Done Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Tasks</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{doneTasks}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {completionPercentage}% Target
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Team Members Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Members</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{users.length}</span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Project Managers & Tech
            </span>
          </div>
          <div className="flex items-center -space-x-2 mt-3">
            {users.slice(0, 5).map(u => (
              <img
                key={u.id}
                src={u.avatarUrl}
                alt={u.name}
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                title={`${u.name} (${u.title})`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Distribution of Task Statuses */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Task Status Distribution</h3>
              <p className="text-xs text-slate-500">Progress percentage across all tasks</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Realtime
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            {statusPieData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium truncate">{item.name}</span>
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Workload distribution per Team Member */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Team Workload Distribution</h3>
              <p className="text-xs text-slate-500">Active vs completed tasks per team member</p>
            </div>
            <button 
              onClick={onOpenNewUserModal}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              + New User
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="Active" name="Active Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-xs" />
              <span>Active Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-xs" />
              <span>Completed (Done)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Progress Area Chart & Due Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Project Progress Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Project Portfolio Progress (%)</h3>
              <p className="text-xs text-slate-500">Milestone completion rate per project</p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} width={45} />
                <Tooltip 
                  formatter={(val: number) => [`${val}%`, 'Progres']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="Progress" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick List of Projects */}
          <div className="space-y-2 mt-2 pt-3 border-t border-slate-100">
            {projects.slice(0, 3).map((p) => (
              <div 
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base">{p.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.category} • Lead: {p.leadName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{p.progress}%</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Urgent Due Dates & Deadline Tasks */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-sm">Upcoming Deadlines</h3>
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                Approaching Due Date
              </span>
            </div>

            <div className="space-y-2.5">
              {upcomingTasks.map((t) => {
                const isOverdue = t.dueDate < today;
                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/80 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                        {t.title}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        t.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                        t.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                      <span className="truncate">{t.projectName}</span>
                      <span className={`font-semibold flex items-center gap-1 ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                        <Calendar className="w-3 h-3" />
                        {t.dueDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenNewTaskModal}
              className="w-full py-2 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity History Feed */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm">Recent Workspace Activity</h3>
          <span className="text-xs text-slate-500">Automated log of status updates & changes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((act) => (
            <div key={act.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-xs flex items-start gap-2.5">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-full shrink-0 mt-0.5">
                <Zap className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800">
                  <strong className="font-semibold text-slate-900">{act.user}</strong> {act.action}{' '}
                  <span className="text-blue-600 font-medium">{act.target}</span>
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
