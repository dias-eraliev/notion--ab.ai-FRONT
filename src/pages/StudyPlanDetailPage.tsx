import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaVideo, FaFile, FaClipboardCheck } from 'react-icons/fa';

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

  // Временные данные для примера
  const lessons: LessonCard[] = [
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
    },
    {
      id: '4',
      title: 'Применение теоремы Виета',
      description: 'Практическое применение теоремы Виета для решения задач.',
      hasVideo: true,
      hasPresentation: true,
      hasTest: true,
      scheduledDate: '2025-04-08 14:45'
    },
    {
      id: '5',
      title: 'Разложение квадратного трехчлена',
      description: 'Использование теоремы Виета для разложения квадратного трехчлена на множители.',
      hasVideo: true,
      hasPresentation: true,
      hasTest: false,
      scheduledDate: '2025-04-10 09:15'
    }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Детали учебного плана</h1>
          <div className="flex items-center text-gray-600">
            <span className="mr-4">Алгебра - 10A</span>
            <span className="mr-4">Преподаватель: Иванова Л.</span>
            <span>Всего уроков: 36</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lessons.map((lesson) => (
          <div 
            key={lesson.id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/study-plans/${id}/lessons/${lesson.id}`)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start">
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
              </div>
              <div className="flex space-x-4">
                <div className={`flex items-center ${lesson.hasVideo ? 'text-blue-600' : 'text-gray-400'}`}>
                  <FaVideo className="w-5 h-5" />
                </div>
                <div className={`flex items-center ${lesson.hasPresentation ? 'text-blue-600' : 'text-gray-400'}`}>
                  <FaFile className="w-5 h-5" />
                </div>
                <div className={`flex items-center ${lesson.hasTest ? 'text-blue-600' : 'text-gray-400'}`}>
                  <FaClipboardCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanDetailPage; 