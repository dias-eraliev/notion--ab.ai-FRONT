import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR, { mutate } from 'swr';
import {
  FaBook,
  FaUpload,
  FaDownload,
  FaCheck,
  FaTimes,
  FaClock,
  FaComment,
  FaPaperclip,
  FaPlus,
  FaExclamationTriangle,
  FaFilter,
  FaSearch,
  FaUser,
  FaUsers,
  FaStar,
  FaSpinner
} from 'react-icons/fa';
import { useAuth, AuthPayload } from '../contexts/AuthContext';
import { homeworkApi } from '../api';
import { HomeworkResponse, CreateHomeworkDto } from '../api/homework.api';
import { toast } from 'react-toastify';

// Updated Homework interface to match backend data structure
interface Homework {
  id: number;
  name: string;
  description: string | null;
  deadline: string | null;
  date: string | null;
  createdAt: string;
  updatedAt: string;
  lessonId: number;
  materialId: number | null;
  // Derived fields
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  attachments: {
    id: string;
    name: string;
    type: string;
  }[];
  // Lesson info
  Lesson?: {
    id: number;
    name: string;
    description: string;
    syllabusId: number;
    date: string;
    Syllabus?: {
      id: number;
      name: string;
      description: string;
      teacherId: number;
      group?: Array<{
        id: number;
        name: string;
      }>;
      teacher?: {
        id: number;
        name: string;
        surname: string;
      };
    };
  };
  // Material info
  material?: {
    id: number;
    name: string;
    videoUrl: string | null;
    lecture: string | null;
    presentationUrl: string | null;
    quizId: number | null;
    Quiz?: {
      id: number;
      name: string;
      description: string;
      questions?: Array<{
        id: number;
        question: string;
        answers?: Array<{
          id: number;
          answer: string;
          isCorrect: boolean;
        }>;
      }>;
    };
  };
  // Submission and feedback
  grade?: number;
  feedback?: string;
  submission?: {
    files: {
      id: string;
      name: string;
      type: string;
    }[];
    comment?: string;
    submittedAt?: string;
  };
}

// Function to convert backend data to our frontend model
const mapHomeworkResponseToHomework = (homework: any): Homework => {
  // Calculate status based on deadline, submissions, etc.
  let status: Homework['status'] = 'pending';
  const now = new Date();

  if (homework.deadline) {
    const deadline = new Date(homework.deadline);
    if (now > deadline) {
      status = 'overdue';
    }
  }

  // Construct attachments array from various material types
  const attachments: Homework['attachments'] = [];
  if (homework.material) {
    if (homework.material.videoUrl) {
      attachments.push({
        id: `video-${homework.material.id}`,
        name: 'Video',
        type: 'video'
      });
    }
    if (homework.material.lecture) {
      attachments.push({
        id: `lecture-${homework.material.id}`,
        name: homework.material.name || 'Lecture',
        type: 'document'
      });
    }
    if (homework.material.presentationUrl) {
      attachments.push({
        id: `presentation-${homework.material.id}`,
        name: 'Presentation',
        type: 'presentation'
      });
    }
  }

  return {
    ...homework,
    status,
    attachments
  };
};

