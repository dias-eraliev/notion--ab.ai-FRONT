import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaVideo, FaFile, FaClipboardCheck, FaArrowLeft, FaSpinner } from 'react-icons/fa';

interface LessonCard {
  id: string;
  title: string;
  description: string;
  hasVideo: boolean;
  hasPresentation: boolean;
  hasTest: boolean;
  scheduledDate?: string;
}

const StudyPlanDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyPlan, setStudyPlan] = useState<{
    subject: string;
    class: string;
    teacher: string;
    totalLessons: number;
    lessons: LessonCard[];
  }>({
    subject: 'Алгебра',
    class: '10A',
    teacher: 'Иванова Л.',
    totalLessons: 36,
    lessons: [
      {
        id: '1',
        title: 'Квадратные уравнения',
        description: 'Основные понятия и методы решения квадратных уравнений.',
        hasVideo: true,
        hasPresentation: true,
        hasTest: true,
        scheduledDate: '2025-04-01 08:30'
      },
      {
        id: '2',
        title: 'Дискриминант',
        description: 'Формула дискриминанта и ее применение для определения количества корней.',
        hasVideo: true,
        hasPresentation: true,
        hasTest: true,
        scheduledDate: '2025-04-03 10:25'
      },
      {
        id: '3',
        title: 'Теорема Виета',
        description: 'Связь между корнями квадратного уравнения и его коэффициентами.',
        hasVideo: true,
        hasPresentation: true,
        hasTest: true,
        scheduledDate: '2025-04-05 12:15'
      }
    ]
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Имитация загрузки данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // В реальном приложении здесь будет API-запрос
        // const response = await fetch(`/api/study-plans/${id}`);
        // const data = await response.json();
        // setStudyPlan(data);
        
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке учебного плана');
        console.error('Error loading study plan:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleBack = () => {
    const basePath = location.pathname.includes('/academic') ? '/academic/study-plans' : '/study-plans';
    navigate(basePath);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button
            onClick={handleBack}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Вернуться к списку учебных планов
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" />
          Назад к списку планов
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Учебный план: {studyPlan.subject}</h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <span>Класс: {studyPlan.class}</span>
              <span>Преподаватель: {studyPlan.teacher}</span>
              <span>Всего уроков: {studyPlan.totalLessons}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {studyPlan.lessons.map((lesson) => (
          <div 
            key={lesson.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              const basePath = location.pathname.includes('/academic') ? '/academic/study-plans' : '/study-plans';
              navigate(`${basePath}/${id}/lessons/${lesson.id}`);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{lesson.title}</h3>
                  {lesson.scheduledDate && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {new Date(lesson.scheduledDate).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{lesson.description}</p>
              </div>
              <div className="flex space-x-4">
                {lesson.hasVideo && (
                  <div className="text-blue-600">
                    <FaVideo className="w-5 h-5" />
                  </div>
                )}
                {lesson.hasPresentation && (
                  <div className="text-blue-600">
                    <FaFile className="w-5 h-5" />
                  </div>
                )}
                {lesson.hasTest && (
                  <div className="text-blue-600">
                    <FaClipboardCheck className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanDetailPage; 