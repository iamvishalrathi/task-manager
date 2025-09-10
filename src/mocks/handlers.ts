import { http, HttpResponse } from 'msw';
import type { Task } from '../store/taskSlice';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project setup',
    description: 'Set up the initial project structure and dependencies',
    status: 'done',
    priority: 'high',
    category: 'Development',
    tags: ['setup', 'initial'],
    dueDate: '2024-01-20T00:00:00.000Z',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    completedAt: '2024-01-16T14:30:00.000Z',
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Add login and logout functionality with JWT',
    status: 'in-progress',
    priority: 'critical',
    category: 'Security',
    tags: ['auth', 'jwt', 'security'],
    dueDate: '2024-02-01T00:00:00.000Z',
    createdAt: '2024-01-16T09:00:00.000Z',
    updatedAt: '2024-01-16T09:00:00.000Z',
  },
  {
    id: '3',
    title: 'Design task dashboard',
    description: 'Create a responsive dashboard for managing tasks',
    status: 'todo',
    priority: 'medium',
    category: 'UI/UX',
    tags: ['dashboard', 'responsive', 'design'],
    dueDate: '2024-01-25T00:00:00.000Z',
    createdAt: '2024-01-17T08:00:00.000Z',
    updatedAt: '2024-01-17T08:00:00.000Z',
  },
  {
    id: '4',
    title: 'Write unit tests',
    description: 'Add comprehensive unit tests for all components',
    status: 'todo',
    priority: 'low',
    category: 'Testing',
    tags: ['testing', 'unit-tests', 'quality'],
    dueDate: '2024-02-15T00:00:00.000Z',
    createdAt: '2024-01-18T11:00:00.000Z',
    updatedAt: '2024-01-18T11:00:00.000Z',
  },
  {
    id: '5',
    title: 'Optimize performance',
    description: 'Analyze and optimize application performance',
    status: 'todo',
    priority: 'high',
    category: 'Performance',
    tags: ['optimization', 'performance', 'analysis'],
    createdAt: '2024-01-19T13:00:00.000Z',
    updatedAt: '2024-01-19T13:00:00.000Z',
  },
];

export const handlers = [
  // Login endpoint
  http.post('/api/login', async ({ request }) => {
    const { username, password } = await request.json() as { username: string; password: string };
    
    // Mock authentication logic
    if (username === 'test' && password === 'test123') {
      const token = 'mock-jwt-token-' + Date.now();
      const user = {
        id: '1',
        username: 'test',
        email: 'test@example.com',
      };
      
      return HttpResponse.json({
        success: true,
        user,
        token,
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Get tasks
  http.get('/api/tasks', () => {
    return HttpResponse.json({
      success: true,
      tasks: mockTasks,
    });
  }),

  // Create task
  http.post('/api/tasks', async ({ request }) => {
    const { title, description, status, priority, category, tags, dueDate } = await request.json() as {
      title: string;
      description: string;
      status: 'todo' | 'in-progress' | 'done';
      priority?: 'low' | 'medium' | 'high' | 'critical';
      category?: string;
      tags?: string[];
      dueDate?: string;
    };
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      category: category || 'General',
      tags: tags || [],
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockTasks.push(newTask);
    
    return HttpResponse.json({
      success: true,
      task: newTask,
    });
  }),

  // Update task
  http.put('/api/tasks/:id', async ({ request, params }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Task>;
    
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }
    
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return HttpResponse.json({
      success: true,
      task: mockTasks[taskIndex],
    });
  }),

  // Delete task
  http.delete('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const taskIndex = mockTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }
    
    mockTasks.splice(taskIndex, 1);
    
    return HttpResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  }),

  // Health check endpoint (optional, for testing)
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }),
];
