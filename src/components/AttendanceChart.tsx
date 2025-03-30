import React from 'react';
import { motion } from 'framer-motion';

const AttendanceChart: React.FC = () => {
  const data = [
    { day: 'ПН', value: 95 },
    { day: 'ВТ', value: 88 },
    { day: 'СР', value: 92 },
    { day: 'ЧТ', value: 85 },
    { day: 'ПТ', value: 90 },
    { day: 'СБ', value: 78 },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Посещаемость</h3>
          <p className="text-sm text-gray-500">За последнюю неделю</p>
        </div>
        <div className="text-2xl font-bold text-corporate-primary">
          88%
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center">
              <span className="w-8 text-sm text-gray-600">{item.day}</span>
              <div className="flex-1 ml-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-2 bg-corporate-primary/20 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-corporate-primary rounded-full"
                  />
                </motion.div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-xs text-gray-500">100%</span>
                </div>
              </div>
              <span className="ml-4 text-sm font-medium text-gray-700">
                {item.value}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-corporate-primary rounded-full mr-2" />
            <span className="text-gray-600">Присутствовали</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-corporate-primary/20 rounded-full mr-2" />
            <span className="text-gray-600">Отсутствовали</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart; 