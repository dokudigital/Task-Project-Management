import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Briefcase, 
  CheckSquare, 
  ShieldCheck, 
  Search,
  Building,
  Edit3
} from 'lucide-react';
import { User, Task, UserRole } from '../types';
import { EditUserModal } from './EditUserModal';

interface TeamViewProps {
  users: User[];
  tasks: Task[];
  onOpenNewUserModal: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  users,
  tasks,
  onOpenNewUserModal,
  onUpdateUser,
  onDeleteUser
}) => {
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase()) ||
    u.title.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">Admin</span>;
      case 'project_manager': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ea1d25]/10 text-[#ea1d25] border border-[#ea1d25]/20">Project Manager</span>;
      case 'developer': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Developer</span>;
      case 'designer': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">UI/UX Designer</span>;
      case 'qa': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">QA Lead</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Member</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Team & Users Management (DOKU Users)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and edit team members, role permissions, departments, and task workload allocation</p>
        </div>

        <button
          onClick={onOpenNewUserModal}
          className="px-4 py-2.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Team Member</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by name, email, title, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#ea1d25]"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(u => {
          const userTasks = tasks.filter(t => t.assigneeId === u.id);
          const activeTasks = userTasks.filter(t => t.status !== 'done').length;
          const doneTasks = userTasks.filter(t => t.status === 'done').length;

          return (
            <div key={u.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{u.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{u.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {getRoleBadge(u.role)}
                    <button
                      onClick={() => setEditingUser(u)}
                      className="px-2 py-1 bg-slate-100 hover:bg-[#ea1d25] hover:text-white text-slate-700 text-[11px] font-bold rounded flex items-center gap-1 transition-colors"
                      title="Edit Data User"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Department: {u.department}</span>
                  </div>
                </div>
              </div>

              {/* Workload Stats Footer */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-100 p-2 rounded text-center">
                  <span className="text-[10px] text-slate-600 font-bold block uppercase">Active Tasks</span>
                  <span className="text-base font-extrabold text-slate-900">{activeTasks}</span>
                </div>
                <div className="bg-emerald-50 p-2 rounded text-center">
                  <span className="text-[10px] text-emerald-600 font-bold block uppercase">Completed Tasks</span>
                  <span className="text-base font-extrabold text-emerald-900">{doneTasks}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdateUser={onUpdateUser}
          onDeleteUser={onDeleteUser}
        />
      )}
    </div>
  );
};
