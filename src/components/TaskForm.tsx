import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../store/taskSlice';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
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
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
      });
    }
    setErrors({});
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
                className="block rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {getStatusBadge(formData.status)}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-surface-200 dark:border-surface-700">
          <Button
            type="submit"
            className="flex-1"
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
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
};

export default TaskForm;
