import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaVideo, FaFile, FaClipboardCheck, FaCheck, FaTimes } from 'react-icons/fa';

interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const LessonDetailPage: React.FC = () => {
  const { id, lessonId } = useParams();
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

  const testQuestions: TestQuestion[] = [
    {
      id: 1,
      question: "Для квадратного уравнения ax² + bx + c = 0, чему равна сумма корней по теореме Виета?",
      options: ["a/b", "-b/a", "c/a", "-c/b"],
      correctAnswer: 1,
      explanation: "По теореме Виета, сумма корней x₁ + x₂ = -b/a"
    },
    {
      id: 2,
      question: "Чему равно произведение корней квадратного уравнения по теореме Виета?",
      options: ["b/a", "-b/a", "c/a", "-c/a"],
      correctAnswer: 2,
      explanation: "По теореме Виета, произведение корней x₁ · x₂ = c/a"
    },
    {
      id: 3,
      question: "Для уравнения x² - 7x + 12 = 0, чему равна сумма корней?",
      options: ["5", "6", "7", "12"],
      correctAnswer: 2,
      explanation: "В данном уравнении a=1, b=-7, поэтому сумма корней равна 7"
    },
    {
      id: 4,
      question: "Для уравнения x² - 7x + 12 = 0, чему равно произведение корней?",
      options: ["7", "10", "12", "-12"],
      correctAnswer: 2,
      explanation: "В данном уравнении a=1, c=12, поэтому произведение корней равно 12"
    },
    {
      id: 5,
      question: "Если сумма корней квадратного уравнения равна 5, а их произведение равно 6, то какое это уравнение?",
      options: [
        "x² + 5x + 6 = 0",
        "x² - 5x + 6 = 0",
        "x² + 6x + 5 = 0",
        "x² - 6x + 5 = 0"
      ],
      correctAnswer: 1,
      explanation: "По теореме Виета: если x₁ + x₂ = 5 и x₁ · x₂ = 6, то уравнение имеет вид x² - 5x + 6 = 0"
    }
  ];

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Теорема Виета</h1>
        <p className="text-gray-600">Связь между корнями квадратного уравнения и его коэффициентами</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Видео */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaVideo className="w-5 h-5 mr-2 text-blue-600" />
              Видео
            </h2>
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
            <iframe
              className="w-full h-[500px] rounded-lg"
              src="https://www.youtube.com/embed/your-video-id"
              title="Теорема Виета"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Презентация */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaFile className="w-5 h-5 mr-2 text-blue-600" />
              Презентация
            </h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Презентация "Теорема Виета и её применение"</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Скачать презентацию
            </button>
          </div>
        </div>

        {/* Лекция */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Лекция</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">1. Введение</h3>
            <p className="mb-4">
              Теорема Виета, названная в честь французского математика Франсуа Виета, является одной из 
              фундаментальных теорем алгебры. Она устанавливает связь между корнями квадратного уравнения 
              и его коэффициентами, что делает её мощным инструментом в решении различных алгебраических задач.
            </p>

            <h3 className="text-lg font-semibold mb-3">2. Формулировка теоремы</h3>
            <p className="mb-4">
              Для квадратного уравнения вида ax² + bx + c = 0, где a ≠ 0, с корнями x₁ и x₂, теорема Виета 
              утверждает:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold">x₁ + x₂ = -b/a</p>
              <p className="font-semibold">x₁ · x₂ = c/a</p>
            </div>

            <h3 className="text-lg font-semibold mb-3">3. Частные случаи</h3>
            <p className="mb-4">
              Если a = 1 (приведённое квадратное уравнение), формулы упрощаются:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>x₁ + x₂ = -b</li>
              <li>x₁ · x₂ = c</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">4. Применение теоремы</h3>
            <p className="mb-4">Теорема Виета может использоваться для:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Нахождения корней квадратного уравнения без использования дискриминанта</li>
              <li>Проверки корней квадратного уравнения</li>
              <li>Составления квадратного уравнения по известным корням</li>
              <li>Решения систем уравнений особого вида</li>
              <li>Разложения квадратного трёхчлена на множители</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">5. Примеры решения задач</h3>
            
            <h4 className="font-semibold mb-2">Пример 1: Нахождение корней</h4>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p>Дано уравнение: x² - 5x + 6 = 0</p>
              <p>По теореме Виета:</p>
              <ul className="list-disc pl-6">
                <li>x₁ + x₂ = 5</li>
                <li>x₁ · x₂ = 6</li>
              </ul>
              <p>Подбором находим: x₁ = 2, x₂ = 3</p>
            </div>

            <h4 className="font-semibold mb-2">Пример 2: Составление уравнения</h4>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p>Даны корни: x₁ = -1, x₂ = -4</p>
              <p>По теореме Виета:</p>
              <ul className="list-disc pl-6">
                <li>Сумма корней = -1 + (-4) = -5, значит b = 5</li>
                <li>Произведение корней = (-1) · (-4) = 4, значит c = 4</li>
              </ul>
              <p>Получаем уравнение: x² + 5x + 4 = 0</p>
            </div>

            <h3 className="text-lg font-semibold mb-3">6. Обратная теорема Виета</h3>
            <p className="mb-4">
              Если для двух чисел x₁ и x₂ выполняются соотношения Виета относительно коэффициентов 
              квадратного уравнения, то эти числа являются корнями данного уравнения.
            </p>

            <h3 className="text-lg font-semibold mb-3">7. Практические рекомендации</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Всегда проверяйте, приведено ли уравнение к стандартному виду</li>
              <li>Обращайте внимание на знак перед коэффициентом b</li>
              <li>При решении систем уравнений используйте обе формулы Виета</li>
              <li>Помните о возможности применения теоремы для упрощения вычислений</li>
            </ul>
          </div>
        </div>

        {/* Тестирование */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaClipboardCheck className="w-5 h-5 mr-2 text-blue-600" />
              Тестирование
            </h2>
            <button 
              onClick={() => setShowAnswers(!showAnswers)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showAnswers ? 'Скрыть ответы' : 'Показать ответы'}
            </button>
          </div>

          <div className="space-y-6">
            {testQuestions.map((q) => (
              <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-3">{q.id}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded cursor-pointer flex items-center justify-between
                        ${selectedAnswers[q.id] === index ? 'bg-blue-100' : 'hover:bg-gray-100'}
                        ${showAnswers && index === q.correctAnswer ? 'bg-green-100' : ''}
                      `}
                      onClick={() => handleAnswerSelect(q.id, index)}
                    >
                      <span>{option}</span>
                      {showAnswers && index === q.correctAnswer && (
                        <FaCheck className="text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
                {showAnswers && (
                  <div className="mt-2 text-green-700 bg-green-50 p-2 rounded">
                    <p className="font-semibold">Объяснение:</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage; 