import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  PencilIcon,
  CalendarIcon,
  TagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import type { Task } from '../store/taskSlice';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { getPriorityColor, getPriorityIcon } from '../utils/taskUtils';
import toast from 'react-hot-toast';

interface TaskFormProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    category: '',
    tags: [] as string[],
    dueDate: '',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category || '',
        tags: task.tags,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        category: '',
        tags: [],
        dueDate: '',
      });
    }
    setErrors({});
    setTagInput('');
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        category: formData.category.trim() || 'General',
        tags: formData.tags,
        dueDate: formData.dueDate || undefined,
        completedAt: formData.status === 'done' && !task?.completedAt ? new Date().toISOString() : task?.completedAt,
      });
      
      toast.success(task ? 'Task updated successfully' : 'Task created successfully');
      onClose();
    } catch {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
    }
    setTagInput('');
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          {task ? (
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <PencilIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          ) : (
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <PlusIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {task ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {task ? 'Update your task details' : 'Add a new task to stay organized'}
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 -mx-6 -mt-6 mb-6 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <SparklesIcon className="h-4 w-4" />
          <span>Fill in the details below to {task ? 'update' : 'create'} your task</span>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Basic Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <CheckCircleIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h4>
          </div>
          
          <div className="space-y-5">
            <Input
              label="Task Title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter a descriptive title for your task"
              maxLength={100}
            />

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 placeholder-surface-500 transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-400 dark:focus:border-primary-400 dark:focus:ring-primary-400 hover:border-surface-400 dark:hover:border-surface-500"
                  placeholder="Provide additional details about the task... What needs to be accomplished?"
                  maxLength={500}
                />
                <div className="absolute bottom-2 right-2 text-xs text-surface-400 dark:text-surface-500 bg-white dark:bg-surface-800 px-2 py-1 rounded">
                  {formData.description.length}/500
                </div>
              </div>
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Task Configuration Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <ClockIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Task Configuration</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Status
              </label>
              <div className="space-y-3">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-primary-400 dark:focus:ring-primary-400 hover:border-surface-400 dark:hover:border-surface-500"
                >
                  <option value="todo">📋 To Do</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
                <div className="flex justify-center">
                  {getStatusBadge(formData.status)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Priority
              </label>
              <div className="space-y-3">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-primary-400 dark:focus:ring-primary-400 hover:border-surface-400 dark:hover:border-surface-500"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🟠 High Priority</option>
                  <option value="critical">🔴 Critical Priority</option>
                </select>
                <div className="flex justify-center">
                  {getPriorityBadge(formData.priority)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                <FolderIcon className="h-4 w-4" />
                Category
              </label>
              <Input
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Development, Design, Marketing"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                <CalendarIcon className="h-4 w-4" />
                Due Date
              </label>
              <Input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <TagIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">(Optional)</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add tags to organize your task (e.g., urgent, review, client)"
                  className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 placeholder-surface-500 transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-400 dark:focus:border-primary-400 dark:focus:ring-primary-400 hover:border-surface-400 dark:hover:border-surface-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-surface-400 dark:text-surface-500">
                  Press Enter
                </div>
              </div>
              <Button 
                type="button" 
                onClick={handleTagAdd} 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap px-4 py-2.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                disabled={!tagInput.trim()}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            </div>
            {formData.tags.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current tags ({formData.tags.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="inline-flex items-center gap-1 group"
                      title={`Remove "${tag}" tag`}
                    >
                      <Badge
                        variant="info"
                        className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 group-hover:scale-105"
                      >
                        {tag}
                        <span className="ml-1 text-xs opacity-60 group-hover:opacity-100">×</span>
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No tags added yet. Tags help organize and categorize your tasks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 -mx-6 -mb-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              className="flex-1 order-2 sm:order-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              loading={isSubmitting}
              disabled={!formData.title.trim()}
            >
              <div className="flex items-center gap-2">
                {task ? (
                  <>
                    <PencilIcon className="h-4 w-4" />
                    Update Task
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Create Task
                  </>
                )}
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 order-1 sm:order-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.form>
    </Modal>
  );
};

export default TaskForm;
