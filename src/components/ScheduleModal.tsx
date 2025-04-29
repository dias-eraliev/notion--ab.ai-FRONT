import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { ScheduleDto } from '../api/schedule';
import { ClassroomDto } from '../api/classrooms.api';
import { GroupDto } from '../api/groups.api';
import { useStudyPlansByGroup, useStudyPlanLessons, Lesson } from '../api/studyPlans';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  schedule?: ScheduleDto;
  classrooms: ClassroomDto[];
  groups: GroupDto[];
  studyPlans: { id: number; name: string }[];
  selectedGroupId?: number;
  isLoading: boolean;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schedule,
  classrooms,
  groups,
  studyPlans,
  selectedGroupId,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    day: 'monday',
    startTime: '08:00',
    endTime: '09:30',
    type: 'lesson',
    repeat: 'weekly',
    comment: '',
    classroomId: 0,
    studyPlanId: 0,
    lessonId: 0
  });

  // Fetch study plans for the selected group
  const {
    studyPlans: apiStudyPlans,
    isLoading: studyPlansLoading,
    isError: studyPlansError
  } = useStudyPlansByGroup(selectedGroupId);

  // Fetch lessons for the selected study plan
  const {
    lessons: apiLessons,
    isLoading: lessonsLoading,
    isError: lessonsError
  } = useStudyPlanLessons(formData.studyPlanId);

  // Track available lessons
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);

  const daysOfWeek = [
    { value: 'monday', label: 'Понедельник' },
    { value: 'tuesday', label: 'Вторник' },
    { value: 'wednesday', label: 'Среда' },
    { value: 'thursday', label: 'Четверг' },
    { value: 'friday', label: 'Пятница' },
    { value: 'saturday', label: 'Суббота' }
  ];

  const typeOptions = [
    { value: 'lesson', label: 'Урок' },
    { value: 'consultation', label: 'Консультация' },
    { value: 'extra', label: 'Доп. занятие' }
  ];

  const repeatOptions = [
    { value: 'weekly', label: 'Еженедельно' },
    { value: 'biweekly', label: 'Раз в две недели' },
    { value: 'once', label: 'Один раз' }
  ];

  // Update available lessons when API data changes
  useEffect(() => {
    if (apiLessons) {
      setAvailableLessons(apiLessons);
    }
  }, [apiLessons]);

  // Initialize form data when modal opens or schedule changes
  useEffect(() => {
    if (schedule) {
      // For existing schedule, we need to set both the subject and IDs
      setFormData({
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        type: schedule.type,
        repeat: schedule.repeat,
        comment: schedule.comment || '',
        classroomId: schedule.classroomId,
        studyPlanId: 0, // Would need to be determined from backend data
        lessonId: 0 // Would need to be determined from backend data
      });
    } else {
      // Reset form for new schedule
      const initialStudyPlanId = apiStudyPlans && apiStudyPlans.length > 0
        ? apiStudyPlans[0].id
        : 0;

      setFormData({
        day: 'monday',
        startTime: '08:00',
        endTime: '09:30',
        type: 'lesson',
        repeat: 'weekly',
        comment: '',
        classroomId: classrooms.length > 0 ? classrooms[0].id : 0,
        studyPlanId: initialStudyPlanId,
        lessonId: 0
      });
    }
  }, [schedule, classrooms, apiStudyPlans]);

  // Reset lessonId when study plan changes
  useEffect(() => {
    if (formData.studyPlanId && apiLessons && apiLessons.length > 0) {
      if (!apiLessons.some(l => l.id === formData.lessonId)) {
        setFormData(prev => ({
          ...prev,
          lessonId: 0,
        }));
      }
    }
  }, [formData.studyPlanId, apiLessons]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Convert numeric values to number
    if (name === 'classroomId' || name === 'studyPlanId' || name === 'lessonId') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Подготавливаем данные, включая studyPlanId и lessonId
    const formDataToSave = {
      ...formData,
      // Добавляем studyPlanId только если он выбран
      ...(formData.studyPlanId ? { studyPlanId: formData.studyPlanId } : {}),
      // Добавляем lessonId только если он выбран
      ...(formData.lessonId ? { lessonId: formData.lessonId } : {})
    };

    onSave(formDataToSave);
  };

  // Modal animation
  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const isComponentLoading = isLoading || studyPlansLoading || lessonsLoading;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'visible' : 'invisible'
        }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {schedule ? 'Редактировать расписание' : 'Добавить расписание'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isComponentLoading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Day & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                День
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading}
              >
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время начала
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время окончания
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading}
              />
            </div>
          </div>

          {/* Study Plan & Lesson Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Учебный план
              </label>
              <select
                name="studyPlanId"
                value={formData.studyPlanId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading || !apiStudyPlans || apiStudyPlans.length === 0}
              >
                <option value="">Выберите учебный план</option>
                {apiStudyPlans?.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              {studyPlansLoading && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <FaSpinner className="animate-spin mr-2" />
                  Загрузка учебных планов...
                </div>
              )}
              {studyPlansError && (
                <div className="mt-1 text-sm text-red-500">
                  Ошибка при загрузке учебных планов
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Занятие
              </label>
              <select
                name="lessonId"
                value={formData.lessonId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading || !formData.studyPlanId || !apiLessons || apiLessons.length === 0}
              >
                <option value="">Выберите занятие</option>
                {availableLessons?.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                  </option>
                ))}
              </select>
              {lessonsLoading && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <FaSpinner className="animate-spin mr-2" />
                  Загрузка занятий...
                </div>
              )}
              {lessonsError && (
                <div className="mt-1 text-sm text-red-500">
                  Ошибка при загрузке занятий
                </div>
              )}
            </div>
          </div>

          {/* Type & Classroom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип занятия
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading}
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Аудитория
              </label>
              <select
                name="classroomId"
                value={formData.classroomId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading}
              >
                <option value="">Выберите аудиторию</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} {classroom.isFree ? '(свободна)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Repeat & Comment Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Повторение
              </label>
              <select
                name="repeat"
                value={formData.repeat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isComponentLoading}
              >
                {repeatOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Комментарий
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={1}
                disabled={isComponentLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-xs text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isComponentLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-xs text-sm font-medium text-white hover:bg-blue-700"
              disabled={isComponentLoading}
            >
              {isComponentLoading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Загрузка...
                </span>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleModal; 