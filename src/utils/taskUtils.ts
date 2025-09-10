import type { Task } from '../store/taskSlice';
import { 
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  MinusIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

export const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'critical':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 ring-red-600/20 dark:ring-red-500/30';
    case 'high':
      return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 ring-orange-600/20 dark:ring-orange-500/30';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 ring-yellow-600/20 dark:ring-yellow-500/30';
    case 'low':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-blue-600/20 dark:ring-blue-500/30';
    default:
      return 'text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-900/20 ring-surface-600/20 dark:ring-surface-500/30';
  }
};

export const getPriorityIcon = (priority: Task['priority']) => {
  switch (priority) {
    case 'critical':
      return ExclamationTriangleIcon;
    case 'high':
      return ExclamationCircleIcon;
    case 'medium':
      return MinusIcon;
    case 'low':
      return ArrowDownIcon;
    default:
      return MinusIcon;
  }
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'done') return false;
  return new Date(task.dueDate) < new Date();
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

export const getDueDateStatus = (task: Task): 'overdue' | 'due-soon' | 'upcoming' | 'none' => {
  if (!task.dueDate || task.status === 'done') return 'none';
  
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 1) return 'due-soon';
  return 'upcoming';
};

export const sortTasks = (tasks: Task[], sortBy: string, direction: 'asc' | 'desc'): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'dueDate': {
        const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = aDue - bDue;
        break;
      }
      case 'priority': {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      }
      case 'created':
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
      case 'updated':
        comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'desc' ? comparison : -comparison;
  });
};

export const exportTasksToCSV = (tasks: Task[]): void => {
  const headers = ['Title', 'Description', 'Status', 'Priority', 'Category', 'Due Date', 'Tags', 'Created At', 'Completed At'];
  const csvContent = [
    headers.join(','),
    ...tasks.map(task => [
      `"${task.title.replace(/"/g, '""')}"`,
      `"${task.description.replace(/"/g, '""')}"`,
      task.status,
      task.priority,
      task.category || '',
      task.dueDate || '',
      task.tags.join(';'),
      new Date(task.createdAt).toLocaleDateString(),
      task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '',
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportTasksToJSON = (tasks: Task[]): void => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks-export-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const getTaskTemplates = (): Partial<Task>[] => [
  {
    title: 'Plan Team Meeting',
    description: 'Organize agenda and schedule team meeting',
    priority: 'medium',
    category: 'Meetings',
    tags: ['team', 'planning'],
  },
  {
    title: 'Code Review',
    description: 'Review pull requests and provide feedback',
    priority: 'high',
    category: 'Development',
    tags: ['code', 'review'],
  },
  {
    title: 'Update Documentation',
    description: 'Update project documentation and README',
    priority: 'low',
    category: 'Documentation',
    tags: ['docs', 'maintenance'],
  },
  {
    title: 'Bug Fix',
    description: 'Investigate and fix reported bug',
    priority: 'high',
    category: 'Development',
    tags: ['bug', 'fix'],
  },
  {
    title: 'Research Task',
    description: 'Research new technologies and tools',
    priority: 'medium',
    category: 'Research',
    tags: ['research', 'learning'],
  },
];
