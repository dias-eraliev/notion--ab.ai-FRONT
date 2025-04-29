import React, { useState } from 'react';
import {
  FaVideo,
  FaUserShield,
  FaBell,
  FaExclamationTriangle,
  FaChartLine,
  FaMapMarkerAlt,
  FaLock,
  FaHistory,
  FaFileExport,
  FaPhoneVolume,
  FaUserClock,
  FaQrcode
} from 'react-icons/fa';

interface SecurityIncident {
  id: string;
  type: 'Тревожная кнопка' | 'Камера' | 'Датчик' | 'Охрана';
  location: string;
  timestamp: Date;
  status: 'Активный' | 'В обработке' | 'Закрыт';
  description: string;
  priority: 'Высокий' | 'Средний' | 'Низкий';
  assignedTo?: string;
  mediaUrls?: string[];
}

interface SecurityStats {
  activeAlerts: number;
  onlineCameras: number;
  securityStaff: number;
  incidentsToday: number;
}

const mockIncidents: SecurityIncident[] = [
  {
    id: 'INC-001',
    type: 'Тревожная кнопка',
    location: 'Кабинет 204',
    timestamp: new Date('2024-03-21T10:15:00'),
    status: 'Активный',
    description: 'Нажата тревожная кнопка учеником',
    priority: 'Высокий',
    assignedTo: 'Охранник Иванов А.П.'
  },
  {
    id: 'INC-002',
    type: 'Камера',
    location: 'Главный вход',
    timestamp: new Date('2024-03-21T09:30:00'),
    status: 'В обработке',
    description: 'Обнаружен посторонний человек',
    priority: 'Средний',
    assignedTo: 'Охранник Петров С.В.'
  }
];

const mockStats: SecurityStats = {
  activeAlerts: 2,
  onlineCameras: 24,
  securityStaff: 4,
  incidentsToday: 3
};

const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'incidents' | 'cameras' | 'staff'>('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);

  const getStatusColor = (status: SecurityIncident['status']) => {
    switch (status) {
      case 'Активный':
        return 'bg-red-100 text-red-800';
      case 'В обработке':
        return 'bg-yellow-100 text-yellow-800';
      case 'Закрыт':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: SecurityIncident['priority']) => {
    switch (priority) {
      case 'Высокий':
        return 'text-red-600';
      case 'Средний':
        return 'text-yellow-600';
      case 'Низкий':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Безопасность школы</h1>
        <div className="flex gap-4">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle /> Экстренный вызов
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
            <FaFileExport /> Экспорт отчета
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Активные тревоги</p>
              <p className="text-2xl font-bold text-red-500">{mockStats.activeAlerts}</p>
            </div>
            <FaBell className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Камеры онлайн</p>
              <p className="text-2xl font-bold text-green-500">{mockStats.onlineCameras}</p>
            </div>
            <FaVideo className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Охрана на смене</p>
              <p className="text-2xl font-bold text-blue-500">{mockStats.securityStaff}</p>
            </div>
            <FaUserShield className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Инцидентов за день</p>
              <p className="text-2xl font-bold text-yellow-500">{mockStats.incidentsToday}</p>
            </div>
            <FaHistory className="text-yellow-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 border-b">
          <button
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine /> Панель управления
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === 'incidents' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('incidents')}
          >
            <FaExclamationTriangle /> Инциденты
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === 'cameras' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('cameras')}
          >
            <FaVideo /> Видеонаблюдение
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === 'staff' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('staff')}
          >
            <FaUserShield /> Охрана
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xs">
        {activeTab === 'dashboard' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Активные тревоги</h3>
                <div className="space-y-4">
                  {mockIncidents
                    .filter((incident) => incident.status === 'Активный')
                    .map((incident) => (
                      <div
                        key={incident.id}
                        className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedIncident(incident)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{incident.type}</p>
                            <p className="text-sm text-gray-500">
                              <FaMapMarkerAlt className="inline mr-1" />
                              {incident.location}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                    <FaPhoneVolume className="text-2xl text-blue-500" />
                    <span>Вызов охраны</span>
                  </button>
                  <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                    <FaLock className="text-2xl text-blue-500" />
                    <span>Блокировка дверей</span>
                  </button>
                  <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                    <FaUserClock className="text-2xl text-blue-500" />
                    <span>Учет рабочего времени</span>
                  </button>
                  <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
                    <FaQrcode className="text-2xl text-blue-500" />
                    <span>Проверка пропусков</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Тип</th>
                  <th className="text-left py-2">Локация</th>
                  <th className="text-left py-2">Статус</th>
                  <th className="text-left py-2">Приоритет</th>
                  <th className="text-left py-2">Время</th>
                  <th className="text-left py-2">Назначен</th>
                </tr>
              </thead>
              <tbody>
                {mockIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <td className="py-2">{incident.id}</td>
                    <td className="py-2">{incident.type}</td>
                    <td className="py-2">{incident.location}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={getPriorityColor(incident.priority)}>{incident.priority}</span>
                    </td>
                    <td className="py-2">{incident.timestamp.toLocaleTimeString()}</td>
                    <td className="py-2">{incident.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cameras' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Камера 1 - Главный вход</p>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Камера 2 - Коридор 1 этаж</p>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Камера 3 - Столовая</p>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Камера 4 - Спортзал</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUserShield className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Иванов А.П.</p>
                    <p className="text-sm text-gray-500">Старший охранник</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Статус:</span>{' '}
                    <span className="text-green-500">На смене</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Локация:</span> Главный пост
                  </p>
                </div>
              </div>
              {/* Добавьте больше карточек охранников */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPage; 