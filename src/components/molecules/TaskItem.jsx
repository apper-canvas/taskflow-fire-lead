import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Input from '@/components/atoms/Input';
import PriorityDot from '@/components/atoms/PriorityDot';
import { format } from 'date-fns';

const TaskItem = ({
  task,
  category,
  dateInfo,
  isEditing,
  toggleTaskComplete,
  updateTask,
  deleteTask,
  setEditingTask,
  getPriorityColor,
}) => {
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
      className={`bg-white rounded-lg shadow-subtle p-4 hover:shadow-card transition-all duration-200 border-l-4 ${
        task.completed ? 'border-l-success' : `border-l-${task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}`
      } ${task.completed ? 'completion-burst' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={task.completed}
          onChange={() => toggleTaskComplete(task.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="text"
                defaultValue={task.title}
                onBlur={(e) => updateTask(task.id, { title: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateTask(task.id, { title: e.target.value });
                  }
                }}
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
                  <PriorityDot priority={task.priority} />

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

                  {dateInfo && (
                    <span className={`text-xs font-medium ${dateInfo.color}`}>
                      {dateInfo.text}
                    </span>
                  )}

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
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    priority: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
    categoryId: PropTypes.string,
    dueDate: PropTypes.string,
    createdAt: PropTypes.number,
    completedAt: PropTypes.number,
  }).isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
  }),
  dateInfo: PropTypes.shape({
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  isEditing: PropTypes.bool.isRequired,
  toggleTaskComplete: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  setEditingTask: PropTypes.func.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
};

export default TaskItem;