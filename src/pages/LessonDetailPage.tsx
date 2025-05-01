import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { FaArrowLeft, FaVideo, FaFile, FaClipboardCheck, FaSpinner } from 'react-icons/fa';
import { fetcher } from '@/api/index';

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
      id: number;
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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});

  // Получаем урок с бэкенда
  const { data, error, isLoading } = useSWR<Lesson>(
    id && lessonId ? `/study-plans/${id}/lessons/${lessonId}` : null,
    fetcher
  );

  // Функция для обработки выбора ответа
  const toggleAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => {
      const currentAnswers = prev[questionIndex] || [];

      if (currentAnswers.includes(answerIndex)) {
        return {
          ...prev,
          [questionIndex]: currentAnswers.filter(idx => idx !== answerIndex)
        };
      } else {
        return {
          ...prev,
          [questionIndex]: [...currentAnswers, answerIndex]
        };
      }
    });
  };

  // Функция для проверки, выбран ли ответ
  const isAnswerSelected = (questionIndex: number, answerIndex: number) => {
    return (selectedAnswers[questionIndex] || []).includes(answerIndex);
  };

  // Функция для подготовки данных к отправке на сервер
  const prepareQuizSubmission = () => {
    if (!data?.materials?.Quiz) return null;

    const quizId = data.materials.Quiz.id;
    const questions = Object.keys(selectedAnswers).map(qIndex => {
      const questionIndex = parseInt(qIndex);
      const question = data.materials.Quiz.questions[questionIndex];

      return {
        questionId: question.id,
        answerIds: selectedAnswers[questionIndex].map(
          answerIndex => question.answers[answerIndex].id
        )
      };
    });

    return {
      quizId,
      questions
    };
  };

  // Функция для отправки результатов теста
  const submitQuiz = async () => {
    const quizData = prepareQuizSubmission();
    if (!quizData) return;

    try {
      alert('Функция отправки теста будет реализована в ближайшее время');
    } catch (error) {
      console.error('Ошибка при отправке теста:', error);
      alert('Произошла ошибка при отправке теста');
    }
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
  const textMaterial = data.materials?.lecture || '<p>Нет текстового материала</p>';
  const videoMaterial = data.materials?.videoUrl || '';
  const presentationMaterial = data.materials?.presentationUrl || '';
  const quizMaterial = data.materials?.Quiz ?? [];

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
                {new Date(data.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
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
                className="w-full h-[500px] rounded-xs"
                title="Презентация"
              />
            ) : (
              <div className="text-gray-500">Презентация недоступна</div>
            )
          )}

          {activeTab === 'quiz' && quizMaterial && quizMaterial.questions && quizMaterial.questions.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Вопрос {currentQuestion + 1} из {quizMaterial.questions.length}
                </h3>
                <p className="text-lg mb-4">{quizMaterial.questions[currentQuestion].question}</p>

                <div className="mb-4 text-sm text-blue-600 italic">
                  Можно выбрать несколько правильных ответов
                </div>

                <div className="space-y-2">
                  {quizMaterial.questions[currentQuestion].answers.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => toggleAnswer(currentQuestion, index)}
                      className={`w-full text-left p-4 rounded-lg border flex items-center cursor-pointer ${isAnswerSelected(currentQuestion, index)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAnswerSelected(currentQuestion, index)}
                        onChange={() => {}} // Обработка происходит в onClick контейнера
                        className="form-checkbox h-5 w-5 text-blue-600 mr-3"
                      />
                      <span>{option.answer}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md disabled:opacity-50"
                >
                  Предыдущий вопрос
                </button>

                {currentQuestion === quizMaterial.questions.length - 1 ? (
                  <button
                    onClick={submitQuiz}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Завершить тест
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(Math.min(quizMaterial.questions.length - 1, currentQuestion + 1))}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                  >
                    Следующий вопрос
                  </button>
                )}
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