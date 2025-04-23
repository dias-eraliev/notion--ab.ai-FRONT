import React, { useState } from 'react';
import { FaDownload, FaSearch, FaEye, FaCheck, FaTimes, FaExclamationTriangle, FaSpinner, FaPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher, studyPlansKey, type StudyPlan as ApiStudyPlan } from '../api/studyPlans';
import { useAuth } from '../providers/AuthProvider';

interface StudyPlan {
  id: string | number;
  subject: string;
  class: string;
  teacher: string;
  totalLessons: number;
  completedLessons: number;
  lastUpdate: string;
  lessons: Array<{
    id: string | number;
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
  // Use the existing AuthContext
  const { token, payload } = useAuth();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    teacher: ''
  });

  // Fetch study plans using SWR
  const { data, error, isLoading, mutate } = useSWR(
    token ? studyPlansKey(pagination.page, pagination.limit) : null,
    fetcher
  );

  // Transform API data to match our component's state format
  const plans: StudyPlan[] = data ? data.data.map((plan: ApiStudyPlan) => ({
    id: plan.id,
    subject: plan.subject,
    // Extract class info from description or set default
    class: plan.description?.split(',')[0] || '- -',
    // Format teacher name
    teacher: `${plan.teacher.name} ${plan.teacher.surname}`,
    // Calculate lessons info
    totalLessons: plan.lessons.length,
    // Count lessons with all materials
    completedLessons: plan.lessons.filter(
      lesson => lesson.hasVideo && lesson.hasPresentation && lesson.hasTest
    ).length,
    // Use current date as last update if not available
    lastUpdate: new Date().toISOString().split('T')[0],
    // Transform lessons
    lessons: plan.lessons.map(lesson => ({
      id: lesson.id,
      topic: lesson.title,
      hasVideo: lesson.hasVideo,
      hasPresentation: lesson.hasPresentation,
      hasTest: lesson.hasTest,
      addedDate: '', // Not provided by API
      responsible: `${plan.teacher.name} ${plan.teacher.surname}`,
      scheduledDate: lesson.scheduledDate
    }))
  })) : [];

  // Check if user can create study plans (only teachers and admins)
  const canCreateStudyPlan = payload?.role === 'TEACHER' || payload?.role === 'ADMIN';

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

  // Get unique classes, subjects, and teachers for filters
  const uniqueClasses = [...new Set(plans.map(plan => plan.class))].filter(Boolean);
  const uniqueSubjects = [...new Set(plans.map(plan => plan.subject))].filter(Boolean);
  const uniqueTeachers = [...new Set(plans.map(plan => plan.teacher))].filter(Boolean);

  // Apply filters to study plans
  const filteredPlans = plans.filter(plan => {
    return (
      (filters.class === '' || plan.class === filters.class) &&
      (filters.subject === '' || plan.subject === filters.subject) &&
      (filters.teacher === '' || plan.teacher === filters.teacher)
    );
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Учебные планы</h1>
        <div className="flex gap-2">
          {canCreateStudyPlan && (
            <button 
              onClick={() => navigate('/study-plans/create')}
              className="px-4 py-2 bg-corporate-primary text-white rounded-md hover:bg-corporate-primary-dark flex items-center"
            >
              <FaPlus className="mr-2" />
              Создать учебный план
            </button>
          )}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
            <FaDownload className="mr-2" />
            Скачать в Excel
          </button>
        </div>
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
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Группа</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.teacher}
              onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Преподаватель</option>
              {uniqueTeachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!token ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p>Для просмотра учебных планов необходимо авторизоваться</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-2 text-sm text-yellow-600 hover:text-yellow-500"
          >
            Перейти на страницу входа
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Ошибка при загрузке учебных планов</p>
          <button
            onClick={() => mutate()} // Retry fetching data
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Попробовать снова
          </button>
        </div>
      ) : (
        <>
          {/* Таблица учебных планов */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredPlans.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {plans.length === 0 ? 
                  'Нет доступных учебных планов' : 
                  'Нет учебных планов, соответствующих выбранным фильтрам'}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Группа</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Предмет</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Преподаватель</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Кол-во уроков</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Заполнено</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Обновлено</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlans.map((plan, index) => (
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
            )}
          </div>

          {/* Pagination */}
          {plans.length > 0 && data && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Показано {Math.min(pagination.limit, filteredPlans.length)} из {data.total} учебных планов
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                >
                  Назад
                </button>
                <button 
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                  disabled={pagination.page * pagination.limit >= (data.total || 0)}
                  onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                >
                  Вперед
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
                {selectedPlan.lessons.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Нет уроков в выбранном учебном плане
                  </div>
                ) : (
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
                )}
              </div>

              {/* AI-анализ */}
              <div className="w-80 flex-shrink-0">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">AI-анализ</h3>
                  <div className="space-y-3">
                    {selectedPlan.lessons.filter(l => !l.hasVideo).length > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center text-red-700">
                          <span className="text-lg mr-2">📉</span>
                          <p>{selectedPlan.lessons.filter(l => !l.hasVideo).length} уроков без видео</p>
                        </div>
                      </div>
                    )}
                    {selectedPlan.lessons.filter(l => !l.hasPresentation).length > 0 && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center text-yellow-700">
                          <span className="text-lg mr-2">⚠️</span>
                          <p>{selectedPlan.lessons.filter(l => !l.hasPresentation).length} уроков без презентации</p>
                        </div>
                      </div>
                    )}
                    {selectedPlan.lessons.filter(l => !l.hasTest).length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-700">
                          <span className="text-lg mr-2">💡</span>
                          <p>Рекомендуем добавить тесты к {selectedPlan.lessons.filter(l => !l.hasTest).length} урокам</p>
                        </div>
                      </div>
                    )}
                    {selectedPlan.completedLessons === selectedPlan.totalLessons && selectedPlan.totalLessons > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <span className="text-lg mr-2">✅</span>
                          <p>Все уроки полностью готовы</p>
                        </div>
                      </div>
                    )}
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