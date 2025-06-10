import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { taskService } from '../services'

function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await taskService.getAll()
      setTasks(result)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.trim()) return
    
    try {
      const task = {
        title: newTask.trim(),
        completed: false,
        priority: 'medium',
        categoryId: null,
        dueDate: null,
        order: tasks.length
      }
      
      const createdTask = await taskService.create(task)
      setTasks(prev => [...prev, createdTask])
      setNewTask('')
      toast.success('Task added successfully!')
    } catch (err) {
      toast.error('Failed to add task')
    }
  }

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : null
      })
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      
      if (!task.completed) {
        toast.success('Task completed! 🎉')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-subtle">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 shadow-subtle text-center"
      >
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadTasks}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-subtle"
      >
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <motion.button
            onClick={addTask}
            disabled={!newTask.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </motion.button>
        </div>
      </motion.div>

      {/* Task List */}
      {tasks.length === 0 ? (
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
          <p className="mt-2 text-gray-500">Add your first task to get started</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: task.completed ? 0.7 : 1, 
                  x: 0,
                  scale: task.completed ? 0.98 : 1
                }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg shadow-subtle p-4 hover:shadow-card transition-all duration-200 ${
                  task.completed ? 'completion-burst' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => toggleTask(task.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed 
                        ? 'bg-success border-success text-white' 
                        : 'border-gray-300 hover:border-primary'
                    } checkbox-bounce`}
                  >
                    {task.completed && (
                      <ApperIcon name="Check" className="w-4 h-4" />
                    )}
                  </motion.button>
                  
                  <span className={`flex-1 ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </span>
                  
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-error' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-warning' :
                    'bg-green-100 text-success'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default MainFeature