import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaDownload,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
  FaFileExport,
  FaChartBar
} from 'react-icons/fa';
import ClassroomModal from '../components/ClassroomModal';

// Типы данных
type RoomType = 'lecture' | 'computer' | 'laboratory' | 'conference' | 'cabinet';
type RoomStatus = 'free' | 'occupied' | 'maintenance';

interface Equipment {
  name: string;
  quantity?: number;
  status: boolean;
}

interface ResponsiblePerson {
  name: string;
  role: string;
  lastCheck?: string;
}

interface ClassroomDocument {
  type: string;
  name: string;
  url: string;
}

interface Classroom {
  id: string;
  number: string;
  name: string;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  equipment: Equipment[];
  responsiblePersons: ResponsiblePerson[];
  lastUpdate: string;
  schedule?: {
    day: string;
    timeStart: string;
    timeEnd: string;
    status: string;
  }[];
  documents: ClassroomDocument[];
}

// Временные данные для примера
const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: '1',
    number: '301',
    name: 'Лекционный зал',
    type: 'lecture',
    capacity: 120,
    status: 'free',
    equipment: [
      { name: 'Проектор', status: true },
      { name: 'Микрофон', status: true }
    ],
    responsiblePersons: [
      { name: 'Сатенов Е.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-29',
    documents: [
      { type: 'act', name: 'Акт приёма-передачи', url: '/docs/act-301.pdf' }
    ]
  },
  {
    id: '2',
    number: '405',
    name: 'IT-класс',
    type: 'computer',
    capacity: 25,
    status: 'occupied',
    equipment: [
      { name: 'ПК', quantity: 25, status: true },
      { name: 'AR-доска', status: true },
      { name: 'Проектор', status: true }
    ],
    responsiblePersons: [
      { name: 'Иванова Лариса', role: 'Основной' },
      { name: 'Асылхан Т.', role: 'Техник' }
    ],
    lastUpdate: '2025-03-27',
    documents: [
      { type: 'act', name: 'Акт приёма-передачи', url: '/docs/act-405.pdf' },
      { type: 'manual', name: 'Инструкция по ТБ', url: '/docs/manual-405.pdf' }
    ]
  },
  {
    id: '3',
    number: '201',
    name: 'Химическая лаборатория',
    type: 'laboratory',
    capacity: 30,
    status: 'free',
    equipment: [
      { name: 'Вытяжной шкаф', status: true },
      { name: 'Лабораторные столы', quantity: 15, status: true },
      { name: 'Микроскопы', quantity: 10, status: true }
    ],
    responsiblePersons: [
      { name: 'Петров В.А.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-28',
    documents: [
      { type: 'safety', name: 'Инструкция по безопасности', url: '/docs/safety-201.pdf' }
    ]
  },
  {
    id: '4',
    number: '302',
    name: 'Конференц-зал',
    type: 'conference',
    capacity: 80,
    status: 'occupied',
    equipment: [
      { name: 'Проектор 4K', status: true },
      { name: 'Звуковая система', status: true },
      { name: 'Микрофоны', quantity: 4, status: true }
    ],
    responsiblePersons: [
      { name: 'Ахметов Р.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-26',
    documents: []
  },
  {
    id: '5',
    number: '401',
    name: 'Кабинет физики',
    type: 'laboratory',
    capacity: 35,
    status: 'maintenance',
    equipment: [
      { name: 'Демонстрационный стол', status: true },
      { name: 'Физические приборы', status: false },
      { name: 'Интерактивная доска', status: true }
    ],
    responsiblePersons: [
      { name: 'Смирнова Н.П.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-25',
    documents: []
  },
  {
    id: '6',
    number: '202',
    name: 'Лингафонный кабинет',
    type: 'computer',
    capacity: 20,
    status: 'free',
    equipment: [
      { name: 'Аудио система', status: true },
      { name: 'Компьютеры', quantity: 20, status: true },
      { name: 'Наушники', quantity: 20, status: true }
    ],
    responsiblePersons: [
      { name: 'Кузнецова М.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-24',
    documents: []
  },
  {
    id: '7',
    number: '303',
    name: 'Малый конференц-зал',
    type: 'conference',
    capacity: 40,
    status: 'free',
    equipment: [
      { name: 'ТВ панель', status: true },
      { name: 'Система конференц-связи', status: true }
    ],
    responsiblePersons: [
      { name: 'Попов К.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-23',
    documents: []
  },
  {
    id: '8',
    number: '404',
    name: 'Компьютерный класс',
    type: 'computer',
    capacity: 30,
    status: 'occupied',
    equipment: [
      { name: 'ПК', quantity: 30, status: true },
      { name: 'Проектор', status: true },
      { name: '3D-принтер', status: true }
    ],
    responsiblePersons: [
      { name: 'Морозов Д.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-22',
    documents: []
  },
  {
    id: '9',
    number: '203',
    name: 'Биологическая лаборатория',
    type: 'laboratory',
    capacity: 25,
    status: 'free',
    equipment: [
      { name: 'Микроскопы', quantity: 15, status: true },
      { name: 'Холодильник', status: true }
    ],
    responsiblePersons: [
      { name: 'Соколова Е.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-21',
    documents: []
  },
  {
    id: '10',
    number: '304',
    name: 'Лекционная аудитория',
    type: 'lecture',
    capacity: 90,
    status: 'free',
    equipment: [
      { name: 'Проектор', status: true },
      { name: 'Экран', status: true }
    ],
    responsiblePersons: [
      { name: 'Волков И.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-20',
    documents: []
  },
  {
    id: '11',
    number: '402',
    name: 'Мультимедийный класс',
    type: 'computer',
    capacity: 25,
    status: 'free',
    equipment: [
      { name: 'Графические планшеты', quantity: 25, status: true },
      { name: 'ПК', quantity: 25, status: true }
    ],
    responsiblePersons: [
      { name: 'Козлов А.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-19',
    documents: []
  },
  {
    id: '12',
    number: '204',
    name: 'Кабинет робототехники',
    type: 'laboratory',
    capacity: 20,
    status: 'occupied',
    equipment: [
      { name: 'Наборы робототехники', quantity: 10, status: true },
      { name: 'ПК', quantity: 10, status: true }
    ],
    responsiblePersons: [
      { name: 'Новиков П.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-18',
    documents: []
  },
  {
    id: '13',
    number: '305',
    name: 'Лекционный зал',
    type: 'lecture',
    capacity: 150,
    status: 'free',
    equipment: [
      { name: 'Проектор', status: true },
      { name: 'Звуковая система', status: true }
    ],
    responsiblePersons: [
      { name: 'Федоров М.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-17',
    documents: []
  },
  {
    id: '14',
    number: '403',
    name: 'VR-лаборатория',
    type: 'laboratory',
    capacity: 15,
    status: 'maintenance',
    equipment: [
      { name: 'VR-шлемы', quantity: 15, status: false },
      { name: 'ПК', quantity: 15, status: true }
    ],
    responsiblePersons: [
      { name: 'Григорьев С.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-16',
    documents: []
  },
  {
    id: '15',
    number: '205',
    name: 'Кабинет искусств',
    type: 'cabinet',
    capacity: 30,
    status: 'free',
    equipment: [
      { name: 'Мольберты', quantity: 15, status: true },
      { name: 'Проектор', status: true }
    ],
    responsiblePersons: [
      { name: 'Андреева К.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-15',
    documents: []
  },
  {
    id: '16',
    number: '306',
    name: 'Математический кабинет',
    type: 'cabinet',
    capacity: 35,
    status: 'occupied',
    equipment: [
      { name: 'Интерактивная доска', status: true },
      { name: 'Проектор', status: true }
    ],
    responsiblePersons: [
      { name: 'Борисов Н.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-14',
    documents: []
  },
  {
    id: '17',
    number: '406',
    name: 'Серверная',
    type: 'computer',
    capacity: 10,
    status: 'maintenance',
    equipment: [
      { name: 'Серверные стойки', quantity: 5, status: true },
      { name: 'Система охлаждения', status: false }
    ],
    responsiblePersons: [
      { name: 'Романов В.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-13',
    documents: []
  },
  {
    id: '18',
    number: '206',
    name: 'Лаборатория электроники',
    type: 'laboratory',
    capacity: 20,
    status: 'free',
    equipment: [
      { name: 'Паяльные станции', quantity: 10, status: true },
      { name: 'Осциллографы', quantity: 5, status: true }
    ],
    responsiblePersons: [
      { name: 'Макаров Д.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-12',
    documents: []
  },
  {
    id: '19',
    number: '307',
    name: 'Медиатека',
    type: 'computer',
    capacity: 40,
    status: 'free',
    equipment: [
      { name: 'ПК', quantity: 20, status: true },
      { name: 'Планшеты', quantity: 20, status: true },
      { name: 'Проектор', status: true }
    ],
    responsiblePersons: [
      { name: 'Степанова О.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-11',
    documents: []
  },
  {
    id: '20',
    number: '407',
    name: 'Конференц-зал премиум',
    type: 'conference',
    capacity: 100,
    status: 'free',
    equipment: [
      { name: 'Видеостена', status: true },
      { name: 'Система звукоусиления', status: true },
      { name: 'Система видеоконференций', status: true }
    ],
    responsiblePersons: [
      { name: 'Захаров И.', role: 'Основной' }
    ],
    lastUpdate: '2025-03-10',
    documents: []
  }
];

const ClassroomsPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    equipment: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция фильтрации аудиторий
  const filteredClassrooms = classrooms.filter(room => {
    const matchesType = !filters.type || room.type === filters.type;
    const matchesStatus = !filters.status || room.status === filters.status;
    const matchesEquipment = !filters.equipment || 
      room.equipment.some(eq => eq.name.toLowerCase().includes(filters.equipment.toLowerCase()));
    
    return matchesType && matchesStatus && matchesEquipment;
  });

  const handleRowClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Аудитории</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <FaPlus className="mr-2" />
            Добавить аудиторию
          </button>
          <button
            onClick={() => {/* Добавить логику экспорта */}}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
          >
            <FaFileExport className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Панель фильтров */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Тип помещения</option>
              <option value="lecture">Лекционный</option>
              <option value="computer">Компьютерный</option>
              <option value="laboratory">Лаборатория</option>
              <option value="conference">Конференц-зал</option>
              <option value="cabinet">Кабинет</option>
            </select>
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Статус</option>
              <option value="free">Свободна</option>
              <option value="occupied">Занята</option>
              <option value="maintenance">В ремонте</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Поиск по оснащению..."
              value={filters.equipment}
              onChange={(e) => setFilters({ ...filters, equipment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={() => setFilters({ type: '', status: '', equipment: '' })}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {/* Таблица аудиторий */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вместимость</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оснащение</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ответственный</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Обновлено</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClassrooms.map((room) => (
              <tr
                key={room.id}
                onClick={() => handleRowClick(room)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.type === 'lecture' ? 'Лекционный' :
                   room.type === 'computer' ? 'Компьютерный' :
                   room.type === 'laboratory' ? 'Лаборатория' :
                   room.type === 'conference' ? 'Конференц-зал' : 'Кабинет'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.capacity} чел.</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    room.status === 'free' ? 'bg-green-100 text-green-800' :
                    room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.status === 'free' ? '🟢 Свободна' :
                     room.status === 'occupied' ? '🔴 Занята' : '🔧 В ремонте'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.equipment.map(eq => eq.name + (eq.quantity ? ` × ${eq.quantity}` : '')).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.responsiblePersons[0].name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      <AnimatePresence>
        {selectedClassroom && (
          <ClassroomModal
            isOpen={selectedClassroom !== null}
            classroom={selectedClassroom}
            onClose={() => setSelectedClassroom(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassroomsPage; 