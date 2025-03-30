import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Calendar: React.FC = () => {
  const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState(currentDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth - 1; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = getDaysInMonth(selectedDate);

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {selectedDate.toLocaleString('ru', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevMonth}
            className="p-2 text-corporate-primary hover:bg-corporate-primary/10 rounded-lg"
          >
            <FaChevronLeft size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextMonth}
            className="p-2 text-corporate-primary hover:bg-corporate-primary/10 rounded-lg"
          >
            <FaChevronRight size={16} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-sm
              ${day === null ? 'invisible' : ''}
              ${
                day === currentDate.getDate() &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear()
                  ? 'bg-corporate-primary text-white'
                  : 'hover:bg-corporate-primary/10 text-gray-700'
              }
            `}
          >
            {day}
          </motion.div>
        ))}
      </div>

      {/* События дня */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">События на сегодня</h3>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center p-2 rounded-lg hover:bg-corporate-primary/5">
            <div className="w-2 h-2 rounded-full bg-corporate-primary mr-2" />
            <span className="text-sm text-gray-600">09:00 - Собрание учителей</span>
          </div>
          <div className="flex items-center p-2 rounded-lg hover:bg-corporate-primary/5">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <span className="text-sm text-gray-600">14:00 - Открытый урок</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar; 