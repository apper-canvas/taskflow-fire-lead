import React from 'react';
import PropTypes from 'prop-types';

const PriorityDot = ({ priority, className = '' }) => {
  let colorClass = 'bg-gray-400'; // Default
  switch (priority) {
    case 'high':
      colorClass = 'bg-error';
      break;
    case 'medium':
      colorClass = 'bg-warning';
      break;
    case 'low':
      colorClass = 'bg-success';
      break;
    default:
      break;
  }
  return (
    <div className={`w-2 h-2 rounded-full ${colorClass} priority-pulse ${className}`} />
  );
};

PriorityDot.propTypes = {
  priority: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
  className: PropTypes.string,
};

export default PriorityDot;