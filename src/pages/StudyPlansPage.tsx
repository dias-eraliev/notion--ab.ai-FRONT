import React, { useState } from 'react';
import { FaDownload, FaEye, FaTimes, FaSpinner, FaPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import useSWR from 'swr';
import { studyPlansKey } from '../api/studyPlans';
import { useAuth } from '../contexts/AuthContext';
import { fetcher } from '@/api/index';

interface StudyPlan {
  id: string | number;
  name: string;
  description?: string;
  teacher: string;
}

const StudyPlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, payload } = useAuth();
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [filters, setFilters] = useState({ teacher: '' });

  // Fetch study plans using SWR
  const { data, error, isLoading, mutate } = useSWR(
    token ? studyPlansKey(pagination.page, pagination.limit) : null,
    fetcher
  );

  // Transform API data to match our component's state format
  const plans: StudyPlan[] = data
    ? data.data.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      teacher: plan.teacher ? `${plan.teacher.name} ${plan.teacher.surname}` : '',
    }))
    : [];

  // Check if user can create study plans (only teachers and admins)
  const canCreateStudyPlan = payload?.role === 'TEACHER' || payload?.role === 'ADMIN';

  // Get unique teachers for filters
  const uniqueTeachers = [...new Set(plans.map(plan => plan.teacher))].filter(Boolean);

  // Apply filters to study plans
  const filteredPlans = plans.filter(plan => {
    return filters.teacher === '' || plan.teacher === filters.teacher;
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

      {/* Фильтр по преподавателю */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 gap-4">
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
                {plans.length === 0
                  ? 'Нет доступных учебных планов'
                  : 'Нет учебных планов, соответствующих выбранным фильтрам'}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Описание</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Преподаватель</th>
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
                        <Link
                          to={`/study-plans/${plan.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {plan.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.description || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.teacher}
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
        </>
      )}

      {/* Модальное окно детального просмотра */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Шапка модального окна */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedPlan.name}
                  </h2>
                  <div className="mt-2 flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium">Преподаватель:</span>
                      <span className="ml-2">{selectedPlan.teacher}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Описание:</span>
                      <span className="ml-2">{selectedPlan.description || '—'}</span>
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
            {/* Можно добавить детали, если появятся */}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlansPage; 