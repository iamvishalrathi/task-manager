import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTask,
  updateTask,
  deleteTask,
  clearTasks,
  type Task,
} from '../store/taskSlice';
import { tasksApi } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { getInitials } from '../utils';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadTasksOnMount = async () => {
      dispatch(fetchTasksStart());
      try {
        const response = await tasksApi.getTasks();
        if (response.success) {
          dispatch(fetchTasksSuccess(response.tasks));
        } else {
          dispatch(fetchTasksFailure('Failed to load tasks'));
        }
      } catch {
        dispatch(fetchTasksFailure('An error occurred while loading tasks'));
      }
    };
    
    loadTasksOnMount();
  }, [dispatch]);

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await tasksApi.createTask(taskData);
      if (response.success) {
        dispatch(addTask(response.task));
      }
    } catch {
      throw new Error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    try {
      const response = await tasksApi.updateTask(editingTask.id, taskData);
      if (response.success) {
        dispatch(updateTask(response.task));
      }
    } catch {
      throw new Error('Failed to update task');
    }
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await tasksApi.deleteTask(id);
      if (response.success) {
        dispatch(deleteTask(id));
      }
    } catch {
      throw new Error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      const response = await tasksApi.updateTask(id, { status });
      if (response.success) {
        dispatch(updateTask(response.task));
      }
    } catch {
      throw new Error('Failed to update task status');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTasks());
    toast.success('Logged out successfully');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      return handleUpdateTask(taskData);
    } else {
      return handleCreateTask(taskData);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    critical: tasks.filter(t => t.priority === 'critical').length,
    high: tasks.filter(t => t.priority === 'high').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
  };

  const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));
  const completionRate = taskCounts.all > 0 ? Math.round((taskCounts.done / taskCounts.all) * 100) : 0;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 min-w-0 flex-1"
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Squares2X2Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100 truncate">
                  Task Manager
                </h1>
                <p className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">
                  {completionRate}% completed • {taskCounts.all} total tasks
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 sm:hidden">
                  {completionRate}% done
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile-first user info */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    {getInitials(user?.username || 'User')}
                  </span>
                </div>
                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <ThemeToggle />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                leftIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                className="text-surface-600 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8"
        >
          <Card className="text-center p-2 sm:p-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Squares2X2Icon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">{taskCounts.all}</p>
            <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400">Total</h3>
          </Card>
          
          <Card className="text-center p-2 sm:p-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg flex items-center justify-center">
              <ExclamationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">{taskCounts.todo}</p>
            <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400">To Do</h3>
          </Card>
          
          <Card className="text-center p-2 sm:p-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">{taskCounts['in-progress']}</p>
            <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400">Progress</h3>
          </Card>
          
          <Card className="text-center p-2 sm:p-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">{taskCounts.done}</p>
            <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400">Done</h3>
          </Card>
        </motion.div>



        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 mb-6 sm:mb-8"
        >
          {/* Top row: Search and Add button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                className="h-10 sm:h-11"
              />
            </div>
            
            <Button
              onClick={() => setIsFormOpen(true)}
              leftIcon={<PlusIcon className="h-4 w-4" />}
              className="w-full sm:w-auto whitespace-nowrap"
              size="md"
            >
              Add Task
            </Button>
          </div>

          {/* Second row: Filters and View Mode */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <div className="flex items-center space-x-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 px-2 py-1.5 flex-shrink-0">
                <FunnelIcon className="h-3 w-3 text-surface-500 dark:text-surface-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none text-xs sm:text-sm focus:outline-none focus:ring-0 text-surface-900 dark:text-surface-100 cursor-pointer min-w-0"
                >
                  <option value="all" className="bg-white dark:bg-surface-800">All</option>
                  <option value="todo" className="bg-white dark:bg-surface-800">To Do</option>
                  <option value="in-progress" className="bg-white dark:bg-surface-800">Progress</option>
                  <option value="done" className="bg-white dark:bg-surface-800">Done</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 px-2 py-1.5 flex-shrink-0">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-transparent border-none text-xs sm:text-sm focus:outline-none focus:ring-0 text-surface-900 dark:text-surface-100 cursor-pointer min-w-0"
                >
                  <option value="all" className="bg-white dark:bg-surface-800">Priority</option>
                  <option value="critical" className="bg-white dark:bg-surface-800">Critical</option>
                  <option value="high" className="bg-white dark:bg-surface-800">High</option>
                  <option value="medium" className="bg-white dark:bg-surface-800">Medium</option>
                  <option value="low" className="bg-white dark:bg-surface-800">Low</option>
                </select>
              </div>

              {categories.length > 0 && (
                <div className="flex items-center space-x-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 px-2 py-1.5 flex-shrink-0">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-transparent border-none text-xs sm:text-sm focus:outline-none focus:ring-0 text-surface-900 dark:text-surface-100 cursor-pointer min-w-0"
                  >
                    <option value="all" className="bg-white dark:bg-surface-800">Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-white dark:bg-surface-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* View Mode Toggle - Hidden on mobile */}
            <div className="hidden sm:flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700 w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-none px-3 py-1.5 rounded-md transition-all duration-200 flex items-center justify-center gap-1 ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600 dark:text-primary-400' 
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
                title="Grid View"
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-none px-3 py-1.5 rounded-md transition-all duration-200 flex items-center justify-center gap-1 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600 dark:text-primary-400' 
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
                title="List View"
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Tags */}
        {(searchQuery || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-sm text-surface-500 dark:text-surface-400">Filters:</span>
            {searchQuery && (
              <Badge variant="info">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-blue-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterStatus !== 'all' && (
              <Badge variant="default">
                Status: {filterStatus}
                <button
                  onClick={() => setFilterStatus('all')}
                  className="ml-1 hover:text-surface-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterPriority !== 'all' && (
              <Badge variant="warning">
                Priority: {filterPriority}
                <button
                  onClick={() => setFilterPriority('all')}
                  className="ml-1 hover:text-yellow-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterCategory !== 'all' && (
              <Badge variant="info">
                Category: {filterCategory}
                <button
                  onClick={() => setFilterCategory('all')}
                  className="ml-1 hover:text-blue-700"
                >
                  ×
                </button>
              </Badge>
            )}
          </motion.div>
        )}

        {/* Tasks */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Card className="max-w-md mx-auto">
                <div className="p-8">
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Card className="max-w-md mx-auto">
                <div className="p-8">
                  <Squares2X2Icon className="h-12 w-12 text-surface-400 dark:text-surface-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                    {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                  </h3>
                  <p className="text-surface-500 dark:text-surface-400 mb-4">
                    {tasks.length === 0 
                      ? 'Create your first task to get started with managing your work.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {tasks.length === 0 && (
                    <Button onClick={() => setIsFormOpen(true)}>
                      Create Your First Task
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-3 sm:gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}
            >
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={viewMode === 'list' ? 'w-full' : ''}
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Dashboard;
