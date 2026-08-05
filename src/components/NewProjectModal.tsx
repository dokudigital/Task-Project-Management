import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { Project, User, ProjectStatus } from '../types';

interface NewProjectModalProps {
  users: User[];
  onClose: () => void;
  onCreateProject: (newProject: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  users,
  onClose,
  onCreateProject
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [icon, setIcon] = useState('🚀');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Product Development');
  const [leadId, setLeadId] = useState(users[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetEndDate, setTargetEndDate] = useState('2026-09-30');
  const [budget, setBudget] = useState(50000000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const leadUser = users.find(u => u.id === leadId) || users[0];

    const project: Project = {
      id: `prj-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase() || name.slice(0, 3).toUpperCase(),
      icon,
      color: 'bg-blue-500',
      description: description.trim(),
      status: 'planning',
      leadId: leadUser.id,
      leadName: leadUser.name,
      memberIds: [leadUser.id],
      category,
      startDate,
      targetEndDate,
      budget: Number(budget) || 0,
      progress: 0,
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Kickoff & Persiapan Ruang Lingkup', dueDate: startDate, completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    onCreateProject(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[#ea1d25]" />
            <h2 className="text-base font-extrabold text-slate-900">Create New Project</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="Example: Mobile Application Redesign"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!code) setCode(e.target.value.slice(0, 3).toUpperCase());
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Project Code</label>
              <input
                type="text"
                placeholder="MAR"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900 uppercase focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Emoji Icon</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-base focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none"
              >
                <option value="Product Development">Product Development</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="AI & Data Tech">AI & Data Tech</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Brief Description</label>
            <textarea
              rows={2}
              placeholder="Explain project goals and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Project Lead</label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.title})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Budget (IDR)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target End Date</label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg font-bold shadow-sm"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
