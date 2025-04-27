import React, { useState, useEffect } from 'react';
import { FaFilter, FaCalendar, FaSpinner } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../api/groups.api';
import { useTeachers } from '../api/teachers.api';
import { useClassrooms } from '../api/classrooms.api';
import {
  useSchedulesByGroup,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  ScheduleDto,
  CreateScheduleDto
} from '../api/schedule.api';
import { useStudyPlansByGroup, useLessonsByPlan, SyllabusDto } from '../api/educational-plans.api';
import ScheduleModal from '../components/ScheduleModal';
import DaySchedule from '../components/DaySchedule';

const SchedulePage: React.FC = () => {
  const { payload: { role } } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);
  const [selectedPlanId, setSelectedPlanId] = useState<number | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  // Control flags for data fetching
  const [shouldFetchTeachers, setShouldFetchTeachers] = useState(false);
  const [shouldFetchClassrooms, setShouldFetchClassrooms] = useState(false);

  // Fetch groups data
  const { groups, isLoading: isLoadingGroups } = useGroups();

  // Always call the hooks, but conditionally fetch data
  const { teachers, isLoading: isLoadingTeachers } = useTeachers();
  const { classrooms, isLoading: isLoadingClassrooms } = useClassrooms();

  // Fetch schedule data for selected group
  const {
    schedules,
    isLoading: isLoadingSchedules,
    mutate: reloadSchedules
  } = useSchedulesByGroup(selectedGroupId);

  // Fetch study plans for selected group
  const {
    studyPlans,
    isLoading: isLoadingPlans
  } = useStudyPlansByGroup(selectedGroupId);

  // Fetch lessons for selected study plan
  const {
    lessons,
    isLoading: isLoadingLessons
  } = useLessonsByPlan(selectedPlanId);

  // Set initial group based on user role
  useEffect(() => {
    if (groups && groups.length > 0) {
      if (role === 'STUDENT' || role === 'PARENT') {
        // For students and parents, we would typically set their associated group
        // For now, just set the first group
        setSelectedGroupId(groups[0].id);
      } else if (!selectedGroupId) {
        // For other roles, set the first group as default if none is selected
        setSelectedGroupId(groups[0].id);
      }
    }
  }, [groups, role, selectedGroupId]);

  // Reset selected plan when group changes
  useEffect(() => {
    setSelectedPlanId(undefined);
  }, [selectedGroupId]);

  // Set default study plan if available
  useEffect(() => {
    if (studyPlans && studyPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(studyPlans[0].id);
    }
  }, [studyPlans, selectedPlanId]);

  // Effect to control data fetching when modal opens/closes
  useEffect(() => {
    // This effect is now only for tracking modal state changes, not for triggering fetches
    // as we're now always calling the hooks
  }, [isModalOpen]);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Group schedules by day
  const schedulesByDay = schedules ? daysOfWeek.reduce((acc, day) => {
    acc[day] = schedules.filter(schedule => schedule.day === day);
    return acc;
  }, {} as Record<string, ScheduleDto[]>) : {};

  // Title based on role
  const getPageTitle = () => {
    switch (role) {
      case 'STUDENT':
        return 'Моё расписание';
      case 'PARENT':
        return 'Расписание занятий';
      case 'TEACHER':
        return 'Мои занятия';
      default:
        return 'Управление расписанием';
    }
  };

  const handleAddSchedule = (day: string) => {
    // Make sure all required data is loaded before opening the modal
    if (!groups || groups.length === 0) {
      alert('Ошибка: Не удалось загрузить группы');
      return;
    }

    if (!selectedGroupId) {
      alert('Пожалуйста, выберите группу');
      return;
    }

    if (!selectedPlanId) {
      alert('Пожалуйста, выберите учебный план');
      return;
    }

    // Clear any previous schedule data
    setCurrentSchedule(undefined);
    // Set the selected day
    setSelectedDay(day);
    // Open the modal
    setIsModalOpen(true);
  };

  const handleEditSchedule = (schedule: ScheduleDto) => {
    setCurrentSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это занятие?')) {
      setIsLoading(true);
      try {
        await deleteSchedule(scheduleId);
        reloadSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Произошла ошибка при удалении занятия');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveSchedule = async (data: CreateScheduleDto) => {
    setIsLoading(true);
    try {
      if (currentSchedule) {
        // Update existing schedule
        await updateSchedule(currentSchedule.id, data);
      } else {
        // Create new schedule
        if (!selectedGroupId) {
          throw new Error('Группа не выбрана');
        }

        if (!selectedDay) {
          throw new Error('День не выбран');
        }

        const newSchedule: CreateScheduleDto = {
          ...data,
          day: selectedDay,
          groupId: selectedGroupId
        };

        await createSchedule(newSchedule);
      }
      await reloadSchedules();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      alert(`Произошла ошибка при сохранении занятия: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if only groups are loading (initial state)
  const isPageLoading = isLoadingGroups;

  // Only show schedule loading when a group is selected
  const isScheduleLoading = selectedGroupId && isLoadingSchedules;

  // Only consider teachers and classrooms loading when modal is open
  const isModalDataLoading = isModalOpen && (isLoadingTeachers || isLoadingClassrooms);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header and Filter Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {getPageTitle()}
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
                disabled={isPageLoading || role === 'STUDENT' || role === 'PARENT'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              >
                <option value="">Выберите группу</option>
                {groups?.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Study Plan Filter */}
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Учебный план
              </label>
              <select
                value={selectedPlanId || ''}
                onChange={(e) => setSelectedPlanId(e.target.value ? Number(e.target.value) : undefined)}
                disabled={isLoadingPlans || !selectedGroupId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              >
                <option value="">Выберите учебный план</option>
                {studyPlans?.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
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

      {/* Loading State - Only show for initial load */}
      {isPageLoading ? (
        <div className="py-12 flex justify-center">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : (
        <>
          {/* No Group Selected */}
          {!selectedGroupId ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-lg text-gray-600">
                Выберите группу, чтобы просмотреть расписание
              </p>
            </div>
          ) : !selectedPlanId ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-lg text-gray-600">
                Выберите учебный план, чтобы просмотреть расписание
              </p>
            </div>
          ) : (
            /* Days of Week Schedule */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loading state for schedules */}
              {isScheduleLoading ? (
                <div className="col-span-2 py-12 flex justify-center">
                  <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                </div>
              ) : (
                daysOfWeek.map(day => (
                  <DaySchedule
                    key={day}
                    day={day}
                    schedules={schedulesByDay[day] || []}
                    onAddClick={handleAddSchedule}
                    onEditClick={handleEditSchedule}
                    onDeleteClick={handleDeleteSchedule}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ScheduleModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setCurrentSchedule(undefined);
            }}
            onSave={handleSaveSchedule}
            schedule={currentSchedule}
            classrooms={classrooms || []}
            teachers={teachers || []}
            groups={groups || []}
            lessons={lessons || []}
            selectedPlanId={selectedPlanId}
            isLoading={isLoading || isModalDataLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchedulePage; 