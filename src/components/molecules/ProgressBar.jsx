import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProgressBar = ({ completed, total, percentage }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-500">{completed}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-accent h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">{percentage}% complete</p>
    </div>
  );
};

ProgressBar.propTypes = {
  completed: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
};

export default ProgressBar;