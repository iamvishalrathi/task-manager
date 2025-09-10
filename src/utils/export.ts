import type { Task } from '../store/taskSlice';

export const exportTasksToCSV = (tasks: Task[]): void => {
  const headers = ['Title', 'Description', 'Status', 'Created At', 'Updated At'];
  const csvContent = [
    headers.join(','),
    ...tasks.map(task => [
      `"${task.title.replace(/"/g, '""')}"`,
      `"${task.description.replace(/"/g, '""')}"`,
      task.status,
      new Date(task.createdAt).toLocaleDateString(),
      new Date(task.updatedAt).toLocaleDateString(),
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

export const getTasksAnalytics = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  // Calculate average completion time (mock calculation)
  const completedTasks = tasks.filter(t => t.status === 'done');
  const avgCompletionTime = completedTasks.length > 0 
    ? completedTasks.reduce((acc, task) => {
        const created = new Date(task.createdAt);
        const updated = new Date(task.updatedAt);
        return acc + (updated.getTime() - created.getTime());
      }, 0) / completedTasks.length
    : 0;

  return {
    total,
    completed,
    inProgress,
    todo,
    completionRate: Math.round(completionRate),
    avgCompletionTimeHours: Math.round(avgCompletionTime / (1000 * 60 * 60)),
  };
};
