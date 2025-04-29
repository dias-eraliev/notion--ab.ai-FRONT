import React, { useState } from 'react';
import { FaSearch, FaCaretDown, FaTimes, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import useSWR from 'swr';
import { useAuth } from '../contexts/AuthContext';
import { getGrades, getGradesForGroup, createLessonGrade, createHomeworkGrade, calculateAverageGrade, saveGrade } from '../api/grades.api';
import { createAttendance } from '../api/attendance.api';
import { getStudyPlans } from '../api/studyPlans';
import { getGroups } from '../api/subjects.api';

// Define the types for our data
interface GradeItem {
    id: number;
    value: number;
    date: string;
    comment?: string;
    createdAt?: string;
    isAbsent?: boolean;
}

interface StudentGrade {
    classwork?: GradeItem;
    homework?: GradeItem;
    average?: number;
    lessonId?: number;
    homeworkId?: number;
    isAbsent?: boolean;
}

interface Student {
    id: number;
    name: string;
    grades: {
        [date: string]: StudentGrade | null;
    };
}

interface AttendanceInfo {
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    comment?: string;
}

interface GradeInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        date: string;
        classwork?: GradeItem;
        homework?: GradeItem;
        average?: number;
    };
}

interface GradeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: number;
    lessonId?: number;
    homeworkId?: number;
    date: string;
    initialData?: {
        classwork?: GradeItem;
        homework?: GradeItem;
        attendance?: AttendanceInfo;
    };
    onSave: (classworkGrade: GradeItem | null, homeworkGrade: GradeItem | null, attendance: AttendanceInfo | null) => void;
}

