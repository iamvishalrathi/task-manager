import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      title={task ? 'Edit Task' : 'Create New Task'}
      description={task ? 'Update your task details below.' : 'Fill in the details to create a new task.'}
      size="md"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-4">
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

          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 placeholder-surface-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-400 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              placeholder="Provide additional details about the task (optional)"
              maxLength={500}
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
            <div className="flex justify-between text-xs text-surface-500 dark:text-surface-400">
              <span>Optional</span>
              <span>{formData.description.length}/500</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Status
              </label>
              <div className="flex items-center space-x-3">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-primary-400 dark:focus:ring-primary-400"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <div className="hidden sm:block">
                  {getStatusBadge(formData.status)}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Priority
              </label>
              <div className="flex items-center space-x-3">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-primary-400 dark:focus:ring-primary-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <div className="hidden sm:block">
                  {getPriorityBadge(formData.priority)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Development, Design"
            />

            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add a tag"
                className="flex-1 rounded-lg border border-surface-300 bg-white px-3 py-2 text-surface-900 placeholder-surface-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-400 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              />
              <Button type="button" onClick={handleTagAdd} variant="outline" size="sm" className="whitespace-nowrap">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="inline-flex items-center"
                  >
                    <Badge
                      variant="info"
                      className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    >
                      {tag} ×
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
          <Button
            type="submit"
            className="flex-1 order-2 sm:order-1"
            loading={isSubmitting}
            disabled={!formData.title.trim()}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 order-1 sm:order-2"
          >
            Cancel
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
};

export default TaskForm;
