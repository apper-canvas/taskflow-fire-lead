import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { taskService, categoryService } from '../services'

function Home() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [filterView, setFilterView] = useState('all')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksResult)
      setCategories(categoriesResult)
      if (categoriesResult.length > 0 && !newTaskCategory) {
        setNewTaskCategory(categoriesResult[0].id)
      }
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) return
    
    try {
      const newTask = {
        title: newTaskTitle.trim(),
        completed: false,
        priority: newTaskPriority,
        categoryId: newTaskCategory || categories[0]?.id,
        dueDate: newTaskDueDate || null,
        order: tasks.length
      }
      
      const createdTask = await taskService.create(newTask)
      setTasks(prev => [...prev, createdTask])
      setNewTaskTitle('')
      setNewTaskDueDate('')
      toast.success('Task created successfully!')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const toggleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : null
      })
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      
      if (!task.completed) {
        toast.success('Task completed! 🎉', {
          className: 'completion-burst'
        })
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates)
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      setEditingTask(null)
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const addCategory = async (name, color = '#8B5CF6', icon = 'Folder') => {
    try {
      const newCategory = {
        name: name.trim(),
        color,
        icon,
        order: categories.length
      }
      
      const createdCategory = await categoryService.create(newCategory)
      setCategories(prev => [...prev, createdCategory])
      toast.success('Category created successfully!')
      return createdCategory
    } catch (err) {
      toast.error('Failed to create category')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-red-100'
      case 'medium': return 'text-warning bg-yellow-100'
      case 'low': return 'text-success bg-green-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error'
      case 'medium': return 'bg-warning'
      case 'low': return 'bg-success'
      default: return 'bg-gray-400'
    }
  }

  const getTaskDateInfo = (task) => {
    if (!task.dueDate) return null
    
    const date = parseISO(task.dueDate)
    if (isToday(date)) return { text: 'Today', color: 'text-info' }
    if (isTomorrow(date)) return { text: 'Tomorrow', color: 'text-warning' }
    if (isPast(date)) return { text: 'Overdue', color: 'text-error' }
    return { text: format(date, 'MMM d'), color: 'text-gray-500' }
  }

  const filteredTasks = tasks.filter(task => {
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
      return false
    }
    
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false
    }
    
    if (filterView === 'today' && task.dueDate) {
      return isToday(parseISO(task.dueDate))
    }
    
    if (filterView === 'upcoming' && task.dueDate) {
      const date = parseISO(task.dueDate)
      return !isPast(date) && !isToday(date)
    }
    
    if (filterView === 'overdue' && task.dueDate) {
      return isPast(parseISO(task.dueDate)) && !task.completed
    }
    
    if (filterView === 'completed') {
      return task.completed
    }
    
    if (filterView === 'active') {
      return !task.completed
    }
    
    return true
  })

  const getCompletionStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  }

  const stats = getCompletionStats()

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
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-heading font-bold text-primary">TaskFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your day</p>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="bg-white rounded-lg p-4 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{stats.completed}/{stats.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-accent h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.percentage}% complete</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4 mr-3" />
              All Tasks
              <span className="ml-auto text-xs">{tasks.length}</span>
            </button>
            
            {categories.map(category => {
              const categoryTasks = tasks.filter(t => t.categoryId === category.id)
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={category.icon} className="w-4 h-4 mr-3" />
                  {category.name}
                  <span className="ml-auto text-xs">{categoryTasks.length}</span>
                </button>
              )
            })}
          </div>

          {/* Quick filters */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
            <div className="space-y-1">
              {[
                { id: 'today', label: 'Today', icon: 'Calendar', count: tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate))).length },
                { id: 'upcoming', label: 'Upcoming', icon: 'Clock', count: tasks.filter(t => t.dueDate && !isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).length },
                { id: 'overdue', label: 'Overdue', icon: 'AlertCircle', count: tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && !t.completed).length },
                { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: tasks.filter(t => t.completed).length }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setFilterView(filter.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterView === filter.id 
                      ? 'bg-secondary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={filter.icon} className="w-4 h-4 mr-3" />
                  {filter.label}
                  <span className="ml-auto text-xs">{filter.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Tasks' : categories.find(c => c.id === selectedCategory)?.name || 'Tasks'}
              </h2>
              <p className="text-gray-500">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Priority filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              
              {/* Search */}
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {/* Quick Add Task */}
          <div className="bg-surface rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              />
              
              <motion.button
                onClick={addTask}
                disabled={!newTaskTitle.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>Add Task</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || filterView !== 'all' 
                  ? 'No tasks match your filters'
                  : 'No tasks yet'
                }
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || filterView !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first task to get started'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && selectedPriority === 'all' && filterView === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.querySelector('input[placeholder="Add a new task..."]')?.focus()}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create First Task
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredTasks.map((task, index) => {
                  const category = categories.find(c => c.id === task.categoryId)
                  const dateInfo = getTaskDateInfo(task)
                  const isEditing = editingTask === task.id
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: task.completed ? 0.7 : 1, 
                        y: 0,
                        scale: task.completed ? 0.98 : 1
                      }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-lg shadow-subtle p-4 hover:shadow-card transition-all duration-200 border-l-4 ${
                        task.completed ? 'border-l-success' : `border-l-${task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}`
                      } ${task.completed ? 'completion-burst' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Checkbox */}
                        <motion.button
                          onClick={() => toggleTaskComplete(task.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed 
                              ? 'bg-success border-success text-white' 
                              : 'border-gray-300 hover:border-primary'
                          } checkbox-bounce`}
                        >
                          {task.completed && (
                            <ApperIcon name="Check" className="w-3 h-3" />
                          )}
                        </motion.button>

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                defaultValue={task.title}
                                onBlur={(e) => updateTask(task.id, { title: e.target.value })}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    updateTask(task.id, { title: e.target.value })
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 
                                  className={`font-medium break-words ${
                                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                  }`}
                                  onClick={() => setEditingTask(task.id)}
                                >
                                  {task.title}
                                </h3>
                                
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  {/* Priority indicator */}
                                  <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)} priority-pulse`} />
                                  
                                  {/* Category */}
                                  {category && (
                                    <span 
                                      className="px-2 py-1 text-xs rounded-full font-medium"
                                      style={{ 
                                        backgroundColor: `${category.color}20`,
                                        color: category.color 
                                      }}
                                    >
                                      {category.name}
                                    </span>
                                  )}
                                  
                                  {/* Due date */}
                                  {dateInfo && (
                                    <span className={`text-xs font-medium ${dateInfo.color}`}>
                                      {dateInfo.text}
                                    </span>
                                  )}
                                  
                                  {/* Actions */}
                                  <button
                                    onClick={() => setEditingTask(task.id)}
                                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                                  >
                                    <ApperIcon name="Edit2" className="w-4 h-4" />
                                  </button>
                                  
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-1 text-gray-400 hover:text-error transition-colors"
                                  >
                                    <ApperIcon name="Trash2" className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex items-center text-xs text-gray-500 space-x-4">
                                <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                                
                                {task.createdAt && (
                                  <span>Created {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                                )}
                                
                                {task.completed && task.completedAt && (
                                  <span className="text-success">
                                    Completed {format(new Date(task.completedAt), 'MMM d, yyyy')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home