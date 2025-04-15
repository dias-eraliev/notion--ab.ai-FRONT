import React, { useState } from 'react';
import { FaDownload, FaSearch, FaEye, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

interface StudyPlan {
  id: string;
  subject: string;
  class: string;
  teacher: string;
  totalLessons: number;
  completedLessons: number;
  lastUpdate: string;
  lessons: Array<{
    id: string;
    topic: string;
    hasVideo: boolean;
    hasPresentation: boolean;
    hasTest: boolean;
    addedDate: string;
    responsible: string;
    scheduledDate?: string;
  }>;
}

const StudyPlansPage: React.FC = () => {
  const navigate = useNavigate();
  // Временные данные для примера
  const [plans, setPlans] = useState<StudyPlan[]>([
    {
      id: '1',
      subject: 'Алгебра',
      class: '10A',
      teacher: 'Иванова Л.',
      totalLessons: 36,
      completedLessons: 36,
      lastUpdate: '2025-03-28',
      lessons: [
        {
          id: '1',
          topic: 'Квадратные уравнения',
          hasVideo: true,
          hasPresentation: true,
          hasTest: true,
          addedDate: '2025-03-01',
          responsible: 'Иванова Л.',
          scheduledDate: '2025-04-01 08:30'
        },
        {
          id: '2',
          topic: 'Формулы сокращенного умножения',
          hasVideo: true,
          hasPresentation: false,
          hasTest: true,
          addedDate: '2025-03-05',
          responsible: 'Иванова Л.',
          scheduledDate: '2025-04-03 10:25'
        },
        {
          id: '3',
          topic: 'Теорема Виета',
          hasVideo: false,
          hasPresentation: true,
          hasTest: false,
          addedDate: '',
          responsible: '',
          scheduledDate: '2025-04-05 12:15'
        }
      ]
    },
    {
      id: '2',
      subject: 'Биология',
      class: '8Б',
      teacher: 'Алиев А.',
      totalLessons: 34,
      completedLessons: 28,
      lastUpdate: '2025-02-12',
      lessons: []
    },
    {
      id: '3',
      subject: 'Физика',
      class: '11Б',
      teacher: 'Тулегенов М.',
      totalLessons: 30,
      completedLessons: 12,
      lastUpdate: '2025-01-05',
      lessons: []
    }
  ]);

  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    teacher: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 text-green-800';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok':
        return 'OK';
      case 'incomplete':
        return 'Не заполнено';
      case 'critical':
        return 'Критично';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return '🟢';
      case 'incomplete':
        return '🟡';
      case 'critical':
        return '🔴';
      default:
        return '';
    }
  };

  const getCompletionIcon = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage === 100) return '✅';
    if (percentage >= 50) return '⚠️';
    return '❌';
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Учебные планы</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
          <FaDownload className="mr-2" />
          Скачать в Excel
        </button>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Предмет</option>
              <option value="Алгебра">Алгебра</option>
              <option value="Биология">Биология</option>
              <option value="Физика">Физика</option>
            </select>
          </div>
          <div>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Класс</option>
              <option value="10A">10A</option>
              <option value="8Б">8Б</option>
              <option value="11Б">11Б</option>
            </select>
          </div>
          <div>
            <select
              value={filters.teacher}
              onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Преподаватель</option>
              <option value="Иванова Л.">Иванова Л.</option>
              <option value="Алиев А.">Алиев А.</option>
              <option value="Тулегенов М.">Тулегенов М.</option>
            </select>
          </div>
        </div>
      </div>

      {/* Таблица учебных планов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Класс</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Предмет</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Преподаватель</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Кол-во уроков</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Заполнено</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Обновлено</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map((plan, index) => (
              <tr 
                key={plan.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedPlan(plan)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.class}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link 
                    to={`/study-plans/${plan.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {plan.subject} - {plan.class}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.teacher}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.totalLessons}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="flex items-center">
                    {getCompletionIcon(plan.completedLessons, plan.totalLessons)}&nbsp;
                    {plan.completedLessons}/{plan.totalLessons}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.lastUpdate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button 
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/study-plans/${plan.id}`);
                    }}
                  >
                    <FaEye className="mr-1" />
                    Посмотреть план
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно детального просмотра */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
            {/* Шапка модального окна */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedPlan.subject} - {selectedPlan.class}
                  </h2>
                  <div className="mt-2 flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium">Преподаватель:</span>
                      <span className="ml-2">{selectedPlan.teacher}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Всего уроков:</span>
                      <span className="ml-2">{selectedPlan.totalLessons}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Обновлено:</span>
                      <span className="ml-2">{selectedPlan.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Основной контент */}
            <div className="flex-1 p-6 flex gap-6 overflow-hidden">
              {/* Таблица уроков */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">№</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Тема урока</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Дата урока</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Видео</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Презентация</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Тест</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Дата добавления</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ответственный</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPlan.lessons.map((lesson, index) => (
                        <tr key={lesson.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{lesson.topic}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {lesson.scheduledDate ? (
                              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                {new Date(lesson.scheduledDate).toLocaleString('ru-RU', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${lesson.hasVideo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {lesson.hasVideo ? '✓' : '×'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${lesson.hasPresentation ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {lesson.hasPresentation ? '✓' : '×'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${lesson.hasTest ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {lesson.hasTest ? '✓' : '×'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.addedDate || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.responsible || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI-анализ */}
              <div className="w-80 flex-shrink-0">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">AI-анализ</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center text-red-700">
                        <span className="text-lg mr-2">📉</span>
                        <p>5 уроков без видео</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center text-yellow-700">
                        <span className="text-lg mr-2">⚠️</span>
                        <p>2 темы не соответствуют базовому учебному плану</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center text-blue-700">
                        <span className="text-lg mr-2">💡</span>
                        <p>Рекомендуем назначить ответственного за заполнение урока №3</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlansPage; 