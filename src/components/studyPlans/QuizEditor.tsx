import { CreateQuizDto } from '@/Types/create-quiz.dto';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import { FaPlus, FaTrash } from 'react-icons/fa';

export type QuestionType = {
  question: string;
  answers: Array<{
    answer: string;
    isCorrect: boolean;
  }>;
};

export type QuizData = {
  name: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
  questions: {
    create: Array<{
      question: string;
      answers: {
        create: Array<{
          answer: string;
          isCorrect: boolean;
          Question: { connect: { id: number } };
        }>;
      };
    }>;
  };
};

interface QuizEditorProps {
  hasQuiz: boolean;
  setHasQuiz: (value: boolean) => void;
  questions: QuestionType[];
  setQuestions: (questions: QuestionType[]) => void;
  quizStartTime: Date | null;
  setQuizStartTime: (date: Date | null) => void;
  quizEndTime: Date | null;
  setQuizEndTime: (date: Date | null) => void;
}

export default function QuizEditor({
  hasQuiz,
  setHasQuiz,
  questions,
  setQuestions,
  quizStartTime,
  setQuizStartTime,
  quizEndTime,
  setQuizEndTime,
}: QuizEditorProps) {
  // Функции для работы с вопросами и ответами
  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: [{ answer: '', isCorrect: false }] }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ answer: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(newQuestions);
  };

  const updateAnswer = (questionIndex: number, answerIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answer = value;
    setQuestions(newQuestions);
  };

  // Модифицированная функция для поддержки выбора нескольких правильных ответов
  const toggleCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    // Просто переключаем значение isCorrect для конкретного ответа
    newQuestions[questionIndex].answers[answerIndex].isCorrect = 
      !newQuestions[questionIndex].answers[answerIndex].isCorrect;
    setQuestions(newQuestions);
  };

  return (
    <fieldset className="fieldset">
      <div className="flex items-center justify-between">
        <legend className="fieldset-legend">Тест</legend>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasQuiz}
            onChange={(e) => setHasQuiz(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm">Добавить тест к уроку</span>
        </label>
      </div>
      
      {hasQuiz && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата начала теста
              </label>
              <DatePicker
                selected={quizStartTime}
                onChange={(date) => setQuizStartTime(date as Date)}
                locale={"ru"}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd.MM.yyyy HH:mm"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата окончания теста
              </label>
              <DatePicker
                selected={quizEndTime}
                onChange={(date) => setQuizEndTime(date as Date)}
                locale={"ru"}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd.MM.yyyy HH:mm"
                className="input w-full"
                minDate={quizStartTime || undefined}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Вопросы</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-sm btn-primary"
              >
                <FaPlus className="mr-1" /> Добавить вопрос
              </button>
            </div>
            
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-grow mr-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Вопрос {qIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, e.target.value)}
                      className="input w-full"
                      placeholder="Введите вопрос"
                      required={hasQuiz}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="btn btn-sm btn-error"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Варианты ответов
                    </label>
                    <span className="text-xs text-blue-600 italic">
                      Можно выбрать несколько правильных ответов
                    </span>
                  </div>
                  
                  {question.answers.map((answer, aIndex) => (
                    <div key={aIndex} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={() => toggleCorrectAnswer(qIndex, aIndex)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                        required={hasQuiz}
                      />
                      <input
                        type="text"
                        value={answer.answer}
                        onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                        className="input flex-grow"
                        placeholder="Вариант ответа"
                        required={hasQuiz}
                      />
                      <button
                        type="button"
                        onClick={() => removeAnswer(qIndex, aIndex)}
                        className="btn btn-sm btn-error"
                        disabled={question.answers.length <= 1}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addAnswer(qIndex)}
                    className="btn btn-sm btn-secondary mt-2"
                  >
                    <FaPlus className="mr-1" /> Добавить вариант ответа
                  </button>
                </div>
              </div>
            ))}
            
            {questions.length === 0 && hasQuiz && (
              <div className="text-center py-4 text-gray-500">
                Нет вопросов. Добавьте вопросы для теста.
              </div>
            )}
          </div>
        </div>
      )}
    </fieldset>
  );
}

export const prepareQuizData = (
  hasQuiz: boolean, 
  questions: QuestionType[], 
  quizStartTime: Date | null, 
  quizEndTime: Date | null
): CreateQuizDto | null => {
  if (!hasQuiz || questions.length === 0) return null;

  return {
    name: "Тест по уроку",
    description: "Проверка знаний по материалу урока",
    startTime: quizStartTime,
    endTime: quizEndTime,
    questions: {
      create: questions.map(q => ({
        question: q.question,
        answers: {
          create: q.answers.map(a => ({
            answer: a.answer,
            isCorrect: a.isCorrect,
          }))
        }
      }))
    }
  };
};