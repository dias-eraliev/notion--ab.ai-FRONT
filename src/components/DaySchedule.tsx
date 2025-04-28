import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface DayScheduleProps {
    day: string;
    schedules: any[];
    onAddClick?: (day: string) => void;
    onEditClick?: (schedule: any) => void;
    onDeleteClick?: (scheduleId: number) => void;
}

const DaySchedule: React.FC<DayScheduleProps> = ({
    day,
    schedules,
    onAddClick,
    onEditClick,
    onDeleteClick
}) => {
    // Sort schedules by start time
    const sortedSchedules = [...schedules].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });

    const getDayTitle = (day: string) => {
        switch (day) {
            case 'monday': return 'Понедельник';
            case 'tuesday': return 'Вторник';
            case 'wednesday': return 'Среда';
            case 'thursday': return 'Четверг';
            case 'friday': return 'Пятница';
            case 'saturday': return 'Суббота';
            default: return day;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'lesson': return 'Урок';
            case 'consultation': return 'Консультация';
            case 'extra': return 'Доп. занятие';
            default: return type;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-blue-50">
                <h3 className="text-lg font-medium text-blue-800">{getDayTitle(day)}</h3>
                {onAddClick && (
                    <button
                        onClick={() => onAddClick(day)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                    >
                        <FaPlus className="mr-1" size={12} />
                        <span>Добавить</span>
                    </button>
                )}
            </div>

            {sortedSchedules.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                    Нет занятий на этот день
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {sortedSchedules.map((schedule) => (
                        <div key={schedule.id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex justify-between">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900">{schedule.subject}</span>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {getTypeLabel(schedule.type)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {schedule.startTime} - {schedule.endTime}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {onEditClick && (
                                        <button
                                            onClick={() => onEditClick(schedule)}
                                            className="p-1 text-gray-500 hover:text-blue-500"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                    {onDeleteClick && (
                                        <button
                                            onClick={() => onDeleteClick(schedule.id)}
                                            className="p-1 text-gray-500 hover:text-red-500"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                                <div className="text-gray-500">
                                    Аудитория: <span className="font-medium">{schedule.classroom?.name || schedule.classroomId}</span>
                                </div>
                                <div className="text-gray-500">
                                    Преподаватель: <span className="font-medium">{schedule.teacherId}</span>
                                </div>
                            </div>
                            {schedule.comment && (
                                <div className="mt-2 text-sm text-gray-600 italic">
                                    {schedule.comment}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DaySchedule; 