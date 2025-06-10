import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategoryFilterItem = ({ category, selected, onClick, count }) => {
  return (
    <Button
      onClick={() => onClick(category.id)}
      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
        selected ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <ApperIcon name={category.icon} className="w-4 h-4 mr-3" />
      {category.name}
      <span className="ml-auto text-xs">{count}</span>
    </Button>
  );
};

CategoryFilterItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default CategoryFilterItem;