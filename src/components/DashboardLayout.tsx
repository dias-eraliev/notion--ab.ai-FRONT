import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaUsers, 
  FaUserGraduate, 
  FaChalkboardTeacher,
  FaCalendar,
  FaBook,
  FaCog,
  FaSearch,
  FaBell,
  FaSun,
  FaMoon,
  FaGraduationCap,
  FaClipboardList,
  FaChartBar,
  FaMoneyBillWave
} from 'react-icons/fa';
import Calendar from './Calendar';
import AttendanceChart from './AttendanceChart';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isPositive }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-notion"
  >
    <div className="flex items-center justify-between">
      <div className="text-corporate-primary/60">{icon}</div>
      <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </div>
    </div>
    <div className="mt-2">
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </motion.div>
);

const DashboardLayout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const stats = [
    { icon: <FaUserGraduate size={24} />, title: 'Всего студентов', value: '3654', change: '+1.2%', isPositive: true },
    { icon: <FaChalkboardTeacher size={24} />, title: 'Всего преподавателей', value: '284', change: '+1.2%', isPositive: true },
    { icon: <FaUsers size={24} />, title: 'Всего сотрудников', value: '162', change: '+1.2%', isPositive: true },
    { icon: <FaBook size={24} />, title: 'Всего субъектов', value: '82', change: '+1.2%', isPositive: true },
  ];

  const menuItems = [
    { icon: <FaHome />, text: 'Главная', active: true },
    { icon: <FaUserGraduate />, text: 'Студенты' },
    { icon: <FaChalkboardTeacher />, text: 'Преподаватели' },
    { icon: <FaGraduationCap />, text: 'Классы' },
    { icon: <FaClipboardList />, text: 'Расписание' },
    { icon: <FaChartBar />, text: 'Отчеты' },
    { icon: <FaMoneyBillWave />, text: 'Финансы' },
    { icon: <FaCog />, text: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-corporate-bg">
      {/* Верхняя панель */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0">
                <img className="h-8 w-auto" src="/logo.svg" alt="AB.AI" />
              </div>
              <div className="ml-4 flex-1">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">Поиск</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary sm:text-sm transition-all duration-200"
                      placeholder="Поиск..."
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-gray-400 hover:text-corporate-primary rounded-lg"
              >
                {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-corporate-primary rounded-lg"
              >
                <FaBell size={20} />
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-8 w-8 rounded-full bg-corporate-primary text-white flex items-center justify-center cursor-pointer"
              >
                АБ
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="flex">
        {/* Боковое меню */}
        <div className="w-64 bg-white/80 backdrop-blur-sm h-[calc(100vh-4rem)] border-r border-gray-200 p-4 sticky top-16">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <motion.a
                key={index}
                whileHover={{ x: 4 }}
                href="#"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  item.active
                    ? 'text-corporate-primary bg-corporate-primary/10'
                    : 'text-gray-600 hover:bg-corporate-primary/5'
                }`}
              >
                <span className="mr-3 h-5 w-5">{item.icon}</span>
                {item.text}
              </motion.a>
            ))}
          </nav>
        </div>

        {/* Основной контент */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-gray-900"
              >
                Добро Пожаловать в AB.AI
              </motion.h1>
              <p className="text-sm text-gray-500">
                Учебный год: 2024 / 2025
              </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>

            {/* Дополнительные секции */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Календарь */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-notion"
              >
                <Calendar />
              </motion.div>

              {/* График посещаемости */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-notion"
              >
                <AttendanceChart />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 