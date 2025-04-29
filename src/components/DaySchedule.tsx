import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { ScheduleDto } from '../api/schedule';

// Helper function to format day names
const formatDayName = (day: string): string => {
    const dayNames: Record<string, string> = {
        monday: 'Понедельник',
        tuesday: 'Вторник',
        wednesday: 'Среда',
        thursday: 'Четверг',
        friday: 'Пятница',
        saturday: 'Суббота',
        sunday: 'Воскресенье',
    };
    return dayNames[day] || day;
};

interface DayScheduleProps {
    day: string;
    schedules: ScheduleDto[];
    onAddClick: (day: string) => void;
    onEditClick: (schedule: ScheduleDto) => void;
    onDeleteClick: (scheduleId: number) => void;
}

const DaySchedule: React.FC<DayScheduleProps> = ({
    day,
    schedules,
    onAddClick,
    onEditClick,
    onDeleteClick,
}) => {
    // Sort schedules by start time
    const sortedSchedules = [...schedules].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <div className="bg-white rounded-lg shadow-xs overflow-hidden">
            {/* Day Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{formatDayName(day)}</h3>
                <button
                    onClick={() => onAddClick(day)}
                    className="p-1 rounded-full hover:bg-blue-500 transition"
                    title="Добавить расписание"
                >
                    <FaPlus />
                </button>
            </div>

            {/* Schedules List */}
            <div className="divide-y divide-gray-100">
                {sortedSchedules.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        Нет занятий
                    </div>
                ) : (
                    sortedSchedules.map((schedule) => (
                        <motion.div
                            key={schedule.id}
                            className="p-4 hover:bg-gray-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex justify-between">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{schedule.subject}</div>
                                    
                                    <div className="text-sm text-gray-600 mt-1">
                                        {schedule.startTime} - {schedule.endTime}
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 mt-1">
                                        {/* Display classroom name */}
                                        {schedule.classroom && `Аудитория: ${schedule.classroom.name}`}
                                    </div>
                                    
                                    <div className="text-sm text-gray-600">
                                        {/* Display teacher name if available */}
                                        {schedule.lesson?.Syllabus?.teacher && 
                                            `Преподаватель: ${schedule.lesson.Syllabus.teacher.surname} ${schedule.lesson.Syllabus.teacher.name}`}
                                    </div>

                                    {schedule.comment && (
                                        <div className="text-sm text-gray-500 mt-1 italic">
                                            {schedule.comment}
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-2 items-start">
                                    <button
                                        onClick={() => onEditClick(schedule)}
                                        className="p-1 text-blue-600 hover:text-blue-800 transition"
                                        title="Редактировать"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onDeleteClick(schedule.id)}
                                        className="p-1 text-red-600 hover:text-red-800 transition"
                                        title="Удалить"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DaySchedule; 