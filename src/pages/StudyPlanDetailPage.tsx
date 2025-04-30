import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaVideo, FaFile, FaClipboardCheck, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import useSWR from 'swr';
import { createLesson, studyPlanKey, type Lesson, type CreateLessonDto } from '../api/studyPlans';
import { useAuth } from '../contexts/AuthContext';
import { fetcher } from '@/api/index';
import CreateLessonModal from '@/components/studyPlans/lessons/CreateLessonModal';

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
  const { payload } = useAuth();
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
    id && studyPlanKey(id),
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
      <CreateLessonModal
        studyPlanId={Number(id)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={mutate} />
    </div>
  );
};

export default StudyPlanDetailPage; 