// Modal to view grade information
const GradeInfoModal: React.FC<GradeInfoModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-[500px] shadow-xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Информация об оценках</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Оценки на {data.date}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border p-3 rounded-md bg-gray-50">
                            <h4 className="font-semibold">Классная работа</h4>
                            {data.classwork?.isAbsent ? (
                                <p className="text-red-500 font-semibold">Отсутствовал</p>
                            ) : data.classwork ? (
                                <>
                                    <p>Оценка: {data.classwork.value}</p>
                                    {data.classwork.comment && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Комментарий: {data.classwork.comment}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">Не оценено</p>
                            )}
                        </div>
                        <div className="border p-3 rounded-md bg-gray-50">
                            <h4 className="font-semibold">Домашняя работа</h4>
                            {data.homework?.isAbsent ? (
                                <p className="text-red-500 font-semibold">Отсутствовал</p>
                            ) : data.homework ? (
                                <>
                                    <p>Оценка: {data.homework.value}</p>
                                    {data.homework.comment && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Комментарий: {data.homework.comment}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">Не оценено</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                        <p className="font-medium">Средний балл: {data.average?.toFixed(1) || 'Н/Д'}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Закрыть
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Modal to edit grade information
const GradeEditModal: React.FC<GradeEditModalProps> = ({
    isOpen, onClose, studentId, lessonId, homeworkId, date, initialData, onSave
}) => {
    const [classworkGrade, setClassworkGrade] = useState<GradeItem>({
        value: initialData?.classwork?.value || 0,
        date: initialData?.classwork?.date || '',
        id: initialData?.classwork?.id || 0,
        comment: initialData?.classwork?.comment || '',
        createdAt: initialData?.classwork?.createdAt || ''
    });
    const [homeworkGrade, setHomeworkGrade] = useState<GradeItem>({
        value: initialData?.homework?.value || 0,
        date: initialData?.homework?.date || '',
        id: initialData?.homework?.id || 0,
        comment: initialData?.homework?.comment || '',
        createdAt: initialData?.homework?.createdAt || ''
    });
    const [isAbsent, setIsAbsent] = useState<boolean>(initialData?.attendance?.status === 'ABSENT');
    const [absenceReason, setAbsenceReason] = useState<string>(initialData?.attendance?.comment || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const attendance = isAbsent ?
            { status: 'ABSENT' as const, comment: absenceReason } :
            { status: 'PRESENT' as const };

        if (isAbsent) {
            onSave(null, null, attendance);
        } else {
            onSave(classworkGrade, homeworkGrade, attendance);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-[500px]"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Редактирование оценок ({date})</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Attendance section */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                            <input
                                type="checkbox"
                                id="absent"
                                checked={isAbsent}
                                onChange={(e) => setIsAbsent(e.target.checked)}
                                className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="absent" className="text-sm font-medium text-gray-700">
                                Отсутствовал
                            </label>
                        </div>

                        {isAbsent && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Причина отсутствия <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={absenceReason}
                                    onChange={(e) => setAbsenceReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    required={isAbsent}
                                    placeholder="Укажите причину отсутствия"
                                />
                            </div>
                        )}
                    </div>

                    {/* Classwork section */}
                    <div className={`mb-6 p-4 border border-gray-200 rounded-lg ${isAbsent ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h4 className="text-md font-medium mb-3">Классная работа</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Оценка
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={classworkGrade.value}
                                    onChange={(e) => setClassworkGrade({ ...classworkGrade, value: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    disabled={isAbsent}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Дата
                                </label>
                                <input
                                    type="date"
                                    value={classworkGrade.date}
                                    onChange={(e) => setClassworkGrade({ ...classworkGrade, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    disabled={isAbsent}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Комментарий
                                </label>
                                <textarea
                                    value={classworkGrade.comment || ''}
                                    onChange={(e) => setClassworkGrade({ ...classworkGrade, comment: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    disabled={isAbsent}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Homework section */}
                    <div className={`mb-6 p-4 border border-gray-200 rounded-lg ${isAbsent ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h4 className="text-md font-medium mb-3">Домашняя работа</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Оценка
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={homeworkGrade.value}
                                    onChange={(e) => setHomeworkGrade({ ...homeworkGrade, value: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    disabled={isAbsent}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Дата
                                </label>
                                <input
                                    type="date"
                                    value={homeworkGrade.date}
                                    onChange={(e) => setHomeworkGrade({ ...homeworkGrade, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    disabled={isAbsent}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Комментарий
                                </label>
                                <textarea
                                    value={homeworkGrade.comment || ''}
                                    onChange={(e) => setHomeworkGrade({ ...homeworkGrade, comment: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    disabled={isAbsent}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Define fetcher functions for SWR
const fetchStudyPlans = async () => {
    const response = await getStudyPlans();
    return response.data || [];
};

const fetchGroups = async () => {
    return await getGroups();
};

const fetchGrades = async (url: string) => {
    if (!url) return null;
    const [role, groupId, syllabusId] = url.split(';');

    if (role === 'student') {
        if (!syllabusId) return null;
        return await getGrades(parseInt(syllabusId));
    } else {
        if (!groupId || !syllabusId) return null;
        return await getGradesForGroup(parseInt(groupId), parseInt(syllabusId));
    }
};

// Main JournalPage component
const JournalPage: React.FC = () => {
    const { payload } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [selectedSyllabus, setSelectedSyllabus] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [dates, setDates] = useState<string[]>([]);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedGradeInfo, setSelectedGradeInfo] = useState<{
        studentId: number;
        date: string;
        lessonId?: number;
        homeworkId?: number;
        data?: {
            classwork?: GradeItem;
            homework?: GradeItem;
            average?: number;
        };
    } | null>(null);

    // SWR for groups
    const {
        data: groups = [],
        error: groupsError,
        isLoading: isGroupsLoading
    } = useSWR('groups', fetchGroups);

    // SWR for study plans
    const {
        data: studyPlans = [],
        error: studyPlansError,
        isLoading: isStudyPlansLoading
    } = useSWR('study-plans', fetchStudyPlans);

    // SWR for grades data
    const gradesKey = selectedGroup || selectedSyllabus
        ? `${payload.role};${selectedGroup};${selectedSyllabus}`
        : null;

    const {
        data: gradesData,
        error: gradesError,
        isLoading: isGradesLoading,
        mutate: mutateGrades
    } = useSWR(gradesKey, fetchGrades);

    // Process grades data
    const students = React.useMemo(() => {
        if (!gradesData) return [];

        // First create a map of all students
        const studentMap = new Map<number, Student>();

        // First pass: collect all students from lessons with grades
        gradesData.forEach((lessonData: any) => {
            const lesson = {
                id: lessonData.id,
                name: lessonData.name,
                date: lessonData.date
            };

            // Check if this lesson has a grade
            if (lessonData.Grade) {
                const grade = lessonData.Grade;
                const student = grade.Student;

                if (!studentMap.has(student.id)) {
                    studentMap.set(student.id, {
                        id: student.id,
                        name: `${student.surname || ''} ${student.name || ''}`.trim(),
                        grades: {}
                    });
                }

                const currentStudent = studentMap.get(student.id)!;
                const lessonDate = lesson.date ? format(parseISO(lesson.date), 'dd.MM') : 'Н/Д';

                // Store grade for this student on this date
                currentStudent.grades[lessonDate] = {
                    classwork: grade.lessonGrade !== undefined && grade.lessonGrade !== null ? {
                        id: grade.lessonGradeId,
                        value: grade.lessonGrade,
                        date: grade.createdAt ? format(parseISO(grade.createdAt), 'dd.MM.yyyy') : '',
                        isAbsent: grade.lessonGrade === null
                    } : undefined,
                    homework: grade.homeworkGrade !== undefined && grade.homeworkGrade !== null ? {
                        id: grade.homeworkGradeId,
                        value: grade.homeworkGrade,
                        date: grade.updatedAt ? format(parseISO(grade.updatedAt), 'dd.MM.yyyy') : '',
                        isAbsent: grade.homeworkGrade === null
                    } : undefined,
                    average: grade.averageGrade !== undefined && grade.averageGrade !== null ?
                        grade.averageGrade :
                        calculateAverageGrade(grade.lessonGrade, grade.homeworkGrade),
                    lessonId: lesson.id,
                    homeworkId: grade.homeworkId
                };
            }
        });

        // If we don't have any students yet (no grades assigned), let's try to extract them
        // from elsewhere in the app state (this would need to be implemented)
        if (studentMap.size === 0 && payload.role === 'teacher') {
            // You might need to implement a way to get student list from elsewhere
            // For example, from a separate API call or context
        }

        // Second pass: add empty grade placeholders for all lessons for all students
        if (studentMap.size > 0) {
            gradesData.forEach((lessonData: any) => {
                const lesson = {
                    id: lessonData.id,
                    name: lessonData.name,
                    date: lessonData.date
                };

                const lessonDate = lesson.date ? format(parseISO(lesson.date), 'dd.MM') : 'Н/Д';

                studentMap.forEach(student => {
                    if (!student.grades[lessonDate]) {
                        student.grades[lessonDate] = {
                            classwork: undefined,
                            homework: undefined,
                            average: undefined,
                            lessonId: lesson.id,
                            homeworkId: undefined,
                            isAbsent: true
                        };
                    }
                });
            });
        }

        return Array.from(studentMap.values());
    }, [gradesData, payload.role]);

    // Extract and sort dates whenever students data changes
    React.useEffect(() => {
        if (students.length > 0) {
            const allDates = new Set<string>();
            students.forEach(student => {
                Object.keys(student.grades).forEach(date => {
                    allDates.add(date);
                });
            });

            // Sort dates chronologically
            const sortedDates = Array.from(allDates).sort((a, b) => {
                const [dayA, monthA] = a.split('.');
                const [dayB, monthB] = b.split('.');
                return new Date(2024, parseInt(monthA) - 1, parseInt(dayA)).getTime() -
                    new Date(2024, parseInt(monthB) - 1, parseInt(dayB)).getTime();
            });

            setDates(sortedDates);
        } else {
            setDates([]);
        }
    }, [students]);

    // Handle click on a grade cell for viewing details
    const handleGradeClick = (studentId: number, date: string) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const gradeData = student.grades[date];
        if (gradeData) {
            setSelectedGradeInfo({
                studentId,
                date,
                data: {
                    classwork: gradeData.classwork,
                    homework: gradeData.homework,
                    average: gradeData.average
                }
            });
            setIsInfoModalOpen(true);
        }
    };

    // Handle adding a grade
    const handleAddGradeClick = (studentId: number, date: string) => {
        // Find the student
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        // Find lesson ID from the date
        const lessonWithDate = gradesData.find((lesson: any) => {
            if (!lesson.date) return false;
            const lessonDate = format(parseISO(lesson.date), 'dd.MM');
            return lessonDate === date;
        });

        if (!lessonWithDate) {
            console.error('No lesson found for date:', date);
            return;
        }

        // Set up information for the modal
        setSelectedGradeInfo({
            studentId,
            date,
            lessonId: lessonWithDate.id,
            homeworkId: student.grades[date]?.homeworkId,
            data: student.grades[date] || undefined
        });

        setIsEditModalOpen(true);
    };

    // Handle saving grades and attendance
    const handleGradeSave = async (
        classworkGrade: GradeItem | null,
        homeworkGrade: GradeItem | null,
        attendance: AttendanceInfo | null
    ) => {
        if (!selectedGradeInfo) return;

        try {
            const { studentId, lessonId, homeworkId } = selectedGradeInfo;

            // Create/update grade record
            if (lessonId) {
                await saveGrade({
                    studentId,
                    lessonId,
                    homeworkId,
                    // If student is absent, don't send grades
                    ...(attendance?.status === 'ABSENT' ? {
                        isAbsent: true,
                        absenceReason: attendance.comment
                    } : {
                        lessonGrade: classworkGrade?.value,
                        homeworkGrade: homeworkGrade?.value,
                        lessonGradeComment: classworkGrade?.comment,
                        homeworkGradeComment: homeworkGrade?.comment,
                        isAbsent: false
                    })
                });
            }

            // Refresh grades data
            mutateGrades();
        } catch (err) {
            console.error('Error saving grade:', err);
        }
    };

    // Function to get display name from object
    const getDisplayName = (item: any) => {
        return item.title || item.name || `Item ${item.id}`;
    };

    // Function to get the display for a grade value (adding support for absent)
    const getGradeDisplay = (grade: StudentGrade | null | undefined) => {
        if (!grade) return '-';
        if (grade.isAbsent) return 'Н';
        if (grade.average !== undefined) return grade.average.toFixed(1);
        return '-';
    };

    // Determine the color for grade display based on value
    const getGradeColor = (value: number, isAbsent?: boolean) => {
        if (isAbsent) return 'bg-gray-500'; // Серый цвет для пропущенных занятий
        if (value >= 85) return 'bg-green-500';
        if (value >= 70) return 'bg-blue-500';
        if (value >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Filter students by search query
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if user can edit grades
    const canEditGrades = () => {
        console.log('User role:', payload?.role);
        return payload?.role === 'admin' || payload?.role === 'teacher' || payload?.role === 'ADMIN' || payload?.role === 'TEACHER';
    };

    // Combined loading state
    const isLoading = isGroupsLoading || isStudyPlansLoading || isGradesLoading;

    // Combined error state
    const error = groupsError || studyPlansError || gradesError;

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {payload.role === 'student' ? 'Мои оценки' :
                        payload.role === 'parent' ? 'Оценки ребенка' :
                            payload.role === 'teacher' ? 'Журнал успеваемости' :
                                'Электронный журнал'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xs mb-4">
                    Ошибка при загрузке данных
                </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Group filter (not shown for students) */}
                {payload.role !== 'student' && (
                    <div className="relative">
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 appearance-none"
                            disabled={isLoading}
                        >
                            <option value="">Выберите группу</option>
                            {groups.map((group: any) => (
                                <option key={group.id} value={group.id.toString()}>
                                    {getDisplayName(group)}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <FaCaretDown className="text-gray-400" />
                        </div>
                    </div>
                )}

                {/* Study Plan filter */}
                <div className="relative">
                    <select
                        value={selectedSyllabus}
                        onChange={(e) => setSelectedSyllabus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 appearance-none"
                        disabled={isLoading}
                    >
                        <option value="">Выберите учебный план</option>
                        {studyPlans.map((plan: any) => (
                            <option key={plan.id} value={plan.id.toString()}>
                                {getDisplayName(plan)}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <FaCaretDown className="text-gray-400" />
                    </div>
                </div>

                {/* Search input */}
                <div className="relative">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Поиск по имени"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-l-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button className="px-4 py-2 bg-white border border-l-0 border-gray-200 rounded-r-md hover:bg-gray-50">
                            <FaSearch className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading indicator */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                /* Grades table */
                <div className="bg-white rounded-lg shadow-xs overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 border-b border-r border-gray-200 min-w-[200px]">
                                        Студент
                                    </th>
                                    {dates.map((date) => (
                                        <th
                                            key={date}
                                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] border-b border-r border-gray-200 bg-gray-50"
                                        >
                                            {date}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredStudents.length > 0 ? filteredStudents.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-200 ${index !== filteredStudents.length - 1 ? 'border-b' : ''}`}>
                                            {student.name}
                                        </td>
                                        {dates.map((date) => {
                                            console.log(`Cell for student ${student.id}, date ${date}:`, student.grades[date]);

                                            return (
                                                <td key={date} className={`px-6 py-4 text-center border-r border-gray-200 ${index !== filteredStudents.length - 1 ? 'border-b' : ''}`}>
                                                    <div className="flex items-center justify-center">
                                                        {student.grades[date] ? (
                                                            <div className="relative group">
                                                                {student.grades[date]?.isAbsent ? (
                                                                    // Отображение для пропуска
                                                                    <button
                                                                        onClick={() => handleGradeClick(student.id, date)}
                                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-red-500 font-bold border-2 border-red-300 hover:bg-red-50 transition-colors"
                                                                    >
                                                                        Н
                                                                    </button>
                                                                ) : student.grades[date]?.average !== undefined ? (
                                                                    // Обычное отображение оценки
                                                                    <button
                                                                        onClick={() => handleGradeClick(student.id, date)}
                                                                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-medium ${getGradeColor(student.grades[date]!.average || 0)} hover:opacity-90 transition-opacity`}
                                                                    >
                                                                        {student.grades[date]!.average.toFixed(1)}
                                                                    </button>
                                                                ) : canEditGrades() && (
                                                                    <button
                                                                        onClick={() => handleAddGradeClick(student.id, date)}
                                                                        className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors"
                                                                        title="Добавить оценку"
                                                                    >
                                                                        <FaPlus />
                                                                    </button>
                                                                )}

                                                                {/* Tooltip on hover */}
                                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                                                    <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                                                                        {student.grades[date]?.isAbsent && (
                                                                            <div className="font-bold text-red-400">Отсутствовал</div>
                                                                        )}
                                                                        {student.grades[date]?.classwork && !student.grades[date]?.isAbsent && (
                                                                            <div>Классная работа: {student.grades[date]!.classwork.value}</div>
                                                                        )}
                                                                        {student.grades[date]?.homework && !student.grades[date]?.isAbsent && (
                                                                            <div>Домашняя работа: {student.grades[date]!.homework.value}</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="border-8 border-transparent border-t-gray-900 absolute left-1/2 transform -translate-x-1/2 -bottom-2"></div>
                                                                </div>
                                                            </div>
                                                        ) : canEditGrades() && (
                                                            <button
                                                                onClick={() => handleAddGradeClick(student.id, date)}
                                                                className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors"
                                                                title="Добавить оценку"
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={dates.length + 1} className="px-6 py-4 text-center text-gray-500">
                                            {selectedGroup && selectedSyllabus ?
                                                "Нет данных для отображения" :
                                                "Выберите группу и предмет для отображения данных"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Grade Info Modal */}
            <AnimatePresence>
                {isInfoModalOpen && selectedGradeInfo && selectedGradeInfo.data && (
                    <GradeInfoModal
                        isOpen={isInfoModalOpen}
                        onClose={() => {
                            setIsInfoModalOpen(false);
                            setSelectedGradeInfo(null);
                        }}
                        data={{
                            date: selectedGradeInfo.date,
                            classwork: selectedGradeInfo.data.classwork,
                            homework: selectedGradeInfo.data.homework,
                            average: selectedGradeInfo.data.average
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Grade Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedGradeInfo && (
                    <GradeEditModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedGradeInfo(null);
                        }}
                        studentId={selectedGradeInfo.studentId}
                        lessonId={selectedGradeInfo.lessonId}
                        homeworkId={selectedGradeInfo.homeworkId}
                        date={selectedGradeInfo.date}
                        initialData={selectedGradeInfo.data}
                        onSave={handleGradeSave}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default JournalPage;
