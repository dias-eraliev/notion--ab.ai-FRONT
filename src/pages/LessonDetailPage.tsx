import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { FaArrowLeft, FaVideo, FaFile, FaClipboardCheck, FaSpinner } from 'react-icons/fa';
import { fetcher } from '@/api/index';

interface LessonMaterial {
  id: number;
  type: string; // 'video' | 'presentation' | 'text'
  url?: string;
  content?: string;
  Quiz?: {
    id: number;
    name: string;
    description: string;
    questions: Array<{
      id: number;
      question: string;
      answers: Array<{
        id: number;
        answer: string;
        isCorrect: boolean;
      }>;
    }>;
  };
}

interface Lesson {
  id: number;
  name: string;
  description: string;
  date: string;
  homework?: { id: number; name: string };
  materials: {
    lecture: string;
    videoUrl: string;
    presentationUrl: string;
    Quiz: {
      questions: {
        id: number;
        question: string;
        answers: {
          id: number;
          answer: string;
          isCorrect: boolean;
        }[];
      }[];
    };
  };
}

const LessonDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id, lessonId } = useParams();
  const [activeTab, setActiveTab] = useState<'text' | 'video' | 'presentation' | 'quiz'>('text');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Получаем урок с бэкенда
  const { data, error, isLoading } = useSWR<Lesson>(
    id && lessonId ? `/study-plans/${id}/lessons/${lessonId}` : null,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error ? 'Ошибка при загрузке урока' : 'Урок не найден'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Вернуться к учебному плану
          </button>
        </div>
      </div>
    );
  }

  // Определяем материалы
  const textMaterial = data.materials.lecture;
  const videoMaterial = data.materials.videoUrl;
  const presentationMaterial = data.materials.presentationUrl;
  const quizMaterial = data.materials.Quiz;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" />
          Назад к учебному плану
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
              <p className="text-gray-600">{data.description}</p>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(data.date).toLocaleString('ru-RU')}
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'text' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
              >
                <span>Текст</span>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'video' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
              >
                <FaVideo className="mr-2" />
                <span>Видео</span>
              </button>
              <button
                onClick={() => setActiveTab('presentation')}
                className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'presentation' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
              >
                <FaFile className="mr-2" />
                <span>Презентация</span>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'quiz' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                  }`}
              >
                <FaClipboardCheck className="mr-2" />
                <span>Тест</span>
              </button>
            </div>
          </div>

          {activeTab === 'text' && (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: textMaterial || '<p>Нет текстового материала</p>' }} />
          )}

          {activeTab === 'video' && (
            videoMaterial ? (
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                <video src={videoMaterial} className="w-full h-full" controls />
              </div>
            ) : (
              <div className="text-gray-500">Видео недоступно</div>
            )
          )}

          {activeTab === 'presentation' && (
            presentationMaterial ? (
              <iframe
                src={presentationMaterial}
                className="w-full h-[500px] rounded"
                title="Презентация"
              />
            ) : (
              <div className="text-gray-500">Презентация недоступна</div>
            )
          )}

          {activeTab === 'quiz' && quizMaterial ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                {quizMaterial && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">
                      Вопрос {currentQuestion + 1} из {quizMaterial.questions.length}
                    </h3>
                    <p className="text-lg mb-4">{quizMaterial.questions[currentQuestion].question}</p>
                    <div className="space-y-2">
                      {quizMaterial.questions[currentQuestion].answers.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setAnswers({ ...answers, [currentQuestion]: index })}
                          className={`w-full text-left p-4 rounded-lg border ${answers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-500'
                            }`}
                        >
                          {option.answer}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md disabled:opacity-50"
                >
                  Предыдущий вопрос
                </button>
                <button
                  onClick={() => setCurrentQuestion(Math.min(quizMaterial.questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === quizMaterial.questions.length - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                >
                  Следующий вопрос
                </button>
              </div>
            </div>
          ) : activeTab === 'quiz' ? (
            <div className="text-gray-500">Тест недоступен</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage; 