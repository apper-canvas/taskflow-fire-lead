import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onChange, className = '', whileHover, whileTap }) => {
  return (
    <motion.button
      onClick={onChange}
      whileHover={whileHover}
      whileTap={whileTap}
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all checkbox-bounce ${
        checked
          ? 'bg-success border-success text-white'
          : 'border-gray-300 hover:border-primary'
      } ${className}`}
    >
      {checked && (
        <ApperIcon name="Check" className="w-3 h-3" />
      )}
    </motion.button>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
};

export default Checkbox;