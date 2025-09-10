import type { Task } from '../store/taskSlice';

const API_BASE = '/api';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  token?: string;
  message?: string;
}

interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

interface TaskResponse {
  success: boolean;
  task: Task;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return response.json();
  },
};

export const tasksApi = {
  getTasks: async (): Promise<TasksResponse> => {
    const response = await fetch(`${API_BASE}/tasks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    return response.json();
  },

  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskResponse> => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(task),
    });
    
    return response.json();
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<TaskResponse> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updates),
    });
    
    return response.json();
  },

  deleteTask: async (id: string): Promise<DeleteResponse> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    return response.json();
  },
};
