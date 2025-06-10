import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ className = '', type = 'text', value, onChange, placeholder, onKeyPress, autoFocus, ...rest }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
      autoFocus={autoFocus}
      className={`px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...rest}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  onKeyPress: PropTypes.func,
  autoFocus: PropTypes.bool,
};

export default Input;