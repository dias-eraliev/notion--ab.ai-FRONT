import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaVideo, FaFile, FaClipboardCheck, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import useSWR from 'swr';
import { createLesson, studyPlanKey, type Lesson, type CreateLessonDto } from '../api/studyPlans';
import { useAuth } from '../contexts/AuthContext';
import { fetcher } from '@/api/index';

interface LessonCard {
  id: string | number;
  title: string;
  description: string;
  scheduledDate?: string;
  hasVideo?: boolean;
  hasPresentation?: boolean;
  hasTest?: boolean;
  homework?: { id: number; name: string };
}

interface TestQuestion {
  question: string;
  options: string[];
  correct: number;
}

const StudyPlanDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { token, payload } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    hasVideo: false,
    hasPresentation: false,
    hasTest: false,
  });

  const [videoType, setVideoType] = useState<'file' | 'link'>('link');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion>({ question: '', options: ['', ''], correct: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch study plan data using SWR
  const { data: studyPlanData, error: fetchError, isLoading, mutate } = useSWR(
    id && token ? studyPlanKey(id) : null,
    fetcher
  );

  // Transform API data to match our component state format
  const studyPlan = studyPlanData ? {
    subject: studyPlanData.subject,
    class: studyPlanData.description?.split(',')[0] || '- -',
    teacher: `${studyPlanData.teacher.name} ${studyPlanData.teacher.surname}`,
    totalLessons: studyPlanData.lessons.length,
    lessons: studyPlanData.lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.name,
      description: lesson.description,
      scheduledDate: lesson.date,
      hasVideo: false,
      hasPresentation: false,
      hasTest: !!lesson.homework,
      homework: lesson.homework,
    }))
  } : null;

  // Check if user can create lessons (only teachers and admins)
  const canCreateLesson = payload?.role === 'TEACHER' || payload?.role === 'ADMIN';

  const handleBack = () => {
    const basePath = location.pathname.includes('/academic') ? '/academic/study-plans' : '/study-plans';
    navigate(basePath);
  };

  const handleCreateLesson = async () => {
    if (!newLesson.title.trim() || !id) return;

    setIsSubmitting(true);

    try {
      // Prepare the lesson data
      const lessonData: CreateLessonDto = {
        title: newLesson.title,
        description: newLesson.description,
        scheduledDate: newLesson.scheduledDate || undefined,
        hasVideo: !!(videoFile || videoLink),
        hasPresentation: !!presentationFile,
        hasTest: testQuestions.length > 0,
        videoFile: videoFile || undefined,
        videoLink: videoLink || undefined,
        presentationFile: presentationFile || undefined,
        testQuestions: testQuestions.length > 0 ? testQuestions.map(q => ({
          question: q.question,
          options: q.options,
          correct: q.correct
        })) : undefined,
      };

      // Create the lesson
      await createLesson(id, lessonData);

      // Reset form state
      setIsModalOpen(false);
      setNewLesson({ title: '', description: '', scheduledDate: '', hasVideo: false, hasPresentation: false, hasTest: false });
      setVideoFile(null);
      setVideoLink('');
      setPresentationFile(null);
      setTestQuestions([]);

      // Revalidate data
      mutate();
    } catch (err) {
      console.error('Error creating lesson:', err);
      setError('Ошибка при создании урока');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p>Для просмотра учебного плана необходимо авторизоваться</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-2 text-sm text-yellow-600 hover:text-yellow-500"
          >
            Перейти на страницу входа
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (fetchError || error) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error || 'Ошибка при загрузке учебного плана'}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBack}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Вернуться к списку учебных планов
            </button>
            {fetchError && (
              <button
                onClick={() => mutate()}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Попробовать снова
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!studyPlan) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p>Учебный план не найден</p>
          <button
            onClick={handleBack}
            className="mt-2 text-sm text-yellow-600 hover:text-yellow-500"
          >
            Вернуться к списку учебных планов
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" />
          Назад к списку планов
        </button>
        {canCreateLesson && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-corporate-primary text-white px-6 py-2 rounded-lg font-semibold shadow-xs hover:bg-corporate-primary-dark transition"
          >
            + Создать урок
          </button>
        )}
      </div>

      {/* Модальное окно создания урока */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg animate-fadeIn flex flex-col">
            <div className="px-8 pt-8 pb-2">
              <div className="text-2xl font-extrabold mb-6 text-corporate-primary">Создать новый урок</div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-2" style={{ maxHeight: '70vh' }}>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Название урока</label>
                  <input
                    className="input-filter w-full text-base px-4 py-2 rounded-lg border border-gray-200 focus:border-corporate-primary focus:ring-2 focus:ring-corporate-primary/20 transition shadow-xs"
                    placeholder="Введите название урока"
                    value={newLesson.title}
                    onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Описание урока</label>
                  <textarea
                    className="input-filter w-full min-h-[70px] text-base px-4 py-2 rounded-lg border border-gray-200 focus:border-corporate-primary focus:ring-2 focus:ring-corporate-primary/20 transition shadow-xs"
                    placeholder="Кратко опишите содержание урока"
                    value={newLesson.description}
                    onChange={e => setNewLesson({ ...newLesson, description: e.target.value })}
                  />
                  <button
                    className="mt-2 px-4 py-1 rounded-xs bg-corporate-primary/10 text-corporate-primary font-semibold hover:bg-corporate-primary/20 text-sm transition"
                    type="button"
                    onClick={() => setNewLesson({ ...newLesson, description: `В этом уроке рассматриваются основные понятия и методы по теме \"${newLesson.title || '...'}\". Урок включает теорию, примеры и практические задания для закрепления материала.` })}
                  >
                    Сгенерировать описание
                  </button>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Дата и время проведения</label>
                  <input
                    className="input-filter w-full text-base px-4 py-2 rounded-lg border border-gray-200 focus:border-corporate-primary focus:ring-2 focus:ring-corporate-primary/20 transition shadow-xs"
                    type="datetime-local"
                    value={newLesson.scheduledDate}
                    onChange={e => setNewLesson({ ...newLesson, scheduledDate: e.target.value })}
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mt-2">
                  <div className="font-semibold text-corporate-primary mb-2">Видео</div>
                  <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={videoType === 'link'} onChange={() => setVideoType('link')} />
                      <span>Ссылка</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={videoType === 'file'} onChange={() => setVideoType('file')} />
                      <span>Загрузить файл</span>
                    </label>
                  </div>
                  {videoType === 'link' ? (
                    <input
                      className="input-filter w-full text-base px-4 py-2 rounded-lg border border-gray-200 focus:border-corporate-primary focus:ring-2 focus:ring-corporate-primary/20 transition shadow-xs"
                      placeholder="Ссылка на видео (YouTube, Vimeo и т.д.)"
                      value={videoLink}
                      onChange={e => setVideoLink(e.target.value)}
                    />
                  ) : (
                    <input
                      className="input-filter w-full text-base px-4 py-2 rounded-lg border border-gray-200 focus:border-corporate-primary focus:ring-2 focus:ring-corporate-primary/20 transition shadow-xs"
                      type="file"
                      accept="video/*"
                      onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    />
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="font-semibold text-corporate-primary mb-2">Презентация</div>
                  <input
                    className="input-filter w-full text-base px-4 py-2 rounded-lg border border-gray-200 focus:border-corporate-primary focus:ring-2 focus:ring-corporate-primary/20 transition shadow-xs"
                    type="file"
                    accept=".pdf,.ppt,.pptx,.odp"
                    onChange={e => setPresentationFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="font-semibold text-corporate-primary mb-2">Тест</div>
                  <button
                    className="px-4 py-1 rounded-xs bg-corporate-primary/10 text-corporate-primary font-semibold hover:bg-corporate-primary/20 transition"
                    onClick={() => setTestModalOpen(true)}
                  >
                    {testQuestions.length > 0 ? `Вопросов: ${testQuestions.length}` : 'Создать тест'}
                  </button>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-2px_8px_0_rgba(0,0,0,0.04)] px-8 py-4 flex gap-4 justify-end z-10">
              <button
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-200 shadow-xs transition"
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-corporate-primary text-white font-semibold shadow-xs hover:bg-corporate-primary-dark transition disabled:opacity-50"
                onClick={handleCreateLesson}
                disabled={!newLesson.title.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="inline w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Создать'
                )}
              </button>
            </div>
            {/* Модалка создания теста */}
            {testModalOpen && (
              <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fadeIn">
                  <div className="text-lg font-bold mb-2">Добавить вопрос</div>
                  <input
                    className="input-filter w-full mb-2"
                    placeholder="Вопрос"
                    value={currentQuestion.question}
                    onChange={e => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  />
                  {currentQuestion.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 mb-1 items-center">
                      <input
                        className="input-filter flex-1"
                        placeholder={`Вариант ${idx + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...currentQuestion.options];
                          newOpts[idx] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOpts });
                        }}
                      />
                      <input
                        type="radio"
                        checked={currentQuestion.correct === idx}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correct: idx })}
                      />
                      <span className="text-xs">Правильный</span>
                      {currentQuestion.options.length > 2 && (
                        <button className="text-red-500 ml-2" onClick={() => {
                          setCurrentQuestion({
                            ...currentQuestion,
                            options: currentQuestion.options.filter((_, i) => i !== idx),
                            correct: currentQuestion.correct >= idx ? Math.max(0, currentQuestion.correct - 1) : currentQuestion.correct
                          });
                        }}>✕</button>
                      )}
                    </div>
                  ))}
                  <button
                    className="text-blue-600 text-xs mb-2"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, options: [...currentQuestion.options, ''] })}
                  >+ Добавить вариант</button>
                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      className="px-4 py-1 rounded-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                      onClick={() => setTestModalOpen(false)}
                    >
                      Закрыть
                    </button>
                    <button
                      className="px-4 py-1 rounded-xs bg-corporate-primary text-white font-semibold hover:bg-corporate-primary-dark"
                      onClick={() => {
                        if (!currentQuestion.question.trim() || currentQuestion.options.some(opt => !opt.trim())) return;
                        setTestQuestions([...testQuestions, currentQuestion]);
                        setCurrentQuestion({ question: '', options: ['', ''], correct: 0 });
                      }}
                      disabled={!currentQuestion.question.trim() || currentQuestion.options.some(opt => !opt.trim())}
                    >
                      Добавить вопрос
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="font-semibold mb-2">Вопросы:</div>
                    {testQuestions.length === 0 && <div className="text-gray-400">Нет вопросов</div>}
                    {testQuestions.map((q, idx) => (
                      <div key={idx} className="mb-2 p-2 border rounded-xs">
                        <div className="font-medium">{q.question}</div>
                        <ul className="ml-4 list-disc">
                          {q.options.map((opt: string, i: number) => (
                            <li key={i} className={q.correct === i ? 'text-green-600 font-semibold' : ''}>{opt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
        {studyPlan.lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Пока нет уроков. Создайте первый урок, нажав на кнопку "Создать урок".
          </div>
        ) : (
          studyPlan.lessons.map((lesson: LessonCard) => (
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
                  {lesson.homework && (
                    <div className="mt-2 text-green-700 text-sm">
                      Домашнее задание: {lesson.homework.name}
                    </div>
                  )}
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
          ))
        )}
      </div>
    </div>
  );
};

export default StudyPlanDetailPage; 