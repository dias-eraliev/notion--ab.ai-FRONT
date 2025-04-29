import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaBook,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaCog,
  FaSearch,
  FaUserGraduate,
  FaChartLine,
  FaCalendarAlt,
  FaBuilding,
  FaChevronDown,
  FaSmile,
  FaMoneyBillWave,
  FaFileAlt,
  FaBookOpen,
  FaThLarge,
  FaComments,
  FaRobot,
  FaCalendar,
  FaEnvelope,
  FaListUl,
  FaFolder,
  FaLock,
  FaPlug,
  FaPalette,
  FaCogs,
  FaWarehouse,
  FaBarcode,
  FaShoppingCart,
  FaShieldAlt,
  FaBrain,
  FaClipboardList,
  FaUmbrellaBeach,
  FaUserSecret
} from 'react-icons/fa';
import { SidebarLink } from './SidebarLink';
import { AuthPayload, useAuth } from '../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    study: false,
    students: false,
    hr: false,
    finance: false,
    erp: false,
    settings: false
  });

  const [isAppOpen, setIsAppOpen] = useState(false);
  const { payload } = useAuth();
  const userRole = payload?.role || 'STUDENT';

  // Объект со всеми ссылками и секциями
  const sidebarLinks: {
    [key: string]: {
      roles: AuthPayload["role"][];
      links: {
        to: string;
        icon: React.ReactNode;
        label: string;
        type: string;
        roles: AuthPayload["role"][];
      }[];
    };
  } = {
    main: {
      roles: ['ADMIN', "PARENT", "STUDENT", "TEACHER"], // Только ADMIN видит главную панель
      links: [
        {
          to: '/',
          icon: <FaHome />,
          label: 'Главная',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: "/",
          icon: <FaHome />,
          label: "Главная",
          type: "SidebarLink",
          roles: ["PARENT"]
        },
        {
          to: "/",
          icon: <FaHome />,
          label: "Главная",
          type: "SidebarLink",
          roles: ["STUDENT"]
        },
        {
          to: "/",
          icon: <FaHome />,
          label: "Главная",
          type: "SidebarLink",
          roles: ["TEACHER"]
        }
      ]
    },
    app: {
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      links: [
        {
          to: '/app/chat',
          icon: <FaComments />,
          label: 'Чат',
          type: 'SidebarLink',
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
        },
        {
          to: '/app/ai-chat',
          icon: <FaRobot />,
          label: 'AI чат',
          type: 'SidebarLink',
          roles: ['ADMIN', 'TEACHER', 'STUDENT'] // PARENT не видит AI-чат
        },
        {
          to: '/app/calendar',
          icon: <FaCalendar />,
          label: 'Календарь',
          type: 'SidebarLink',
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
        },
        {
          to: '/app/tasks',
          icon: <FaListUl />,
          label: 'Список дел',
          type: 'SidebarLink',
          roles: ['ADMIN', 'TEACHER', 'STUDENT'] // PARENT не видит
        },
        {
          to: "/app/neuro-abai",
          icon: <FaBrain />,
          label: 'UIB College Ai',
          type: 'SidebarLink',
          roles: ['ADMIN', 'TEACHER', 'STUDENT'] // PARENT не видит
        }
      ]
    },
    study: {
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      links: [
        {
          to: '/academic/journal',
          icon: <FaBook className="w-4 h-4 mr-3" />,
          label: 'Учебный журнал',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER', "STUDENT"] // ADMIN и TEACHER
        },
        {
          to: '/academic/schedule',
          icon: <FaCalendarAlt className="w-4 h-4 mr-3" />,
          label: 'Расписание',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER', 'STUDENT'] // PARENT не видит
        },
        {
          to: '/academic/homework',
          icon: <FaBookOpen className="w-4 h-4 mr-3" />,
          label: 'Домашние задания',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
        },
        {
          to: '/academic/classrooms',
          icon: <FaBuilding className="w-4 h-4 mr-3" />,
          label: 'Аудитории и секции',
          type: 'Link',
          roles: ['ADMIN', "TEACHER"] // Только ADMIN
        },
        {
          to: '/study-plans',
          icon: <FaBook className="w-4 h-4 mr-3" />,
          label: 'Учебные планы',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER', 'STUDENT'] // PARENT не видит
        }
      ]
    },
    students: {
      roles: ['ADMIN', 'TEACHER'],
      links: [
        {
          to: '/students',
          icon: <FaUserGraduate className="w-4 h-4 mr-3" />,
          label: 'Списки учащихся',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER']
        },
        {
          to: '/performance',
          icon: <FaChartLine className="w-4 h-4 mr-3" />,
          label: 'Успеваемость',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER']
        },
        {
          to: '/students/emotional-analysis',
          icon: <FaSmile className="w-4 h-4 mr-3" />,
          label: 'Эмоциональный анализ',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER']
        }
      ]
    },
    hr: {
      roles: ['ADMIN', 'TEACHER'],
      links: [
        {
          to: '/hr/employees',
          icon: <FaUserTie className="w-4 h-4 mr-3" />,
          label: 'Сотрудники и преподаватели',
          type: 'Link',
          roles: ['ADMIN']
        },
        {
          to: '/hr/workload',
          icon: <FaClipboardList className="w-4 h-4 mr-3" />,
          label: 'Нагрузки и расписание ставок',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER']
        },
        {
          to: '/hr/kpi',
          icon: <FaChartLine className="w-4 h-4 mr-3" />,
          label: 'KPI и эффективность',
          type: 'Link',
          roles: ['ADMIN', 'TEACHER']
        },
        {
          to: '/hr/vacation',
          icon: <FaUmbrellaBeach className="w-4 h-4 mr-3" />,
          label: 'Отпуска и замены',
          type: 'Link',
          roles: ['ADMIN']
        },
        {
          to: '/hr/fake-positions',
          icon: <FaUserSecret className="w-4 h-4 mr-3" />,
          label: 'Контроль фиктивных ставок (AI)',
          type: 'Link',
          roles: ['ADMIN']
        }
      ]
    },
    finance: {
      roles: ['ADMIN', 'PARENT'],
      links: [
        {
          to: '/finance/payments',
          icon: <FaMoneyBillWave />,
          label: 'Оплаты и задолженности',
          type: 'SidebarLink',
          roles: ['ADMIN', 'PARENT']
        },
        {
          to: '/finance/reports',
          icon: <FaFileAlt />,
          label: 'Финансовые отчеты',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/finance/budget',
          icon: <FaChartBar />,
          label: 'Бюджет и прогноз',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/finance/payroll',
          icon: <FaUserTie />,
          label: 'Управление зарплатой',
          type: 'SidebarLink',
          roles: ['ADMIN']
        }
      ]
    },
    erp: {
      roles: ['ADMIN'],
      links: [
        {
          to: '/app/erp/inventory',
          icon: <FaBarcode />,
          label: 'Digital инвентаризация',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/app/erp/supply',
          icon: <FaShoppingCart />,
          label: 'Запросы на снабжение',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/app/erp/security',
          icon: <FaShieldAlt />,
          label: 'Безопасность',
          type: 'SidebarLink',
          roles: ['ADMIN']
        }
      ]
    },
    settings: {
      roles: ['ADMIN'],
      links: [
        {
          to: '/settings/users',
          icon: <FaUsers />,
          label: 'Пользователи',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/settings/permissions',
          icon: <FaLock />,
          label: 'Права доступа',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/settings/integrations',
          icon: <FaPlug />,
          label: 'Интеграции',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/settings/branding',
          icon: <FaPalette />,
          label: 'Брендинг',
          type: 'SidebarLink',
          roles: ['ADMIN']
        },
        {
          to: '/settings/system',
          icon: <FaCogs />,
          label: 'Система',
          type: 'SidebarLink',
          roles: ['ADMIN']
        }
      ]
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Фильтрация секций и ссылок по ролям
  const filterSection = (section: any) => section.roles.includes(userRole);
  const filterLinks = (links: any[]) => links.filter(link => link.roles.includes(userRole));

  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-linear-to-r from-[#1C7E66] to-white bg-clip-text text-transparent">UIB College Ai</span>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center px-4 py-2.5 bg-gray-50 rounded-xl">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Поиск..."
              className="bg-transparent w-full text-sm focus:outline-hidden text-gray-600"
            />
          </div>
        </div>

        <nav className="space-y-2">
          {/* Главная */}
          {filterSection(sidebarLinks.main) && filterLinks(sidebarLinks.main.links).map(link => (
            <SidebarLink key={link.to} to={link.to} icon={link.icon} label={link.label} />
          ))}

          {/* Приложение с выпадающим списком */}
          {filterSection(sidebarLinks.app) && (
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
                  {filterLinks(sidebarLinks.app.links).map(link => (
                    <SidebarLink key={link.to} to={link.to} icon={link.icon} label={link.label} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Учебный процесс */}
          {filterSection(sidebarLinks.study) && (
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
                  {filterLinks(sidebarLinks.study.links).map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Студенты */}
          {filterSection(sidebarLinks.students) && (
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
                  {filterLinks(sidebarLinks.students.links).map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HR (Персонал) */}
          {filterSection(sidebarLinks.hr) && (
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
                  {filterLinks(sidebarLinks.hr.links).map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Финансы */}
          {filterSection(sidebarLinks.finance) && (
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
                  {filterLinks(sidebarLinks.finance.links).map(link => (
                    <SidebarLink
                      key={link.to}
                      to={link.to}
                      icon={link.icon}
                      label={link.label}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ERP секция */}
          {filterSection(sidebarLinks.erp) && (
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
                  className={`w-4 h-4 transition-transform duration-200 ${expandedItems.erp ? 'transform rotate-180' : ''}`}
                />
              </button>

              {expandedItems.erp && (
                <div className="pl-4 space-y-2">
                  {filterLinks(sidebarLinks.erp.links).map(link => (
                    <SidebarLink
                      key={link.to}
                      to={link.to}
                      icon={link.icon}
                      label={link.label}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Настройки */}
          {filterSection(sidebarLinks.settings) && (
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
                  {filterLinks(sidebarLinks.settings.links).map(link => (
                    <SidebarLink
                      key={link.to}
                      to={link.to}
                      icon={link.icon}
                      label={link.label}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;