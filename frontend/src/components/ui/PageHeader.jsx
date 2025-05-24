import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, description }) => {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
    </motion.div>
  );
};

export default PageHeader; 