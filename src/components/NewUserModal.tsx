import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { User, UserRole } from '../types';

interface NewUserModalProps {
  onClose: () => void;
  onCreateUser: (newUser: User) => void;
}

export const NewUserModal: React.FC<NewUserModalProps> = ({
  onClose,
  onCreateUser
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('doku123');
  const [role, setRole] = useState<UserRole>('developer');
  const [department, setDepartment] = useState('Engineering');
  const [title, setTitle] = useState('Frontend Engineer');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const user: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password.trim() || 'doku123',
      role,
      department,
      title,
      avatarUrl
    };

    onCreateUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#ea1d25]" />
            <h2 className="text-base font-extrabold text-slate-900">Add Team Member (User)</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Example: John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Official Email *</label>
            <input
              type="email"
              required
              placeholder="john@doku.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-[#ea1d25]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Access Password *</label>
            <input
              type="text"
              required
              placeholder="Min. 6 chars (default: doku123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-[#ea1d25]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none"
              >
                <option value="project_manager">Project Manager</option>
                <option value="developer">Developer</option>
                <option value="designer">UI/UX Designer</option>
                <option value="qa">QA Specialist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Product & Tech">Product & Tech</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Management">Management</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Job Title</label>
            <input
              type="text"
              placeholder="Senior Backend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Avatar Photo URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:border-blue-500"
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
              Add New User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
