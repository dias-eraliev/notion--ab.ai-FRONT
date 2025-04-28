import React, { useState } from 'react';
import { FaCalendar, FaSpinner } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import ScheduleModal from '../components/ScheduleModal';
import DaySchedule from '../components/DaySchedule';

// Mock data
const mockGroups = [
  { id: 1, name: 'Группа 1' },
  { id: 2, name: 'Группа 2' },
  { id: 3, name: 'Группа 3' }
];

const mockStudyPlans = [
  { id: 1, name: 'Учебный план 1' },
  { id: 2, name: 'Учебный план 2' }
];

const mockSchedules = [
  {
    id: 1,
    day: 'monday',
    startTime: '08:00',
    endTime: '09:30',
    subject: 'Математика',
    teacherId: 'Петров И.И.',
    type: 'lesson',
    repeat: 'weekly',
    classroomId: 101,
    groupId: 1,
    classroom: { id: 101, name: '101', isFree: false }
  },
  {
    id: 2,
    day: 'monday',
    startTime: '10:00',
    endTime: '11:30',
    subject: 'Физика',
    teacherId: 'Иванов А.А.',
    type: 'lesson',
    repeat: 'weekly',
    classroomId: 102,
    groupId: 1,
    classroom: { id: 102, name: '102', isFree: false }
  },
  {
    id: 3,
    day: 'tuesday',
    startTime: '08:00',
    endTime: '09:30',
    subject: 'Химия',
    teacherId: 'Сидорова Е.В.',
    type: 'lesson',
    repeat: 'weekly',
    classroomId: 201,
    groupId: 1,
    classroom: { id: 201, name: '201', isFree: false }
  }
];

// Mock data for teachers and classrooms
const mockTeachers = [
  { id: 1, name: 'Иван', surname: 'Петров' },
  { id: 2, name: 'Елена', surname: 'Иванова' }
];

const mockClassrooms = [
  { id: 101, name: '101', isFree: true },
  { id: 102, name: '102', isFree: true },
  { id: 201, name: '201', isFree: true }
];

const SchedulePage: React.FC = () => {
  // UI state
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<any>(undefined);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Group schedules by day
  const schedulesByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = mockSchedules.filter(schedule => schedule.day === day);
    return acc;
  }, {} as Record<string, typeof mockSchedules>);

  // Handler functions (empty implementation)
  const handleAddSchedule = (day: string) => {
    setSelectedDay(day);
    setCurrentSchedule(undefined);
    setIsModalOpen(true);
  };

  const handleEditSchedule = (schedule: any) => {
    setCurrentSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    console.log('Delete schedule', scheduleId);
  };

  const handleSaveSchedule = (data: any) => {
    console.log('Save schedule', data);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header and Filter Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Управление расписанием
        </h1>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap items-center gap-4">
            {/* Group Filter */}
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа
              </label>
              <select
                value={selectedGroupId || ''}
                onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Выберите группу</option>
                {mockGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex justify-end">
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-gray-400" />
                <span className="text-gray-500">Расписание на неделю</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!selectedGroupId ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-lg text-gray-600">
            Выберите группу, чтобы просмотреть расписание
          </p>
        </div>
      ) : (
        /* Days of Week Schedule */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {daysOfWeek.map(day => (
            <DaySchedule
              key={day}
              day={day}
              schedules={schedulesByDay[day] || []}
              onAddClick={handleAddSchedule}
              onEditClick={handleEditSchedule}
              onDeleteClick={handleDeleteSchedule}
            />
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ScheduleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveSchedule}
            schedule={currentSchedule}
            classrooms={mockClassrooms}
            teachers={mockTeachers}
            groups={mockGroups}
            studyPlans={mockStudyPlans}
            selectedGroupId={selectedGroupId}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchedulePage; 