import React, { useState, useMemo } from 'react';
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
  FaChartBar,
  FaSpinner
} from 'react-icons/fa';
import ClassroomModal from '../components/ClassroomModal';
import CreateClassroomModal from '../components/CreateClassroomModal';
import { useClassrooms, ClassroomDto, ClassroomUIModel, mapApiClassroomToUI } from '../api/classrooms.api';
import { useAuth } from '../contexts/AuthContext';

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

// Map API data to UI model
const mapApiClassroomsToUi = (apiClassrooms: ClassroomDto[]): Classroom[] => {
  return apiClassrooms.map(classroom => ({
    id: classroom.id.toString(),
    number: classroom.id.toString(), // Using ID as number temporarily
    name: classroom.name,
    type: determineRoomType(classroom.type),
    capacity: classroom.capacity || 0,
    status: classroom.isFree ? 'free' : 'occupied',
    equipment: classroom.equipment?.map(eq => ({
      name: eq.name,
      quantity: eq.quantity,
      status: eq.isAvailable
    })) || [],
    responsiblePersons: classroom.responsibleStaff
      ? [{
        name: `${classroom.responsibleStaff.name} ${classroom.responsibleStaff.surname}`,
        role: 'Основной'
      }]
      : [],
    lastUpdate: formatDate(classroom.updatedAt),
    documents: classroom.documents?.map(doc => ({
      type: doc.type,
      name: doc.name,
      url: doc.url
    })) || [],
    schedule: classroom.schedule?.map(sch => ({
      day: sch.day,
      timeStart: sch.startTime,
      timeEnd: sch.endTime,
      status: sch.type
    }))
  }));
};

// Helper functions
const determineRoomType = (type?: string): RoomType => {
  if (!type) return 'cabinet';
  if (type.includes('lecture')) return 'lecture';
  if (type.includes('lab')) return 'laboratory';
  if (type.includes('computer')) return 'computer';
  if (type.includes('conference')) return 'conference';
  return 'cabinet';
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const ClassroomsPage: React.FC = () => {
  // State for UI
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomUIModel | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    equipment: '',
    search: ''
  });

  // Auth data
  const { payload } = useAuth();
  const isAdmin = payload?.role === 'ADMIN';
  const canEdit = isAdmin || payload?.role === 'TEACHER';

  // Fetch data
  const { classrooms, isLoading, isError, mutate } = useClassrooms();

  // Map API data to UI models
  const classroomsUI = useMemo(() => {
    if (!classrooms) return [];
    return classrooms.map(classroom => mapApiClassroomToUI(classroom));
  }, [classrooms]);

  // Filter classrooms based on filters
  const filteredClassrooms = useMemo(() => {
    return classroomsUI.filter(room => {
      // Type filter
      if (filters.type && room.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status && room.status !== filters.status) {
        return false;
      }

      // Equipment filter
      if (filters.equipment && !room.equipment.some(eq =>
        eq.name.toLowerCase().includes(filters.equipment.toLowerCase())
      )) {
        return false;
      }

      // Search filter - check name, number, or building
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          room.name.toLowerCase().includes(searchTerm) ||
          room.number.toLowerCase().includes(searchTerm) ||
          room.building.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [classroomsUI, filters]);

  // Handle row click
  const handleRowClick = (classroom: ClassroomUIModel) => {
    setSelectedClassroom(classroom);
  };

  // Handle export
  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'Название', 'Тип', 'Вместимость', 'Статус', 'Корпус', 'Этаж', 'Проектор', 'Компьютеры'];
    const rows = classroomsUI.map(room => [
      room.id,
      room.name,
      room.type === 'lecture' ? 'Лекционный' :
        room.type === 'laboratory' ? 'Лаборатория' : 'Семинар',
      room.capacity.toString(),
      room.status === 'free' ? 'Свободна' :
        room.status === 'occupied' ? 'Занята' : 'В ремонте',
      room.building,
      room.floor.toString(),
      room.hasProjector ? 'Да' : 'Нет',
      room.hasComputers ? 'Да' : 'Нет'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `classrooms_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      status: '',
      equipment: '',
      search: ''
    });
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="p-6 h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-500 mx-auto mb-4 text-3xl" />
          <p className="text-gray-600">Загрузка данных об аудиториях...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          <p className="font-medium">Ошибка при загрузке данных</p>
          <p className="text-sm mt-1">Пожалуйста, попробуйте обновить страницу или обратитесь к администратору</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Аудитории</h1>
        <div className="flex space-x-2">
          {canEdit && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaPlus className="mr-2" />
              Добавить аудиторию
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
          >
            <FaFileExport className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white p-4 rounded-lg shadow-xs mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск аудитории..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:w-2/3">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Тип помещения</option>
              <option value="lecture">Лекционный</option>
              <option value="laboratory">Лаборатория</option>
              <option value="seminar">Кабинет/Зал</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Статус</option>
              <option value="free">Свободна</option>
              <option value="occupied">Занята</option>
              <option value="maintenance">В ремонте</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      {/* Таблица аудиторий */}
      <div className="bg-white rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Корпус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вместимость</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Оснащение</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Обновлено</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClassrooms.length > 0 ? (
                filteredClassrooms.map((room) => (
                  <tr
                    key={room.id}
                    onClick={() => handleRowClick(room)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.type === 'lecture' ? 'Лекционный' :
                        room.type === 'laboratory' ? 'Лаборатория' : 'Кабинет/Зал'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.building}, этаж {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.capacity} чел.</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${room.status === 'free' ? 'bg-green-100 text-green-800' :
                        room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {room.status === 'free' ? '🟢 Свободна' :
                          room.status === 'occupied' ? '🔴 Занята' : '🔧 В ремонте'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        {room.hasProjector && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-xs">Проектор</span>}
                        {room.hasComputers && <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-xs">Компьютеры</span>}
                        {room.equipment.length > 0 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-xs">
                            +{room.equipment.length} предм.
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.lastUpdate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg">Аудитории не найдены</p>
                    <p className="text-sm mt-1">Попробуйте изменить параметры фильтрации</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-xs hover:bg-blue-600 transition-colors"
                    >
                      Сбросить фильтры
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальные окна */}
      <AnimatePresence>
        {selectedClassroom && (
          <ClassroomModal
            isOpen={selectedClassroom !== null}
            classroom={selectedClassroom}
            onClose={() => setSelectedClassroom(null)}
            onMutate={mutate}
          />
        )}
      </AnimatePresence>

      {/* Create Classroom Modal */}
      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          mutate();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

export default ClassroomsPage; 