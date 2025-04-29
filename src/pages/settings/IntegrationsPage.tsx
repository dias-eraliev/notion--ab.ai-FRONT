import React, { useState } from 'react';
import { FaPlug, FaCheck, FaTimes, FaCog, FaExternalLinkAlt } from 'react-icons/fa';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected';
  icon: string;
  lastSync?: string;
  apiKey?: string;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Google Календарь',
    description: 'Синхронизация расписания и событий',
    status: 'connected',
    icon: '🗓️',
    lastSync: '2024-03-21 12:30'
  },
  {
    id: '2',
    name: 'Microsoft Teams',
    description: 'Интеграция для онлайн-обучения',
    status: 'connected',
    icon: '👥',
    lastSync: '2024-03-21 11:45'
  },
  {
    id: '3',
    name: 'Электронный журнал',
    description: 'Импорт оценок и посещаемости',
    status: 'disconnected',
    icon: '📚'
  },
  {
    id: '4',
    name: 'Система контроля доступа',
    description: 'Интеграция с турникетами и картами доступа',
    status: 'connected',
    icon: '🔐',
    lastSync: '2024-03-21 12:00'
  }
];

const IntegrationsPage: React.FC = () => {
  const [integrations] = useState<Integration[]>(mockIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Интеграции</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlug /> Добавить интеграцию
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="bg-white rounded-lg shadow-xs p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedIntegration(integration)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                integration.status === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integration.status === 'connected' ? 'Подключено' : 'Отключено'}
              </span>
            </div>
            {integration.lastSync && (
              <p className="text-xs text-gray-500">
                Последняя синхронизация: {integration.lastSync}
              </p>
            )}
            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
              <button className="text-gray-500 hover:text-gray-600">
                <FaCog />
              </button>
              {integration.status === 'connected' ? (
                <button className="text-red-500 hover:text-red-600">
                  <FaTimes />
                </button>
              ) : (
                <button className="text-green-500 hover:text-green-600">
                  <FaCheck />
                </button>
              )}
              <button className="text-blue-500 hover:text-blue-600">
                <FaExternalLinkAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedIntegration.icon}</span>
                <h2 className="text-xl font-bold">{selectedIntegration.name}</h2>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-600"
                onClick={() => setSelectedIntegration(null)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Настройки подключения</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">API Key</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-xs"
                      value={selectedIntegration.apiKey || ''}
                      placeholder="Введите API ключ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Webhook URL</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-xs"
                      value="https://api.school.edu/webhooks/integration"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Параметры синхронизации</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Автоматическая синхронизация</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Уведомления об ошибках</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
                onClick={() => setSelectedIntegration(null)}
              >
                Отмена
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xs">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage; 