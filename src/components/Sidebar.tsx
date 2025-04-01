import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome,
  FaBook,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaCog,
  FaSearch,
  FaHeart,
  FaUserGraduate,
  FaChartLine,
  FaCalendarAlt,
  FaBuilding,
  FaGraduationCap,
  FaChevronDown,
  FaSmile,
  FaMoneyBillWave,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaBookOpen,
  FaThLarge,
  FaComments,
  FaRobot,
  FaCalendar,
  FaEnvelope,
  FaListUl,
  FaFolder,
  FaUser,
  FaLock,
  FaPlug,
  FaPalette,
  FaCogs,
  FaWarehouse,
  FaBarcode,
  FaShoppingCart,
  FaShieldAlt
} from 'react-icons/fa';
import { SidebarLink } from './SidebarLink';

export const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({
    study: false,
    students: false,
    hr: false,
    finance: false,
    analytics: false,
    settings: false,
    erp: false
  });

  const [isAppOpen, setIsAppOpen] = useState(false);

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">AB.AI</span>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center px-4 py-2.5 bg-gray-50 rounded-xl">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Поиск..."
              className="bg-transparent w-full text-sm focus:outline-none text-gray-600"
            />
          </div>
        </div>

        <nav className="space-y-2">
          {/* Главная */}
          <SidebarLink to="/" icon={<FaHome />} label="Главная" />
          
          {/* Приложение с выпадающим списком */}
          <div className="sidebar-item">
            <button 
              onClick={() => setIsAppOpen(!isAppOpen)}
              className="sidebar-button flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              <FaThLarge className="mr-3" />
              <span>Приложение</span>
              <FaChevronDown className={`ml-auto transform ${isAppOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAppOpen && (
              <div className="pl-4">
                <SidebarLink to="/app/chat" icon={<FaComments />} label="Чат" />
                <SidebarLink to="/app/ai-chat" icon={<FaRobot />} label="AI чат" />
                <SidebarLink to="/app/calendar" icon={<FaCalendar />} label="Календарь" />
                <SidebarLink to="/app/email" icon={<FaEnvelope />} label="Эл. почта" />
                <SidebarLink to="/app/tasks" icon={<FaListUl />} label="Список дел" />
                <SidebarLink to="/app/files" icon={<FaFolder />} label="Файловый менеджер" />
              </div>
            )}
          </div>
          
          {/* Учебный процесс */}
          <div className="group">
            <div 
              className={`flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-150 ${expandedItems.study ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => toggleExpand('study')}
            >
              <div className="flex items-center">
                <FaBook className="w-5 h-5 mr-3" />
                <span className="font-medium">Учебный процесс</span>
              </div>
              <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedItems.study ? 'transform rotate-180' : ''}`} />
            </div>
            
            {expandedItems.study && (
              <div className="mt-2 ml-4 space-y-1">
                <Link 
                  to="/academic/academic-journal"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaBook className="w-4 h-4 mr-3" />
                  <span>Учебный журнал</span>
                </Link>
                
                <Link 
                  to="/academic/schedule"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaCalendarAlt className="w-4 h-4 mr-3" />
                  <span>Расписание</span>
                </Link>

                <Link 
                  to="/academic/homework"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaBookOpen className="w-4 h-4 mr-3" />
                  <span>Домашние задания</span>
                </Link>

                <Link 
                  to="/academic/classrooms"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaBuilding className="w-4 h-4 mr-3" />
                  <span>Аудитории и секции</span>
                </Link>

                <Link 
                  to="/study-plans"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaBook className="w-4 h-4 mr-3" />
                  <span>Учебные планы</span>
                </Link>
              </div>
            )}
          </div>

          {/* Студенты */}
          <div className="group">
            <div 
              className={`flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-150 ${expandedItems.students ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => toggleExpand('students')}
            >
              <div className="flex items-center">
                <FaUsers className="w-5 h-5 mr-3" />
                <span className="font-medium">Студенты</span>
              </div>
              <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedItems.students ? 'transform rotate-180' : ''}`} />
            </div>
            
            {expandedItems.students && (
              <div className="mt-2 ml-4 space-y-1">
                <Link 
                  to="/students"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaUserGraduate className="w-4 h-4 mr-3" />
                  <span>Списки учащихся</span>
                </Link>
                
                <Link 
                  to="/performance"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaChartLine className="w-4 h-4 mr-3" />
                  <span>Успеваемость</span>
                </Link>

                <Link 
                  to="/students/emotional-analysis"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <FaSmile className="w-4 h-4 mr-3" />
                  <span>Эмоциональный анализ</span>
                </Link>
              </div>
            )}
          </div>

          {/* HR (Персонал) */}
          <div className="group">
            <div 
              className={`flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-150 ${expandedItems.hr ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => toggleExpand('hr')}
            >
              <div className="flex items-center">
                <FaUserTie className="w-5 h-5 mr-3" />
                <span className="font-medium">HR (Персонал)</span>
              </div>
              <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedItems.hr ? 'transform rotate-180' : ''}`} />
            </div>
            
            {expandedItems.hr && (
              <div className="mt-2 ml-4 space-y-1">
                <Link 
                  to="/hr/employees"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <span>Сотрудники и преподаватели</span>
                </Link>
                
                <Link 
                  to="/hr/workload"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <span>Нагрузки и расписание ставок</span>
                </Link>

                <Link 
                  to="/hr/kpi"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <span>KPI и эффективность</span>
                </Link>

                <Link 
                  to="/hr/vacation"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <span>Отпуска и замены</span>
                </Link>
                
                <Link 
                  to="/hr/fake-positions"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                >
                  <span>Контроль фиктивных ставок (AI)</span>
                </Link>
              </div>
            )}
          </div>

          {/* Финансы */}
          <div className="group">
            <div 
              className={`flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-150 ${expandedItems.finance ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => toggleExpand('finance')}
            >
              <div className="flex items-center">
                <FaMoneyBillWave className="w-5 h-5 mr-3" />
                <span className="font-medium">Финансы</span>
              </div>
              <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedItems.finance ? 'transform rotate-180' : ''}`} />
            </div>
            
            {expandedItems.finance && (
              <div className="mt-2 ml-4 space-y-1">
                <SidebarLink 
                  to="/finance/payments" 
                  icon={<FaMoneyBillWave />}
                  label="Оплаты и задолженности"
                />
                <SidebarLink 
                  to="/finance/reports" 
                  icon={<FaFileAlt />}
                  label="Финансовые отчеты"
                />
                <SidebarLink 
                  to="/finance/budget" 
                  icon={<FaChartBar />}
                  label="Бюджет и прогноз"
                />
                <SidebarLink 
                  to="/finance/payroll" 
                  icon={<FaUserTie />}
                  label="Управление зарплатой"
                />
              </div>
            )}
          </div>

          {/* ERP секция */}
          <div className="mb-4">
            <button
              onClick={() => toggleExpand('erp')}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
            >
              <div className="flex items-center">
                <FaWarehouse className="w-4 h-4 mr-3" />
                <span>ERP система</span>
              </div>
              <FaChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expandedItems.erp ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedItems.erp && (
              <div className="pl-4 space-y-2">
                <SidebarLink
                  to="/app/erp/inventory"
                  icon={<FaBarcode />}
                  label="Digital инвентаризация"
                />
                <SidebarLink
                  to="/app/erp/supply"
                  icon={<FaShoppingCart />}
                  label="Запросы на снабжение"
                />
                <SidebarLink
                  to="/app/erp/security"
                  icon={<FaShieldAlt />}
                  label="Безопасность"
                />
              </div>
            )}
          </div>

          {/* Настройки */}
          <div className="group">
            <div 
              className={`flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-150 ${expandedItems.settings ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => toggleExpand('settings')}
            >
              <div className="flex items-center">
                <FaCog className="w-5 h-5 mr-3" />
                <span className="font-medium">Настройки</span>
              </div>
              <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedItems.settings ? 'transform rotate-180' : ''}`} />
            </div>
            
            {expandedItems.settings && (
              <div className="mt-2 ml-4 space-y-1">
                <SidebarLink 
                  to="/settings/users" 
                  icon={<FaUsers />}
                  label="Пользователи"
                />
                <SidebarLink 
                  to="/settings/permissions" 
                  icon={<FaLock />}
                  label="Права доступа"
                />
                <SidebarLink 
                  to="/settings/integrations" 
                  icon={<FaPlug />}
                  label="Интеграции"
                />
                <SidebarLink 
                  to="/settings/branding" 
                  icon={<FaPalette />}
                  label="Брендинг"
                />
                <SidebarLink 
                  to="/settings/system" 
                  icon={<FaCogs />}
                  label="Система"
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 