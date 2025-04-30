import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaVideo, FaFile, FaClipboardCheck, FaArrowLeft, FaSpinner, FaPlus, FaTimes } from 'react-icons/fa';

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
    group: string;
    teacher: string;
    totalLessons: number;
    lessons: LessonCard[];
  }>({
    subject: 'Алгебра',
    group: 'MK24-1M',
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    videoUrl: '',
    presentationFile: null,
    testQuestions: ''
  });

  const [testQuestions, setTestQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctOption: 0 },
  ]);

  const [selectedMethodology, setSelectedMethodology] = useState('');

  const methodologies = {
    'Проектный метод': 'Описание лекции с использованием проектного метода: студенты работают над проектами, которые требуют исследования, анализа и представления результатов.',
    'Метод кейс-стади': 'Описание лекции с использованием метода кейс-стади: студенты анализируют конкретные ситуации, чтобы предложить решения и обсудить их.',
    'Перевёрнутый класс': 'Описание лекции с использованием перевёрнутого класса: студенты изучают материал дома, а в классе выполняют практические задания.',
    'Ролевые и деловые игры': 'Описание лекции с использованием ролевых и деловых игр: студенты участвуют в симуляциях, чтобы развить навыки принятия решений.',
    'Метод «Групповой пазл»': 'Описание лекции с использованием метода «Групповой пазл»: студенты работают в группах, каждая из которых изучает часть материала и делится знаниями с другими.'
  };

  const handleMethodologyChange = (methodology) => {
    setSelectedMethodology(methodology);
    setNewLesson({
      ...newLesson,
      description: methodologies[methodology]
    });
  };

  const handleAddQuestion = () => {
    setTestQuestions([
      ...testQuestions,
      { question: '', options: ['', '', '', ''], correctOption: 0 },
    ]);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...testQuestions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''), 10);
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === 'correctOption') {
      updatedQuestions[index].correctOption = value;
    }
    setTestQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    setTestQuestions(testQuestions.filter((_, i) => i !== index));
  };

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

  const handleAddLesson = () => {
    // Логика добавления урока
    console.log('Новый урок:', newLesson);
    setIsModalOpen(false);
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
              <span>Группа: {studyPlan.group}</span>
              <span>Преподаватель: {studyPlan.teacher}</span>
              <span>Всего уроков: {studyPlan.totalLessons}</span>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Добавить урок
          </button>
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
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
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
                  <div className="text-green-600">
                    <FaVideo className="w-5 h-5" />
                  </div>
                )}
                {lesson.hasPresentation && (
                  <div className="text-green-600">
                    <FaFile className="w-5 h-5" />
                  </div>
                )}
                {lesson.hasTest && (
                  <div className="text-green-600">
                    <FaClipboardCheck className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Добавить урок</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название урока</label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Методика</label>
                <select
                  value={selectedMethodology}
                  onChange={(e) => handleMethodologyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите методику</option>
                  {Object.keys(methodologies).map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата и время</label>
                <input
                  type="datetime-local"
                  value={newLesson.scheduledDate}
                  onChange={(e) => setNewLesson({ ...newLesson, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на видео</label>
                <input
                  type="url"
                  placeholder="https://example.com/video"
                  value={newLesson.videoUrl || ''}
                  onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Загрузить презентацию</label>
                <input
                  type="file"
                  accept=".ppt,.pptx,.pdf"
                  onChange={(e) => setNewLesson({ ...newLesson, presentationFile: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Создать тест</label>
                {testQuestions.map((q, index) => (
                  <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Вопрос {index + 1}</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleUpdateQuestion(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">Вариант {optIndex + 1}</label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleUpdateQuestion(index, `option${optIndex}`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ))}
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Правильный вариант</label>
                      <select
                        value={q.correctOption}
                        onChange={(e) => handleUpdateQuestion(index, 'correctOption', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        {q.options.map((_, optIndex) => (
                          <option key={optIndex} value={optIndex}>
                            Вариант {optIndex + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(index)}
                      className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-md border border-red-300"
                    >
                      Удалить вопрос
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Добавить вопрос
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300"
              >
                Отмена
              </button>
              <button
                onClick={handleAddLesson}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanDetailPage;