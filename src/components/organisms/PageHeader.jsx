import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const PageHeader = ({
  selectedCategory,
  categories,
  filteredTasksCount,
  selectedPriority,
  setSelectedPriority,
  searchTerm,
  setSearchTerm,
}) => {
  const currentCategoryName = selectedCategory === 'all'
    ? 'All Tasks'
    : categories.find(c => c.id === selectedCategory)?.name || 'Tasks';

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">
            {currentCategoryName}
          </h2>
          <p className="text-gray-500">
            {filteredTasksCount} task{filteredTasksCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>

          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  filteredTasksCount: PropTypes.number.isRequired,
  selectedPriority: PropTypes.string.isRequired,
  setSelectedPriority: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default PageHeader;