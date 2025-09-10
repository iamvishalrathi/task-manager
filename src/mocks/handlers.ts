import { http, HttpResponse } from 'msw';
import type { Task } from '../store/taskSlice';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project setup',
    description: 'Set up the initial project structure and dependencies',
    status: 'done',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Add login and logout functionality with JWT',
    status: 'in-progress',
    createdAt: '2024-01-16T09:00:00.000Z',
    updatedAt: '2024-01-16T09:00:00.000Z',
  },
  {
    id: '3',
    title: 'Design task dashboard',
    description: 'Create a responsive dashboard for managing tasks',
    status: 'todo',
    createdAt: '2024-01-17T08:00:00.000Z',
    updatedAt: '2024-01-17T08:00:00.000Z',
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
    const { title, description, status } = await request.json() as {
      title: string;
      description: string;
      status: 'todo' | 'in-progress' | 'done';
    };
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: status || 'todo',
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
];
