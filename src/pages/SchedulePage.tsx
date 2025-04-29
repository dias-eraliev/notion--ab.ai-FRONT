import React, {useEffect, useState} from 'react';
import {FaSpinner} from 'react-icons/fa';
import {AnimatePresence} from 'framer-motion';
import ScheduleModal from '../components/ScheduleModal';
import DaySchedule from '../components/DaySchedule';
import {useSchedules, createSchedule, updateSchedule, deleteSchedule, ScheduleDto} from '../api/schedule';
import {useGroups, GroupDto} from '../api/groups.api';
import {useClassrooms} from '../api/classrooms.api';
import FilterToggleButtons from "@/components/FilterToggleButtons/FilterToggleButtons.components.tsx";
import {ScheduleRequests} from "@/api/Requests/Schedule.requests.ts";

// Mock study plans until we have an API for them
const mockStudyPlans = [
    {id: 1, name: 'Учебный план 1'},
    {id: 2, name: 'Учебный план 2'}
];

const ScheduleReq = new ScheduleRequests()

const SchedulePage: React.FC = () => {
    // UI state
    const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState<ScheduleDto | undefined>(undefined);
    const [schedule, setSchedule] = useState<Record<string, ScheduleDto[]>>({});


    // Data fetching with SWR
    const {groups, isLoading: groupsLoading, isError: groupsError} = useGroups();
    const {data: schedules, error: schedulesError, mutate: mutateSchedules} = useSchedules(selectedGroupId);
    const {classrooms, isLoading: classroomsLoading, isError: classroomsError} = useClassrooms();

    const isLoadingData = groupsLoading || classroomsLoading || (selectedGroupId && !schedules);
    const hasError = groupsError || classroomsError || schedulesError;

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const firstGroupId: number | undefined = groups?.[0]?.id;

    useEffect(() => {
        let isMounted = true;

        const fetchSchedule = async () => {
            if (!firstGroupId) return;

            try {
                const GetSchedule = await ScheduleReq.getScheduleAll(Number(firstGroupId));
                if (GetSchedule?.data) {
                    const groupedByDay = daysOfWeek.reduce((acc, day) => {
                        acc[day] = GetSchedule.data.filter((item: ScheduleDto) => item.day === day);
                        return acc;
                    }, {} as Record<string, ScheduleDto[]>);

                    console.log(groupedByDay);
                    if (isMounted) setSchedule(groupedByDay);
                } else {
                    console.error("No schedule data received.");
                }
            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        };

        fetchSchedule();

        return () => {
            isMounted = false;
        };
    }, [firstGroupId]);



    // Group schedules by day
    const schedulesByDay = daysOfWeek.reduce((acc, day) => {
        acc[day] = schedules?.filter(schedule => schedule.day === day) || [];
        return acc;
    }, {} as Record<string, ScheduleDto[]>);

    // Handler functions
    const handleAddSchedule = (day: string) => {
        setSelectedDay(day);
        setCurrentSchedule(undefined);
        setIsModalOpen(true);
    };

    const handleEditSchedule = (schedule: ScheduleDto) => {
        setCurrentSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleDeleteSchedule = async (scheduleId: number) => {
        if (!selectedGroupId) return;

        setIsLoading(true);
        try {
            await deleteSchedule(scheduleId, selectedGroupId);
            await mutateSchedules();
        } catch (error) {
            console.error('Failed to delete schedule', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSchedule = async (data: any) => {
        if (!selectedGroupId) return;

        setIsLoading(true);
        try {
            if (currentSchedule) {
                // Update existing schedule
                await updateSchedule(currentSchedule.id, {
                    ...data,
                    groupId: selectedGroupId
                });
            } else {
                // Create new schedule
                await createSchedule({
                    ...data,
                    groupId: selectedGroupId
                });
            }

            await mutateSchedules();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save schedule', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            {/* Header and Filter Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Управление расписанием
                    </h1>

                    <FilterToggleButtons/>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-wrap items-center gap-4">


                        {/*День недели*/}
                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                День недели
                            </label>
                            <select
                                value={selectedGroupId || ''}
                                onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                disabled={isLoadingData || !!hasError}
                            >
                                <option value="">День недели</option>
                                {groups?.map((group: GroupDto) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Group Filter */}
                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Группа
                            </label>
                            <select
                                value={selectedGroupId || ''}
                                onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                disabled={isLoadingData || !!hasError}
                            >
                                <option value="">Выберите группу</option>
                                {groups?.map((group: GroupDto) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/*Преподаватель*/}


                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Преподаватель
                            </label>
                            <select
                                value={selectedGroupId || ''}
                                onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                disabled={isLoadingData || !!hasError}
                            >
                                <option value="">Преподаватель</option>
                                {groups?.map((group: GroupDto) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/*Аудитория*/}

                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Аудитория
                            </label>
                            <select
                                value={selectedGroupId || ''}
                                onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                disabled={isLoadingData || !!hasError}
                            >
                                <option value="">Аудитория</option>
                                {groups?.map((group: GroupDto) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error state */}
            {hasError && (
                <div className="bg-red-50 p-4 rounded-lg shadow mb-6">
                    <p className="text-red-600">
                        Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
                    </p>
                </div>
            )}

            {/* Main Content */}
            {isLoadingData && !hasError ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <FaSpinner className="animate-spin text-gray-400 mx-auto mb-4 text-3xl"/>
                    <p className="text-lg text-gray-600">
                        Загрузка данных...
                    </p>
                </div>
            ) : !selectedGroupId ? (
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
                        classrooms={classrooms || []}
                        groups={groups || []}
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