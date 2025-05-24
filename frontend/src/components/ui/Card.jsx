import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '' }) => {
  return (
    <motion.div 
      className={`rounded-xl bg-white shadow p-5 ${className}`}
      whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Card; 