// Компонент для отображения статуса задания
const StatusBadge: React.FC<{ status: Homework['status'] }> = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Ожидает выполнения';
      case 'submitted':
        return 'На проверке';
      case 'graded':
        return 'Проверено';
      case 'overdue':
        return 'Просрочено';
      default:
        return status;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle()}`}>
      {getStatusText()}
    </span>
  );
};

interface HomeworkModalData {
  title: string;
  description: string;
  deadline: string;
  date: string;
  lessonId: string;
  groupId: string;
  studyPlanId: string;
  materialType: string;
  materialContent: string;
  materialUrl: string;
  hasQuiz: boolean;
  quizTitle: string;
  quizDescription: string;
  questions: Array<{
    question: string;
    options: string[];
    correctOption: number;
    answers?: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
}

// Fix the formatDate helper to handle null values properly
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Не указано';

  try {
    // Cast to any first to bypass TypeScript's strict type checking
    const date = new Date(dateString as any);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Неверный формат даты';
  }
};

const formatDateShort = (dateString: string | null): string => {
  if (!dateString) return 'Не указано';

  try {
    // Cast to any first to bypass TypeScript's strict type checking
    const date = new Date(dateString as any);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Неверный формат даты';
  }
};

// Модальное окно для создания/редактирования задания
const HomeworkModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Partial<HomeworkModalData>;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { payload } = useAuth();

  // Extract groups and syllabuses from the payload
  const userGroups = payload?.profile?.group || payload?.profile?.groups || [];
  const userSyllabuses = payload?.profile?.Syllabus || [];

  // Create a state for lessons based on selected syllabus
  const [availableLessons, setAvailableLessons] = useState<any[]>([]);

  // Update the initialFormData to match the questions interface
  const [formData, setFormData] = useState<HomeworkModalData>({
    title: '',
    description: '',
    deadline: '',
    date: '',
    lessonId: '',
    groupId: '',
    studyPlanId: '',
    materialType: 'text',
    materialContent: '',
    materialUrl: '',
    hasQuiz: false,
    quizTitle: '',
    quizDescription: '',
    questions: [{
      question: '',
      options: ['', '', '', ''],
      correctOption: 0,
      answers: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    }]
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // When syllabus changes, fetch available lessons
  useEffect(() => {
    if (formData.studyPlanId) {
      // In a real implementation, you would fetch lessons for the selected studyPlan
      // For now, we'll simulate with mock data
      setAvailableLessons([
        { id: 1, name: 'Урок 1: Введение' },
        { id: 2, name: 'Урок 2: Основные концепции' },
        { id: 3, name: 'Урок 3: Практическое применение' }
      ]);
    } else {
      setAvailableLessons([]);
    }
  }, [formData.studyPlanId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, {
        question: '', options: ['', '', '', ''], correctOption: 0, answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }]
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Upload files if any
      let materialUrl = formData.materialUrl;

      if (selectedFiles.length > 0 && formData.materialType) {
        const file = selectedFiles[0];
        const response = await homeworkApi.uploadFile(file);
        materialUrl = response.data.url;
      }

      // Prepare data for submission based on backend structure
      const homeworkData: Partial<CreateHomeworkDto> = {
        Lesson: {
          connect: {
            id: parseInt(formData.lessonId)
          }
        },
        name: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        date: formData.date
      };

      // Add material if appropriate
      if (formData.materialType || materialUrl) {
        homeworkData.material = {
          create: {
            type: formData.materialType,
            content: formData.materialContent,
            url: materialUrl
          }
        };

        // Add quiz if enabled
        if (formData.hasQuiz && homeworkData.material?.create) {
          homeworkData.material.create.Quiz = {
            create: {
              title: formData.quizTitle,
              description: formData.quizDescription,
              questions: {
                create: formData.questions.map(q => ({
                  question: q.question,
                  options: q.options,
                  correctOption: q.correctOption
                }))
              }
            }
          };
        }
      }

      onSubmit(homeworkData);
    } catch (error) {
      console.error('Error submitting homework:', error);
      toast.error('Ошибка при создании задания');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {initialData ? 'Редактировать задание' : 'Новое задание'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Учебный план
              </label>
              <select
                value={formData.studyPlanId}
                onChange={(e) => setFormData({ ...formData, studyPlanId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Выберите учебный план</option>
                {userSyllabuses.map(syllabus => (
                  <option key={syllabus.id} value={syllabus.id}>
                    {syllabus.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа
              </label>
              <select
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Выберите группу</option>
                {userGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Урок
              </label>
              <select
                value={formData.lessonId}
                onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={!formData.studyPlanId}
              >
                <option value="">Выберите урок</option>
                {availableLessons.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                  </option>
                ))}
              </select>
              {!formData.studyPlanId && (
                <p className="text-sm text-gray-500 mt-1">
                  Сначала выберите учебный план
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата создания
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Срок сдачи
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип материала
              </label>
              <select
                value={formData.materialType}
                onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Без материала</option>
                <option value="document">Документ</option>
                <option value="video">Видео</option>
                <option value="presentation">Презентация</option>
                <option value="link">Ссылка</option>
              </select>
            </div>

            {formData.materialType === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL материала
                </label>
                <input
                  type="url"
                  value={formData.materialUrl}
                  onChange={(e) => setFormData({ ...formData, materialUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/resource"
                />
              </div>
            )}

            {['document', 'video', 'presentation'].includes(formData.materialType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Загрузить файл
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Загрузить файл</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">или перетащите его сюда</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formData.materialType === 'document' ? 'PDF, DOCX до 10MB' :
                        formData.materialType === 'video' ? 'MP4, AVI до 100MB' :
                          'PPT, PPTX до 20MB'}
                    </p>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 text-sm text-gray-900">
                        Выбрано: {selectedFiles[0].name} ({(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="hasQuiz"
                checked={formData.hasQuiz}
                onChange={(e) => setFormData({ ...formData, hasQuiz: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasQuiz" className="text-sm font-medium text-gray-700">
                Добавить тест
              </label>
            </div>

            {formData.hasQuiz && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-lg">Информация о тесте</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название теста
                  </label>
                  <input
                    type="text"
                    value={formData.quizTitle}
                    onChange={(e) => setFormData({ ...formData, quizTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={formData.hasQuiz}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание теста
                  </label>
                  <textarea
                    value={formData.quizDescription}
                    onChange={(e) => setFormData({ ...formData, quizDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">Вопросы</h5>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200"
                    >
                      Добавить вопрос
                    </button>
                  </div>

                  {formData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border p-4 rounded-md space-y-3">
                      <div className="flex justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Вопрос {qIndex + 1}
                        </label>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Текст вопроса"
                        required={formData.hasQuiz}
                      />

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Варианты ответов
                        </label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctOption === oIndex}
                              onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                              placeholder={`Вариант ${oIndex + 1}`}
                              required={formData.hasQuiz}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isUploading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-1"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Загрузка...</span>
                </>
              ) : (
                <span>Сохранить</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Обновленное модальное окно для просмотра задания
const HomeworkDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  homework: Homework;
  onSubmit?: (files: File[], comment: string) => void;
}> = ({ isOpen, onClose, homework, onSubmit }) => {
  const { payload } = useAuth();
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const getTimeRemaining = () => {
    const now = new Date();
    if (!homework.deadline) return 'Срок не установлен';
    const due = new Date(homework.deadline);
    const diff = due.getTime() - now.getTime();

    if (diff < 0) return 'Срок сдачи истек';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}д ${hours}ч ${minutes}м`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{homework.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <FaBook className="mr-1" />
                {homework.Lesson?.name || 'Урок'}
              </span>
              <span className="flex items-center">
                <FaUser className="mr-1" />
                {homework.Lesson?.Syllabus?.teacher?.name}
              </span>
              <span className="flex items-center">
                <FaUsers className="mr-1" />
                {homework.Lesson?.Syllabus?.group?.map(g => g.name).join(', ') || 'Группа'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Срок сдачи</div>
            <div className="font-medium text-blue-700">
              {homework.deadline ? new Date(homework.deadline).toLocaleString() : 'Срок не установлен'}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Осталось: {getTimeRemaining()}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Статус</div>
            <StatusBadge status={homework.status} />
            {homework.grade && (
              <div className="text-sm text-green-600 mt-1">
                Оценка: {homework.grade}
              </div>
            )}
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          <h4 className="text-lg font-medium mb-2">Описание задания</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            {homework.description}
          </div>
        </div>

        {/* Display material content */}
        {homework.material && (
          <div className="prose max-w-none mb-6">
            <h4 className="text-lg font-medium mb-2">Материал урока</h4>

            {/* Tab implementation */}
            {(() => {
              const [activeTab, setActiveTab] = useState('lecture');
              
              // Count available tabs
              const hasMaterial = {
                lecture: !!homework.material.lecture,
                video: !!homework.material.videoUrl,
                presentation: !!homework.material.presentationUrl,
                quiz: !!(homework.material.Quiz && homework.material.Quiz.questions && homework.material.Quiz.questions.length > 0)
              };
              
              // If no tabs are available, show the no materials message
              if (!Object.values(hasMaterial).some(Boolean)) {
                return (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 italic">Нет дополнительных материалов</p>
                  </div>
                );
              }
              
              // Set the first available tab as active
              useEffect(() => {
                for (const [key, value] of Object.entries(hasMaterial)) {
                  if (value) {
                    setActiveTab(key);
                    break;
                  }
                }
              }, []);
              
              return (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {/* Tab navigation */}
                  <div className="flex border-b">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'lecture' ? 'bg-white border-blue-500 text-blue-600 border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
                      onClick={() => setActiveTab('lecture')}
                    >
                      Текст
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'video' ? 'bg-white border-blue-500 text-blue-600 border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
                      onClick={() => setActiveTab('video')}
                    >
                      Видео
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'presentation' ? 'bg-white border-blue-500 text-blue-600 border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
                      onClick={() => setActiveTab('presentation')}
                    >
                      Презентация
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'quiz' ? 'bg-white border-blue-500 text-blue-600 border-b-2' : 'text-gray-600 hover:text-gray-800'}`}
                      onClick={() => setActiveTab('quiz')}
                    >
                      Тест
                    </button>
                  </div>
                  
                  {/* Tab content */}
                  <div className="p-4">
                    {/* Lecture tab */}
                    {activeTab === 'lecture' && (
                      <div>
                        {homework.material.lecture ? (
                          <>
                            <h5 className="font-medium mb-2">{homework.material.name || "Текстовый материал"}</h5>
                            <div className="whitespace-pre-wrap">{homework.material.lecture}</div>
                          </>
                        ) : (
                          <p className="text-gray-600 italic">Текстовый материал недоступен</p>
                        )}
                      </div>
                    )}
                    
                    {/* Video tab */}
                    {activeTab === 'video' && (
                      <div>
                        {homework.material.videoUrl ? (
                          <>
                            <h5 className="font-medium mb-2">Видео материал</h5>
                            <div className="aspect-w-16 aspect-h-9">
                              <iframe 
                                src={homework.material.videoUrl} 
                                className="w-full h-64 rounded" 
                                allowFullScreen
                                title="Video material"
                              ></iframe>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-600 italic">Видео материал недоступен</p>
                        )}
                      </div>
                    )}
                    
                    {/* Presentation tab */}
                    {activeTab === 'presentation' && (
                      <div>
                        {homework.material.presentationUrl ? (
                          <>
                            <h5 className="font-medium mb-2">Презентация</h5>
                            <a 
                              href={homework.material.presentationUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              <FaDownload className="mr-2" />
                              Скачать презентацию
                            </a>
                          </>
                        ) : (
                          <p className="text-gray-600 italic">Презентация недоступна</p>
                        )}
                      </div>
                    )}
                    
                    {/* Quiz tab */}
                    {activeTab === 'quiz' && (
                      <div>
                        {homework.material.Quiz && homework.material.Quiz.questions && homework.material.Quiz.questions.length > 0 ? (
                          <>
                            <h5 className="font-medium mb-2">Тест: {homework.material.Quiz.name}</h5>
                            <p className="mb-2 text-gray-700">{homework.material.Quiz.description}</p>
                            
                            <div className="space-y-4 mt-3">
                              {homework.material.Quiz.questions.map((question, idx) => (
                                <div key={question.id} className="border border-gray-200 p-3 rounded">
                                  <p className="font-medium mb-2">{idx + 1}. {question.question}</p>
                                  
                                  {question.answers && (
                                    <div className="pl-4 space-y-1">
                                      {question.answers.map((answer) => (
                                        <div key={answer.id} className="flex items-center">
                                          <input
                                            type="radio"
                                            id={`answer-${answer.id}`}
                                            name={`question-${question.id}`}
                                            className="mr-2"
                                            disabled
                                          />
                                          <label htmlFor={`answer-${answer.id}`}>{answer.answer}</label>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-600 italic">Тест недоступен</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {homework.attachments.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Материалы</h4>
            <div className="space-y-2">
              {homework.attachments.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FaPaperclip className="text-gray-400 mr-2" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {file.type}
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600">
                    <FaDownload className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(payload?.role === 'student' && homework.status === 'pending') && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium mb-4">Сдать задание</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий к работе
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Опишите выполненную работу..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Прикрепить файлы
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Загрузить файлы</span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={(e) => setFiles(Array.from(e.target.files || []))}
                        />
                      </label>
                      <p className="pl-1">или перетащите их сюда</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      До 10 файлов, максимум 50MB каждый
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => onSubmit?.(files, comment)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Сдать задание
                </button>
              </div>
            </div>
          </div>
        )}

        {homework.submission && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium mb-4">Сданная работа</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">
                  Сдано {new Date(homework.submission.submittedAt!).toLocaleString()}
                </div>
                {homework.submission.comment && (
                  <div className="mt-2">{homework.submission.comment}</div>
                )}
              </div>

              <div className="space-y-2">
                {homework.submission.files.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FaPaperclip className="text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {file.type}
                        </div>
                      </div>
                    </div>
                    <button className="text-blue-500 hover:text-blue-600">
                      <FaDownload className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {homework.grade && homework.feedback && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium mb-4">Оценка</h4>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {homework.grade}
                  </div>
                </div>
                <div className="flex-1 ml-6">
                  <div className="text-sm text-gray-500 mb-1">Комментарий преподавателя</div>
                  <div>{homework.feedback}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const HomeworkPage: React.FC = () => {
  const { payload } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    groupId: null as number | null,
    studyPlanId: null as number | null
  });

  // Extract groups and syllabuses from the payload
  const userGroups = payload?.profile?.group || payload?.profile?.groups || [];
  const userSyllabuses = payload?.profile?.Syllabus || [];

  // Set default filters when payload changes
  useEffect(() => {
    if (payload?.role) {
      // Initialize with default filters based on role
      if (payload.role === 'student' && payload.profile && payload.profile.group && payload.profile.group[0]) {
        // Student sees only their own group's homework
        setFilters(prev => ({
          ...prev,
          groupId: payload.profile?.group?.[0]?.id || null,
        }));
      }
      // For teachers with assigned syllabuses
      else if (payload.role === 'teacher' && userSyllabuses.length > 0) {
        setFilters(prev => ({
          ...prev,
          studyPlanId: userSyllabuses[0].id,
          // If syllabus has groups, set first group as default
          groupId: userSyllabuses[0].group && userSyllabuses[0].group.length > 0
            ? userSyllabuses[0].group[0].id
            : null
        }));
      }
    }
  }, [payload, userGroups, userSyllabuses]);

  // Fetch homework data using SWR
  const { data: homeworkData, error, isLoading } = useSWR(
    filters.groupId && filters.studyPlanId
      ? `/homework?groupId=${filters.groupId}&studyPlanId=${filters.studyPlanId}`
      : null,
    () => filters.groupId && filters.studyPlanId
      ? homeworkApi.getAll(Number(filters.groupId), Number(filters.studyPlanId))
      : null
  );

  // Create, update and delete homework
  const createHomework = async (data: any) => {
    try {
      await homeworkApi.create(data);
      toast.success('Задание успешно создано');
      // Revalidate the data
      mutate(`/homework?groupId=${filters.groupId}&studyPlanId=${filters.studyPlanId}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating homework:', error);
      toast.error('Ошибка при создании задания');
    }
  };

  const updateHomework = async (id: number, data: any) => {
    try {
      await homeworkApi.update(id, data);
      toast.success('Задание успешно обновлено');
      // Revalidate the data
      mutate(`/homework?groupId=${filters.groupId}&studyPlanId=${filters.studyPlanId}`);
    } catch (error) {
      console.error('Error updating homework:', error);
      toast.error('Ошибка при обновлении задания');
    }
  };

  const deleteHomework = async (id: number) => {
    try {
      await homeworkApi.delete(id);
      toast.success('Задание успешно удалено');
      // Revalidate the data
      mutate(`/homework?groupId=${filters.groupId}&studyPlanId=${filters.studyPlanId}`);
    } catch (error) {
      console.error('Error deleting homework:', error);
      toast.error('Ошибка при удалении задания');
    }
  };

  // Function to filter homeworks
  const getFilteredHomeworks = () => {
    if (isLoading) return [];
    if (error) {
      console.error('Error loading homework:', error);
      return [];
    }

    let homeworks: Homework[] = homeworkData ?
      homeworkData.map(mapHomeworkResponseToHomework) :
      [];

    // Apply status filter if selected
    if (filters.status) {
      homeworks = homeworks.filter(hw => hw.status === filters.status);
    }

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      homeworks = homeworks.filter(hw =>
        hw.name.toLowerCase().includes(search) ||
        (hw.description?.toLowerCase() || '').includes(search)
      );
    }

    return homeworks;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {payload?.role === 'student' ? 'Мои задания' :
            payload?.role === 'parent' ? 'Задания ребенка' :
              payload?.role === 'teacher' ? 'Управление заданиями' :
                'Все задания'}
        </h1>

        {(payload?.role === 'teacher' || payload?.role === 'admin') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <FaPlus className="mr-2" />
            Новое задание
          </button>
        )}
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <select
          value={filters.groupId?.toString() || ''}
          onChange={(e) => setFilters({ ...filters, groupId: e.target.value ? Number(e.target.value) : null })}
          className="w-full px-4 py-2 border border-gray-200 rounded-md"
        >
          <option value="">Все группы</option>
          {userGroups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>

        <select
          value={filters.studyPlanId?.toString() || ''}
          onChange={(e) => setFilters({ ...filters, studyPlanId: e.target.value ? Number(e.target.value) : null })}
          className="w-full px-4 py-2 border border-gray-200 rounded-md"
        >
          <option value="">Все учебные планы</option>
          {userSyllabuses.map(syllabus => (
            <option key={syllabus.id} value={syllabus.id}>{syllabus.name}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-md"
        >
          <option value="">Все статусы</option>
          <option value="pending">Ожидает выполнения</option>
          <option value="submitted">На проверке</option>
          <option value="graded">Проверено</option>
          <option value="overdue">Просрочено</option>
        </select>

        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Поиск по заданиям..."
            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-md"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-blue-500 mr-2" />
          <span>Загрузка заданий...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Ошибка!</strong>
          <span className="block sm:inline"> Не удалось загрузить задания. Пожалуйста, попробуйте позже.</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && getFilteredHomeworks().length === 0 && (
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-10 rounded text-center">
          <FaExclamationTriangle className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-medium mb-2">Нет доступных заданий</h3>
          <p className="text-gray-600">
            {filters.search || filters.status
              ? 'Попробуйте изменить параметры фильтрации'
              : 'Задания еще не были созданы'}
          </p>
        </div>
      )}

      {/* Список заданий */}
      {!isLoading && !error && getFilteredHomeworks().length > 0 && (
        <div className="space-y-4">
          {getFilteredHomeworks().map(homework => (
            <div
              key={homework.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      {homework.Lesson?.Syllabus?.name}
                    </span>
                    <StatusBadge status={homework.status} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{homework.name}</h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">{homework.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      Срок: {homework.deadline ? new Date(homework.deadline).toLocaleDateString() : 'Срок не установлен'}
                    </span>
                    {homework.grade && (
                      <span className="flex items-center text-green-600">
                        <FaStar className="mr-1" />
                        Оценка: {homework.grade}
                      </span>
                    )}
                    <span className="flex items-center">
                      <FaUser className="mr-1" />
                      {homework.Lesson?.Syllabus?.teacher?.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedHomework(homework)}
                    className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-md"
                  >
                    Подробнее
                  </button>
                  {(payload.role === 'admin' ||
                    (payload.role === 'teacher' && homework.Lesson?.Syllabus?.teacher?.id === payload.id)) && (
                      <button
                        onClick={() => deleteHomework(homework.id)}
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        Удалить
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальные окна */}
      <AnimatePresence>
        {isModalOpen && (
          <HomeworkModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={createHomework}
          />
        )}
        {selectedHomework && (
          <HomeworkDetailsModal
            isOpen={true}
            onClose={() => setSelectedHomework(null)}
            homework={selectedHomework}
            onSubmit={(files, comment) => {
              console.log('Homework submission:', { files, comment });
              setSelectedHomework(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeworkPage; 