// 灵笼看板类型定义

// 员工信息
export interface Employee {
  id: string;
  name: string;
  avatar?: string;
  department: Department;
  position: string;
  level: number;
  status: EmployeeStatus;
  email?: string;
  phone?: string;
}

// 部门枚举
export enum Department {
  OFFICE = 'office',      // 集团办公室
  MARKETING = 'marketing', // 市场部
  DEVELOPMENT = 'development', // 开发部
  OPERATIONS = 'operations',   // 运营部
  SECURITY = 'security',       // 安全部
  PUBLICITY = 'publicity'      // 宣传部
}

// 员工状态
export type EmployeeStatus = 'online' | 'busy' | 'offline' | 'away';

// 任务状态
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';

// 任务优先级
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: Employee;
  creator: Employee;
  department: Department;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags?: string[];
}

// 看板列
export interface BoardColumn {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: Task[];
  limit?: number; // WIP限制
}

// 系统状态
export interface SystemStatus {
  gateway: ServiceStatus;
  database: ServiceStatus;
  websocket: ServiceStatus;
  agents: AgentStatus[];
}

// 服务状态
export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  uptime?: number;
  lastCheck: Date;
  message?: string;
}

// Agent状态
export interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'error' | 'offline';
  currentTask?: string;
  lastHeartbeat: Date;
}

// WebSocket消息
export interface WSMessage {
  type: WSMessageType;
  payload: unknown;
  timestamp: number;
  id: string;
}

// WebSocket消息类型
export type WSMessageType = 
  | 'ping'
  | 'pong'
  | 'auth'
  | 'auth_success'
  | 'auth_error'
  | 'task_update'
  | 'task_create'
  | 'task_delete'
  | 'employee_update'
  | 'system_status'
  | 'notification'
  | 'error';

// 通知
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// 快捷操作
export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  description?: string;
  action: () => void;
  shortcut?: string;
}

// 主题配置
export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// 灵笼主题色
export const LINGLONG_THEME: ThemeConfig = {
  primary: '#1a365d',      // 深蓝
  secondary: '#ed8936',    // 橙色
  background: '#0f172a',   // 深色背景
  surface: '#1e293b',      // 卡片背景
  text: '#e2e8f0',         // 主文字
  textMuted: '#94a3b8',    // 次要文字
  border: '#334155',       // 边框
  success: '#10b981',      // 成功
  warning: '#f59e0b',      // 警告
  error: '#ef4444',        // 错误
  info: '#3b82f6'          // 信息
};

// 部门配置
export const DEPARTMENT_CONFIG: Record<Department, { name: string; icon: string; color: string }> = {
  [Department.OFFICE]: { name: '集团办公室', icon: '🏢', color: '#1a365d' },
  [Department.MARKETING]: { name: '市场部', icon: '📈', color: '#ed8936' },
  [Department.DEVELOPMENT]: { name: '开发部', icon: '💻', color: '#3b82f6' },
  [Department.OPERATIONS]: { name: '运营部', icon: '⚙️', color: '#10b981' },
  [Department.SECURITY]: { name: '安全部', icon: '🛡️', color: '#ef4444' },
  [Department.PUBLICITY]: { name: '宣传部', icon: '📢', color: '#8b5cf6' }
};

// 视图类型
export type ViewType = 'organization' | 'kanban' | 'monitor' | 'actions';
