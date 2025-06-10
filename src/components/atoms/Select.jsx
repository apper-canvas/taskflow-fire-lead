import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ children, className = '', value, onChange, ...rest }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
};

Select.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Select;