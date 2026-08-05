export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed';
export type UserRole = 'admin' | 'project_manager' | 'developer' | 'designer' | 'qa' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  avatarUrl: string;
  title: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  dueDate: string;
  startDate?: string;
  tags: string[];
  subtasks: SubTask[];
  comments: TaskComment[];
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  description: string;
  status: ProjectStatus;
  leadId: string;
  leadName: string;
  memberIds: string[];
  category: string;
  startDate: string;
  targetEndDate: string;
  budget?: number;
  progress: number; // 0 - 100
  milestones: Milestone[];
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  icon: string;
  content: string;
  projectId?: string;
  authorId: string;
  authorName: string;
  tags: string[];
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'projects' | 'tasks' | 'team' | 'docs' | 'reports';
export type TaskViewMode = 'kanban' | 'table' | 'calendar' | 'list';
