import React, { useState } from 'react';
import { X, UserCheck, Trash2 } from 'lucide-react';
import { User, UserRole } from '../types';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser?: (userId: string) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onClose,
  onUpdateUser,
  onDeleteUser
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password || 'doku123');
  const [role, setRole] = useState<UserRole>(user.role);
  const [department, setDepartment] = useState(user.department);
  const [title, setTitle] = useState(user.title);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onUpdateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      password: password.trim() || 'doku123',
      role,
      department: department.trim(),
      title: title.trim(),
      avatarUrl: avatarUrl.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#ea1d25]" />
            <h2 className="text-base font-extrabold text-slate-900">Edit Member Data (User)</h2>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-[#ea1d25]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Official Email *</label>
            <input
              type="email"
              required
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
              placeholder="Change user password..."
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
              {department === 'CUSTOM' ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    required
                    placeholder="Type department..."
                    autoFocus
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:border-[#ea1d25]"
                  />
                  <button
                    type="button"
                    onClick={() => setDepartment(user.department)}
                    className="p-2 text-xs font-bold text-slate-500 hover:text-slate-800 shrink-0"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none"
                >
                  <option value={user.department}>{user.department} (Current)</option>
                  <option value="Engineering">Engineering</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Product & Tech">Product & Tech</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Management">Management</option>
                  <option value="Finance & Ops">Finance & Ops</option>
                  <option value="CUSTOM">+ Custom Dept...</option>
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:outline-none focus:border-[#ea1d25]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Avatar Photo URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:border-[#ea1d25]"
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            {onDeleteUser ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete user ${user.name}?`)) {
                    onDeleteUser(user.id);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete User</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
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
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
