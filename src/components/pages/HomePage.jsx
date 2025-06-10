import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { taskService, categoryService } from '@/services';
import Sidebar from '@/components/organisms/Sidebar';
import PageHeader from '@/components/organisms/PageHeader';
import QuickAddTaskForm from '@/components/organisms/QuickAddTaskForm';
import TaskList from '@/components/organisms/TaskList';
import Button from '@/components/atoms/Button';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [filterView, setFilterView] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  // const [draggedTask, setDraggedTask] = useState(null); // Not used in original, keeping it out.

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksResult);
      setCategories(categoriesResult);
      if (categoriesResult.length > 0 && !newTaskCategory) {
        setNewTaskCategory(categoriesResult[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = {
        title: newTaskTitle.trim(),
        completed: false,
        priority: newTaskPriority,
        categoryId: newTaskCategory || categories[0]?.id,
        dueDate: newTaskDueDate || null,
        order: tasks.length
      };

      const createdTask = await taskService.create(newTask);
      setTasks(prev => [...prev, createdTask]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const toggleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : null
      });

      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

      if (!task.completed) {
        toast.success('Task completed! 🎉', {
          className: 'completion-burst'
        });
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const addCategory = async (name, color = '#8B5CF6', icon = 'Folder') => {
    try {
      const newCategory = {
        name: name.trim(),
        color,
        icon,
        order: categories.length
      };

      const createdCategory = await categoryService.create(newCategory);
      setCategories(prev => [...prev, createdCategory]);
      toast.success('Category created successfully!');
      return createdCategory;
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-red-100';
      case 'medium': return 'text-warning bg-yellow-100';
      case 'low': return 'text-success bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getTaskDateInfo = (task) => {
    if (!task.dueDate) return null;

    const date = parseISO(task.dueDate);
    if (isToday(date)) return { text: 'Today', color: 'text-info' };
    if (isTomorrow(date)) return { text: 'Tomorrow', color: 'text-warning' };
    if (isPast(date)) return { text: 'Overdue', color: 'text-error' };
    return { text: format(date, 'MMM d'), color: 'text-gray-500' };
  };

  const filteredTasks = tasks.filter(task => {
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
      return false;
    }

    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }

    if (filterView === 'today' && task.dueDate) {
      return isToday(parseISO(task.dueDate));
    }

    if (filterView === 'upcoming' && task.dueDate) {
      const date = parseISO(task.dueDate);
      return !isPast(date) && !isToday(date);
    }

    if (filterView === 'overdue' && task.dueDate) {
      return isPast(parseISO(task.dueDate)) && !task.completed;
    }

    if (filterView === 'completed') {
      return task.completed;
    }

    if (filterView === 'active') {
      return !task.completed;
    }

    return true;
  });

  const getCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  if (loading) {
    return (
      <div className="h-screen flex">
        <div className="w-64 bg-surface p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar
        tasks={tasks}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filterView={filterView}
        setFilterView={setFilterView}
        getCompletionStats={getCompletionStats}
        isToday={isToday}
        isPast={isPast}
        parseISO={parseISO}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          selectedCategory={selectedCategory}
          categories={categories}
          filteredTasksCount={filteredTasks.length}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <QuickAddTaskForm
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          newTaskCategory={newTaskCategory}
          setNewTaskCategory={setNewTaskCategory}
          newTaskPriority={newTaskPriority}
          setNewTaskPriority={setNewTaskPriority}
          newTaskDueDate={newTaskDueDate}
          setNewTaskDueDate={setNewTaskDueDate}
          addTask={addTask}
          categories={categories}
        />

        <TaskList
          filteredTasks={filteredTasks}
          categories={categories}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          toggleTaskComplete={toggleTaskComplete}
          updateTask={updateTask}
          deleteTask={deleteTask}
          getTaskDateInfo={getTaskDateInfo}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedPriority={selectedPriority}
          filterView={filterView}
          getPriorityColor={getPriorityColor}
        />
      </div>
    </div>
  );
};

export default HomePage;