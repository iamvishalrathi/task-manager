import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PencilIcon, 
  TrashIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import type { Task } from '../store/taskSlice';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatRelativeTime, truncateText, cn } from '../utils';
import { getPriorityColor, getPriorityIcon, isOverdue } from '../utils/taskUtils';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-surface-400 dark:text-surface-500" />;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <Badge variant="success">Done</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge variant="default">To Do</Badge>;
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const Icon = getPriorityIcon(priority);
    return (
      <Badge className={`${getPriorityColor(priority)} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (newStatus === task.status) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(task.id, newStatus);
      toast.success('Task status updated');
    } catch {
      toast.error('Failed to update task status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
        toast.success('Task deleted successfully');
      } catch {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEdit = () => {
    onEdit(task);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card hover className="relative group h-full flex flex-col">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex-shrink-0 mt-1"
            >
              {getStatusIcon(task.status)}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-surface-900 dark:text-surface-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                {task.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
                {task.category && (
                  <Badge variant="info" className="flex items-center gap-1 text-xs">
                    <TagIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">{task.category}</span>
                    <span className="sm:hidden">{task.category.slice(0, 3)}</span>
                  </Badge>
                )}
                {task.dueDate && (
                  <Badge 
                    variant={isOverdue(task.dueDate) && task.status !== 'done' ? 'error' : 'default'} 
                    className="flex items-center gap-1 text-xs"
                  >
                    <CalendarIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">{new Date(task.dueDate).toLocaleDateString()}</span>
                    <span className="sm:hidden">{new Date(task.dueDate).getDate()}/{new Date(task.dueDate).getMonth() + 1}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Menu as="div" className="relative flex-shrink-0">
            <Menu.Button className="p-1.5 sm:p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-md">
              <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-surface-100 dark:divide-surface-700 rounded-md bg-white dark:bg-surface-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleEdit}
                        className={cn(
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          active ? 'bg-primary-500 text-white' : 'text-surface-900 dark:text-surface-100'
                        )}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit Task
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDelete}
                        className={cn(
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          active ? 'bg-red-500 text-white' : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete Task
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        
        <div className="flex-1 mb-3 sm:mb-4">
          <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
            {truncateText(task.description, window.innerWidth < 640 ? 80 : 120)}
          </p>
          {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.slice(0, window.innerWidth < 640 ? 2 : 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded-md dark:bg-primary-900/20 dark:text-primary-300"
                >
                  #{tag}
                </span>
              ))}
              {task.tags.length > (window.innerWidth < 640 ? 2 : 4) && (
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-xs font-medium bg-surface-100 text-surface-600 rounded-md dark:bg-surface-700 dark:text-surface-400">
                  +{task.tags.length - (window.innerWidth < 640 ? 2 : 4)}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t border-surface-200 dark:border-surface-700">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            disabled={isUpdating}
            className={cn(
              'text-xs font-medium rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all px-2 py-1 w-full sm:w-auto',
              'bg-white dark:bg-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-600',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          
          <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2 text-xs text-surface-500 dark:text-surface-400">
            <ClockIcon className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{formatRelativeTime(task.updatedAt)}</span>
          </div>
        </div>

        {isUpdating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm flex items-center justify-center rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">Updating...</span>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default TaskCard;
