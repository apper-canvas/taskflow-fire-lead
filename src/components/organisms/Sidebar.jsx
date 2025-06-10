import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/molecules/ProgressBar';
import CategoryFilterItem from '@/components/molecules/CategoryFilterItem';
import QuickFilterItem from '@/components/molecules/QuickFilterItem';

const Sidebar = ({
  tasks,
  categories,
  selectedCategory,
  setSelectedCategory,
  filterView,
  setFilterView,
  getCompletionStats,
  isToday,
  isPast,
  parseISO,
}) => {
  const stats = getCompletionStats();

  const quickFilters = [
    { id: 'today', label: 'Today', icon: 'Calendar', count: tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate))).length },
    { id: 'upcoming', label: 'Upcoming', icon: 'Clock', count: tasks.filter(t => t.dueDate && !isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).length },
    { id: 'overdue', label: 'Overdue', icon: 'AlertCircle', count: tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && !t.completed).length },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: tasks.filter(t => t.completed).length }
  ];

  return (
    <div className="w-64 bg-surface border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-heading font-bold text-primary">TaskFlow</h1>
        <p className="text-sm text-gray-500 mt-1">Organize your day</p>
      </div>

      <div className="p-6 border-b border-gray-200">
        <ProgressBar completed={stats.completed} total={stats.total} percentage={stats.percentage} />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-1">
          <CategoryFilterItem
            category={{ id: 'all', name: 'All Tasks', icon: 'List' }}
            selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            count={tasks.length}
          />
          {categories.map(category => {
            const categoryTasks = tasks.filter(t => t.categoryId === category.id);
            return (
              <CategoryFilterItem
                key={category.id}
                category={category}
                selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                count={categoryTasks.length}
              />
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
          <div className="space-y-1">
            {quickFilters.map(filter => (
              <QuickFilterItem
                key={filter.id}
                filter={filter}
                selected={filterView === filter.id}
                onClick={() => setFilterView(filter.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  tasks: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  filterView: PropTypes.string.isRequired,
  setFilterView: PropTypes.func.isRequired,
  getCompletionStats: PropTypes.func.isRequired,
  isToday: PropTypes.func.isRequired,
  isPast: PropTypes.func.isRequired,
  parseISO: PropTypes.func.isRequired,
};

export default Sidebar;