import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaEnvelope, FaPhone, FaSearch} from 'react-icons/fa';
import api from "@/api";
import {Group} from "@/types/group.entity.ts";
import {IStudent} from "@/Interfeces/Student.interface.ts";
import {StudentModal} from "@/components/student.modal.tsx";

const StudentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<IStudent[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
    const [page, setPage] = useState<number>(1); // Текущая страница
    const [totalPages, setTotalPages] = useState<number>(1); // Общее количество страниц



    const [groups, setGroups] = useState<Group[]>([]);

    const fetchGroups = async () => {
        try {
            const response = await api.get('groups');
            const result = response.data?.data ?? response.data ?? [];

            console.log("Fetched groups:", result);

            if (Array.isArray(result)) {
                setGroups(result);
            } else {
                setGroups([]);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            setGroups([]);
        }
    };


    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');

            console.log(response)
            setStudents(response.data.data);
            setTotalPages(response.data.total);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };


    // Эффект для загрузки студентов при изменении страницы, класса или поискового запроса
    useEffect(() => {
        fetchStudents();
        fetchGroups()
    }, [page, selectedClass, searchQuery]);

    // Фильтрация студентов на фронтенде
    const filteredStudents = students.filter(student => {
        const matchesClass = !selectedClass || selectedClass === 'Все группы' || student.group?.name === selectedClass;
        const matchesSearch = !searchQuery ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesClass && matchesSearch;
    });

    const handleViewDetails = (studentId: string) => {
        navigate(`/students/${studentId}`);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Студенты</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Поиск по имени..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-48">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все группы</option>
                            {Array.isArray(groups) && groups.map(group => (
                                <option key={group.id} value={group.name}>
                                    {group.name}
                                </option>
                            ))}

                        </select>

                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedStudent(student)}
                        >
                            <div className="aspect-w-4 aspect-h-3">
                                <img
                                    src={""}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{student.name + " " + student.surname}</h3>
                                <p className="text-sm text-gray-600">Группа: {student.group.name}</p>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <FaPhone className="w-4 h-4 mr-2"/>
                                    <span>+7 (701) 123-4567</span>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <FaEnvelope className="w-4 h-4 mr-2"/>
                                    <span>alikhan@example.com</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Пагинация */}
                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                    >
                        Назад
                    </button>
                    <span>Страница {page} из {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                    >
                        Вперёд
                    </button>
                </div>
            </div>

            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onViewDetails={handleViewDetails}
                />
            )}
        </div>
    );
};

export default StudentsPage;