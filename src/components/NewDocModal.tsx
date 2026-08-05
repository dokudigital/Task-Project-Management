import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { Document, Project, User } from '../types';

interface NewDocModalProps {
  projects: Project[];
  currentUser: User;
  onClose: () => void;
  onCreateDoc: (newDoc: Document) => void;
}

export const NewDocModal: React.FC<NewDocModalProps> = ({
  projects,
  currentUser,
  onClose,
  onCreateDoc
}) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📄');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [tagsInput, setTagsInput] = useState('PRD, Specs');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const doc: Document = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      icon,
      content: content.trim(),
      projectId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onCreateDoc(doc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ea1d25]" />
            <h2 className="text-base font-extrabold text-slate-900">Create New Document</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
            <input
              type="text"
              required
              placeholder="Example: Payment System Feature PRD"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
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
              <label className="font-bold text-slate-700 block mb-1">Related Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="PRD, SOP, Guidelines"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Document Content (Markdown / Text)</label>
            <textarea
              rows={6}
              placeholder="Write project notes or documentation content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
            />
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
              Save Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
