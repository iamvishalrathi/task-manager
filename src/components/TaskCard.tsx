import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PencilIcon, 
  TrashIcon, 
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import type { Task } from '../store/taskSlice';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatRelativeTime, cn } from '../utils';
import { getPriorityColor, getPriorityIcon } from '../utils/taskUtils';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

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
      className="h-full"
    >
      <Card hover className="relative group h-full flex flex-col p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2 line-clamp-1">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge(task.status)}
              {task.priority !== 'low' && getPriorityBadge(task.priority)}
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
        
        <div className="flex-1 mb-4">
          {task.description && (
            <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
          {task.dueDate && (
            <div className="text-xs text-surface-500 dark:text-surface-400 mb-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-surface-200 dark:border-surface-700">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            disabled={isUpdating}
            className="text-xs font-medium rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-800 dark:text-surface-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          
          <div className="text-xs text-surface-500 dark:text-surface-400">
            {formatRelativeTime(task.updatedAt)}
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
