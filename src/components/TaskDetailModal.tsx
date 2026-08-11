import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Clock, 
  User, 
  Tag, 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Circle, 
  Loader2,
  Trash2,
  Link,
  ExternalLink
} from 'lucide-react';
import { Task, User as UserType, TaskStatus, TaskPriority } from '../types';

interface TaskDetailModalProps {
  task: Task;
  users: UserType[];
  currentUser: UserType;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  users,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask
}) => {
  const [subtaskInput, setSubtaskInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Status Change
  const handleStatusChange = (status: TaskStatus) => {
    onUpdateTask({ ...task, status, updatedAt: new Date().toISOString() });
  };

  // Priority Change
  const handlePriorityChange = (priority: TaskPriority) => {
    onUpdateTask({ ...task, priority, updatedAt: new Date().toISOString() });
  };

  // Assignee Change
  const handleAssigneeChange = (assigneeId: string) => {
    const user = users.find(u => u.id === assigneeId);
    if (!user) return;
    onUpdateTask({
      ...task,
      assigneeId: user.id,
      assigneeName: user.name,
      assigneeAvatar: user.avatarUrl,
      updatedAt: new Date().toISOString()
    });
  };

  // Toggle Subtask
  const handleToggleSubtask = (subId: string) => {
    const newSubs = task.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
    onUpdateTask({ ...task, subtasks: newSubs, updatedAt: new Date().toISOString() });
  };

  // Add Manual Subtask
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      title: subtaskInput.trim(),
      completed: false
    };
    onUpdateTask({ ...task, subtasks: [...task.subtasks, newSub] });
    setSubtaskInput('');
  };

  // AI Auto-Generate Subtasks using Gemini
  const handleGenerateAiSubtasks = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate_subtasks',
          context: {
            title: task.title,
            description: task.description
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        // Parse array or lines
        let generatedTitles: string[] = [];
        try {
          generatedTitles = JSON.parse(data.text);
        } catch {
          generatedTitles = data.text.split('\n').filter((l: string) => l.trim().length > 0).map((l: string) => l.replace(/^[-*0-9.]+\s*/, ''));
        }

        const newSubtasks = generatedTitles.slice(0, 5).map((t, idx) => ({
          id: `ai-sub-${Date.now()}-${idx}`,
          title: typeof t === 'string' ? t : String(t),
          completed: false
        }));

        onUpdateTask({
          ...task,
          subtasks: [...task.subtasks, ...newSubtasks]
        });
      }
    } catch (err) {
      console.error('Failed AI subtask generation:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      content: commentInput.trim(),
      createdAt: new Date().toISOString()
    };
    onUpdateTask({
      ...task,
      comments: [...task.comments, newComment]
    });
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#a80800] bg-rose-50 border border-rose-100 px-2.5 py-1 rounded">
              {task.projectName}
            </span>
            <span className="text-xs text-slate-400">ID: {task.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{task.title}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {task.description || 'No detailed description provided for this task.'}
            </p>

            {/* Reference URL / Landing Page Link */}
            <div className="mt-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-[#ea1d25]" />
                  Reference URL / Landing Page Link
                </span>
                {task.url && (
                  <a
                    href={task.url.startsWith('http') ? task.url : `https://${task.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-[#ea1d25] hover:underline flex items-center gap-1"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                placeholder="Paste reference link (e.g. https://doku.com/promo/landing-page)..."
                value={task.url || ''}
                onChange={(e) => onUpdateTask({ ...task, url: e.target.value.trim() || undefined, updatedAt: new Date().toISOString() })}
                className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#ea1d25]"
              />
            </div>
          </div>

          {/* Quick Properties Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            {/* Status Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Status</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="w-full bg-white border border-slate-200 rounded p-1.5 font-bold text-slate-800 focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                className="w-full bg-white border border-slate-200 rounded p-1.5 font-bold text-slate-800 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Assignee</label>
              <select
                value={task.assigneeId}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-1.5 font-bold text-slate-800 focus:outline-none truncate"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Due Date</label>
              <div className="font-bold text-slate-800 p-1.5 bg-white border border-slate-200 rounded">
                {task.dueDate}
              </div>
            </div>
          </div>

          {/* Subtasks Section with AI Subtask Generator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Subtask Checklist ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</span>
              </h3>

              <button
                onClick={handleGenerateAiSubtasks}
                disabled={isAiLoading}
                className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                <span>Auto-Generate Subtask Gemini</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {task.subtasks.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleToggleSubtask(s.id)}
                  className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 cursor-pointer text-xs"
                >
                  {s.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={s.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add manual subtask item..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
              >
                + Subtask
              </button>
            </form>
          </div>

          {/* Comments Feed */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Team Discussions & Comments ({task.comments.length})</span>
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto mb-3 pr-1">
              {task.comments.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.authorName}</span>
                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-700">{c.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#ea1d25]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
