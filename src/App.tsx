import React, { useState } from 'react';
import { 
  ActiveTab, 
  Project, 
  Task, 
  User, 
  Document, 
  ActivityLog, 
  TaskStatus 
} from './types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_USERS, 
  INITIAL_DOCUMENTS, 
  INITIAL_ACTIVITIES 
} from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { TasksView } from './components/TasksView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { TeamView } from './components/TeamView';
import { DocsView } from './components/DocsView';
import { ReportsView } from './components/ReportsView';

import { NewProjectModal } from './components/NewProjectModal';
import { NewTaskModal } from './components/NewTaskModal';
import { NewUserModal } from './components/NewUserModal';
import { NewDocModal } from './components/NewDocModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginPage } from './components/LoginPage';
import { printExecutiveReport } from './utils/exportUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('doku_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUserId = localStorage.getItem('doku_user_id');
    const savedUser = INITIAL_USERS.find(u => u.id === savedUserId);
    return savedUser || INITIAL_USERS[0];
  });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('doku_auth', 'true');
    localStorage.setItem('doku_user_id', user.id);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('doku_auth');
    localStorage.removeItem('doku_user_id');
  };

  // Modal Open States
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [newTaskDefaultProjectId, setNewTaskDefaultProjectId] = useState<string | undefined>(undefined);

  // Selected Project Object
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  // Handlers
  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    addActivityLog(currentUser.name, 'membuat proyek baru', newProject.name);
  };

  const handleCreateTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    addActivityLog(currentUser.name, 'membuat tugas baru', newTask.title);
  };

  const handleCreateUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    addActivityLog(currentUser.name, 'menambahkan anggota tim baru', `${newUser.name} (${newUser.title})`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    addActivityLog(currentUser.name, 'memperbarui data user', updatedUser.name);
  };

  const handleDeleteUser = (userId: string) => {
    const u = users.find(x => x.id === userId);
    setUsers(prev => prev.filter(x => x.id !== userId));
    if (u) {
      addActivityLog(currentUser.name, 'menghapus user', u.name);
    }
  };

  const handleCreateDoc = (newDoc: Document) => {
    setDocuments(prev => [newDoc, ...prev]);
    addActivityLog(currentUser.name, 'membuat dokumen baru', newDoc.title);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);

    // Auto-update project progress
    updateProjectProgressFromTasks(updatedTask.projectId);
  };

  const handleDeleteTask = (taskId: string) => {
    const t = tasks.find(x => x.id === taskId);
    setTasks(prev => prev.filter(x => x.id !== taskId));
    setSelectedTask(null);
    if (t) {
      addActivityLog(currentUser.name, 'menghapus tugas', t.title);
      updateProjectProgressFromTasks(t.projectId);
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updated = { ...task, status: newStatus, updatedAt: new Date().toISOString() };
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    addActivityLog(currentUser.name, 'memperbarui status tugas', `${task.title} → ${newStatus.toUpperCase()}`);
    updateProjectProgressFromTasks(task.projectId);
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const calcProgress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : p.progress;

      return {
        ...p,
        milestones: updatedMilestones,
        progress: calcProgress
      };
    }));
  };

  const updateProjectProgressFromTasks = (projId: string) => {
    const pTasks = tasks.filter(t => t.projectId === projId);
    if (pTasks.length === 0) return;
    const doneCount = pTasks.filter(t => t.status === 'done').length;
    const calcProgress = Math.round((doneCount / pTasks.length) * 100);

    setProjects(prev => prev.map(p => p.id === projId ? { ...p, progress: calcProgress } : p));
  };

  const addActivityLog = (user: string, action: string, target: string) => {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      user,
      action,
      target,
      timestamp: 'Baru saja'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  if (!isAuthenticated) {
    return <LoginPage users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Notion Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        currentUser={currentUser}
        users={users}
        setCurrentUser={setCurrentUser}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onOpenNewTaskModal={() => {
          setNewTaskDefaultProjectId(undefined);
          setIsNewTaskModalOpen(true);
        }}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          activeTab={activeTab}
          selectedProject={selectedProject}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onOpenNewTaskModal={() => {
            setNewTaskDefaultProjectId(undefined);
            setIsNewTaskModalOpen(true);
          }}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          onOpenNewUserModal={() => setIsNewUserModalOpen(true)}
          onExportReport={() => printExecutiveReport(projects, tasks, users)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        />

        {/* View Content Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Detailed Project View */}
          {selectedProject ? (
            <ProjectDetailView
              project={selectedProject}
              tasks={tasks}
              documents={documents}
              onBack={() => setSelectedProjectId(null)}
              onUpdateProjectProgress={(id, prog) => {
                setProjects(prev => prev.map(p => p.id === id ? { ...p, progress: prog } : p));
              }}
              onToggleMilestone={handleToggleMilestone}
              onOpenNewTaskModal={(pId) => {
                setNewTaskDefaultProjectId(pId);
                setIsNewTaskModalOpen(true);
              }}
              onSelectTask={(task) => setSelectedTask(task)}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  projects={projects}
                  tasks={tasks}
                  users={users}
                  activities={activities}
                  onSelectProject={(id) => {
                    setSelectedProjectId(id);
                    setActiveTab('projects');
                  }}
                  onSelectTask={(task) => setSelectedTask(task)}
                  onOpenNewTaskModal={() => {
                    setNewTaskDefaultProjectId(undefined);
                    setIsNewTaskModalOpen(true);
                  }}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                  onOpenNewUserModal={() => setIsNewUserModalOpen(true)}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  tasks={tasks}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                />
              )}

              {activeTab === 'tasks' && (
                <TasksView
                  tasks={tasks}
                  projects={projects}
                  users={users}
                  onSelectTask={(task) => setSelectedTask(task)}
                  onOpenNewTaskModal={() => {
                    setNewTaskDefaultProjectId(undefined);
                    setIsNewTaskModalOpen(true);
                  }}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              )}

              {activeTab === 'team' && (
                <TeamView
                  users={users}
                  tasks={tasks}
                  onOpenNewUserModal={() => setIsNewUserModalOpen(true)}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}

              {activeTab === 'docs' && (
                <DocsView
                  documents={documents}
                  projects={projects}
                  onOpenNewDocModal={() => setIsNewDocModalOpen(true)}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  projects={projects}
                  tasks={tasks}
                  users={users}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          users={users}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <NewProjectModal
          users={users}
          onClose={() => setIsNewProjectModalOpen(false)}
          onCreateProject={handleCreateProject}
        />
      )}

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <NewTaskModal
          projects={projects}
          users={users}
          defaultProjectId={newTaskDefaultProjectId}
          onClose={() => setIsNewTaskModalOpen(false)}
          onCreateTask={handleCreateTask}
        />
      )}

      {/* New User Modal */}
      {isNewUserModalOpen && (
        <NewUserModal
          onClose={() => setIsNewUserModalOpen(false)}
          onCreateUser={handleCreateUser}
        />
      )}

      {/* New Doc Modal */}
      {isNewDocModalOpen && (
        <NewDocModal
          projects={projects}
          currentUser={currentUser}
          onClose={() => setIsNewDocModalOpen(false)}
          onCreateDoc={handleCreateDoc}
        />
      )}

      {/* AI Assistant Modal */}
      {isAiAssistantOpen && (
        <AiAssistantModal
          onClose={() => setIsAiAssistantOpen(false)}
        />
      )}
    </div>
  );
}
