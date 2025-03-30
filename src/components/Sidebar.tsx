import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaTasks, 
  FaRegCalendar,
  FaCog,
  FaSearch
} from 'react-icons/fa';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to }) => (
  <Link 
    to={to}
    className="flex items-center px-4 py-2 text-gray-700 hover:bg-notion-gray-light rounded-lg transition-colors duration-200"
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  return (
    <div className="w-sidebar h-screen bg-white border-r border-notion-gray fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 mr-2" />
          <h1 className="text-xl font-semibold">LMS Platform</h1>
        </div>

        <div className="mb-4">
          <div className="flex items-center px-4 py-2 bg-notion-gray-light rounded-lg">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Поиск..."
              className="bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<FaHome />} text="Главная" to="/" />
          <SidebarItem icon={<FaBook />} text="Курсы" to="/courses" />
          <SidebarItem icon={<FaTasks />} text="Задания" to="/tasks" />
          <SidebarItem icon={<FaRegCalendar />} text="Календарь" to="/calendar" />
        </nav>

        <div className="mt-auto pt-4 border-t border-notion-gray mt-8">
          <SidebarItem icon={<FaCog />} text="Настройки" to="/settings" />
        </div>
      </div>
    </div>
  );
}; 