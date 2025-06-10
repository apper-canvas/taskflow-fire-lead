import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickAddTaskForm = ({
  newTaskTitle,
  setNewTaskTitle,
  newTaskCategory,
  setNewTaskCategory,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  addTask,
  categories,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-lg p-4"
    >
      <div className="flex items-center space-x-3">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          autoFocus
          className="flex-1"
        />

        <Select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>

        <Select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Input
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />

        <Button
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>
    </motion.div>
  );
};

QuickAddTaskForm.propTypes = {
  newTaskTitle: PropTypes.string.isRequired,
  setNewTaskTitle: PropTypes.func.isRequired,
  newTaskCategory: PropTypes.string.isRequired,
  setNewTaskCategory: PropTypes.func.isRequired,
  newTaskPriority: PropTypes.string.isRequired,
  setNewTaskPriority: PropTypes.func.isRequired,
  newTaskDueDate: PropTypes.string.isRequired,
  setNewTaskDueDate: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default QuickAddTaskForm;