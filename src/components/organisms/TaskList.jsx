import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskItem from '@/components/molecules/TaskItem';
import Button from '@/components/atoms/Button';

const TaskList = ({
  filteredTasks,
  categories,
  editingTask,
  setEditingTask,
  toggleTaskComplete,
  updateTask,
  deleteTask,
  getTaskDateInfo,
  searchTerm,
  selectedCategory,
  selectedPriority,
  filterView,
  getPriorityColor,
}) => {
  return (
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
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('input[placeholder="Add a new task..."]')?.focus()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create First Task
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const category = categories.find(c => c.id === task.categoryId);
              const dateInfo = getTaskDateInfo(task);
              const isCurrentlyEditing = editingTask === task.id;

              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  category={category}
                  dateInfo={dateInfo}
                  isEditing={isCurrentlyEditing}
                  toggleTaskComplete={toggleTaskComplete}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  setEditingTask={setEditingTask}
                  getPriorityColor={getPriorityColor}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

TaskList.propTypes = {
  filteredTasks: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  editingTask: PropTypes.string, // can be null
  setEditingTask: PropTypes.func.isRequired,
  toggleTaskComplete: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  getTaskDateInfo: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  selectedPriority: PropTypes.string.isRequired,
  filterView: PropTypes.string.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
};

export default TaskList;