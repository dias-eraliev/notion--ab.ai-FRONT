import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { ClassroomDto } from '../api/classrooms.api';
import { TeacherDto } from '../api/teachers.api';
import { GroupDto } from '../api/groups.api';
import { CreateScheduleDto, ScheduleDto } from '../api/schedule.api';
import { LessonDto } from '../api/educational-plans.api';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleItem: CreateScheduleDto) => void;
  schedule?: ScheduleDto;
  classrooms: ClassroomDto[];
  teachers: TeacherDto[];
  groups: GroupDto[];
  lessons: LessonDto[];
  selectedPlanId?: number;
  isLoading?: boolean;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schedule,
  classrooms,
  teachers,
  groups,
  lessons,
  selectedPlanId,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<CreateScheduleDto>>({
    day: 'monday',
    startTime: '08:00',
    endTime: '08:45',
    subject: '',
    teacherId: '',
    type: 'lesson',
    repeat: 'weekly',
    classroomId: 0,
    groupId: 0,
    lessonId: 0
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        subject: schedule.subject,
        teacherId: schedule.teacherId,
        type: schedule.type,
        repeat: schedule.repeat,
        comment: schedule.comment,
        classroomId: schedule.classroomId,
        groupId: schedule.groupId,
        lessonId: schedule.lessonId || 0
      });
    } else if (groups && groups.length > 0) {
      // Set default group when adding new schedule
      setFormData(prevFormData => ({
        ...prevFormData,
        groupId: groups[0].id
      }));
    }

    // Set default lesson if available
    if (lessons && lessons.length > 0 && !schedule) {
      setFormData(prevFormData => ({
        ...prevFormData,
        lessonId: lessons[0].id,
        subject: lessons[0].name // Set the subject from the lesson
      }));
    }
  }, [schedule, groups, lessons]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'lessonId' && value) {
      const selectedLesson = lessons.find(lesson => lesson.id === Number(value));
      if (selectedLesson) {
        setFormData({
          ...formData,
          lessonId: Number(value),
          subject: selectedLesson.name // Auto-update subject when lesson changes
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: name === 'classroomId' || name === 'groupId' || name === 'lessonId' ? Number(value) : value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all required fields have proper values before saving
    const dataToSave = {
      ...formData,
      groupId: formData.groupId || (groups && groups.length > 0 ? groups[0].id : 0),
      classroomId: Number(formData.classroomId) || 0,
      lessonId: Number(formData.lessonId) || 0
    } as CreateScheduleDto;

    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {schedule ? 'Редактировать занятие' : 'Добавить занятие'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                День недели
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="monday">Понедельник</option>
                <option value="tuesday">Вторник</option>
                <option value="wednesday">Среда</option>
                <option value="thursday">Четверг</option>
                <option value="friday">Пятница</option>
                <option value="saturday">Суббота</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа
              </label>
              <select
                name="groupId"
                value={formData.groupId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Выберите группу</option>
                {groups?.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                required
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
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Занятие (из учебного плана)
            </label>
            <select
              name="lessonId"
              value={formData.lessonId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Выберите занятие</option>
              {lessons?.map(lesson => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Преподаватель
              </label>
              <select
                name="teacherId"
                value={formData.teacherId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Выберите преподавателя</option>
                {teachers?.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.surname} {teacher.name}
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
                value={formData.classroomId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Выберите аудиторию</option>
                {classrooms?.map(classroom => (
                  <option
                    key={classroom.id}
                    value={classroom.id}
                    disabled={!classroom.isFree && formData.classroomId !== classroom.id}
                  >
                    {classroom.name} {!classroom.isFree && formData.classroomId !== classroom.id ? '(занято)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип занятия
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="lesson">Урок</option>
                <option value="consultation">Консультация</option>
                <option value="extra">Доп. занятие</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Повторение
              </label>
              <select
                name="repeat"
                value={formData.repeat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="weekly">Еженедельно</option>
                <option value="biweekly">Раз в 2 недели</option>
                <option value="once">Единожды</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий
            </label>
            <textarea
              name="comment"
              value={formData.comment || ''}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Дополнительная информация о занятии"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleModal; 