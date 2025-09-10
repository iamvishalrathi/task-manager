import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  sortBy: 'dueDate' | 'priority' | 'created' | 'updated' | 'title';
  sortDirection: 'asc' | 'desc';
  categories: string[];
  analytics: {
    overdueTasks: number;
    completedToday: number;
    highPriorityTasks: number;
    averageCompletionTime: number;
  };
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  sortBy: 'created',
  sortDirection: 'desc',
  categories: [],
  analytics: {
    overdueTasks: 0,
    completedToday: 0,
    highPriorityTasks: 0,
    averageCompletionTime: 0,
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.loading = false;
      state.tasks = action.payload;
      state.error = null;
    },
    fetchTasksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      // Update categories if new category
      if (action.payload.category && !state.categories.includes(action.payload.category)) {
        state.categories.push(action.payload.category);
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        // Set completion time if status changed to done
        if (state.tasks[index].status !== 'done' && action.payload.status === 'done') {
          action.payload.completedAt = new Date().toISOString();
        }
        state.tasks[index] = action.payload;
        // Update categories if new category
        if (action.payload.category && !state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
    setSortBy: (state, action: PayloadAction<TaskState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<TaskState['sortDirection']>) => {
      state.sortDirection = action.payload;
    },
    updateAnalytics: (state) => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      state.analytics.overdueTasks = state.tasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
      ).length;
      
      state.analytics.completedToday = state.tasks.filter(task => 
        task.completedAt && new Date(task.completedAt) >= todayStart
      ).length;
      
      state.analytics.highPriorityTasks = state.tasks.filter(task => 
        task.priority === 'high' || task.priority === 'critical'
      ).length;
      
      // Calculate average completion time
      const completedTasks = state.tasks.filter(task => task.completedAt);
      if (completedTasks.length > 0) {
        const totalTime = completedTasks.reduce((sum, task) => {
          const created = new Date(task.createdAt).getTime();
          const completed = new Date(task.completedAt!).getTime();
          return sum + (completed - created);
        }, 0);
        state.analytics.averageCompletionTime = Math.round(totalTime / completedTasks.length / (1000 * 60 * 60 * 24)); // days
      }
    },
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTask,
  updateTask,
  deleteTask,
  clearTasks,
  setSortBy,
  setSortDirection,
  updateAnalytics,
} = taskSlice.actions;

export default taskSlice.reducer;
