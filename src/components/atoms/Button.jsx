import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Button = ({ children, className = '', onClick, disabled, whileHover, whileTap, ...rest }) => {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
};

export default Button;