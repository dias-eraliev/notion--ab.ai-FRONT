import React from 'react';
import { motion } from 'framer-motion';

const FloatingElement: React.FC<{ delay: number; duration: number; x: number; y: number }> = ({
  delay,
  duration,
  x,
  y
}) => {
  return (
    <motion.div
      className="absolute w-12 h-12 rounded-full bg-corporate-primary/5"
      initial={{ scale: 0, x: 0, y: 0 }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, x, 0],
        y: [0, y, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );
};

const AnimatedBackground: React.FC = () => {
  const elements = [
    { delay: 0, duration: 8, x: 100, y: -150 },
    { delay: 2, duration: 10, x: -150, y: 100 },
    { delay: 4, duration: 9, x: 200, y: 200 },
    { delay: 1, duration: 11, x: -100, y: -200 },
    { delay: 3, duration: 7, x: 150, y: -100 },
    { delay: 2.5, duration: 12, x: -200, y: 150 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {elements.map((props, index) => (
        <FloatingElement key={index} {...props} />
      ))}
      
      {/* Градиентный overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-corporate-bg/80 to-corporate-bg/40" />
    </div>
  );
};

export default AnimatedBackground; 