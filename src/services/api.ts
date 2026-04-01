import type { 
  Employee, 
  Task, 
  BoardColumn, 
  SystemStatus, 
  Notification 
} from '../types/index.js';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errorData?.message || `请求失败: ${response.status}`,
      errorData
    );
  }

  return response.json();
}

// 员工相关 API
export const employeeApi = {
  getAll(): Promise<Employee[]> {
    return fetchApi<Employee[]>('/employees');
  },

  getById(id: string): Promise<Employee> {
    return fetchApi<Employee>(`/employees/${id}`);
  },

  getByDepartment(department: string): Promise<Employee[]> {
    return fetchApi<Employee[]>(`/employees?department=${department}`);
  }
};

// 任务相关 API
export const taskApi = {
  getAll(): Promise<Task[]> {
    return fetchApi<Task[]>('/tasks');
  },

  getById(id: string): Promise<Task> {
    return fetchApi<Task>(`/tasks/${id}`);
  },

  getByStatus(status: string): Promise<Task[]> {
    return fetchApi<Task[]>(`/tasks?status=${status}`);
  },

  getBoardColumns(): Promise<BoardColumn[]> {
    return fetchApi<BoardColumn[]>('/tasks/board');
  },

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return fetchApi<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    });
  },

  update(id: string, updates: Partial<Task>): Promise<Task> {
    return fetchApi<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  delete(id: string): Promise<void> {
    return fetchApi<void>(`/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  move(id: string, status: string): Promise<Task> {
    return fetchApi<Task>(`/tasks/${id}/move`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  }
};

// 系统状态 API
export const systemApi = {
  getStatus(): Promise<SystemStatus> {
    return fetchApi<SystemStatus>('/system/status');
  },

  getHealth(): Promise<{ status: string; timestamp: number }> {
    return fetchApi<{ status: string; timestamp: number }>('/health');
  }
};

// 通知 API
export const notificationApi = {
  getAll(): Promise<Notification[]> {
    return fetchApi<Notification[]>('/notifications');
  },

  markAsRead(id: string): Promise<void> {
    return fetchApi<void>(`/notifications/${id}/read`, {
      method: 'POST'
    });
  },

  markAllAsRead(): Promise<void> {
    return fetchApi<void>('/notifications/read-all', {
      method: 'POST'
    });
  }
};

export { ApiError };
