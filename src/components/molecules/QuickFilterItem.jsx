import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickFilterItem = ({ filter, selected, onClick }) => {
  return (
    <Button
      onClick={() => onClick(filter.id)}
      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
        selected ? 'bg-secondary text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <ApperIcon name={filter.icon} className="w-4 h-4 mr-3" />
      {filter.label}
      <span className="ml-auto text-xs">{filter.count}</span>
    </Button>
  );
};

QuickFilterItem.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default QuickFilterItem;