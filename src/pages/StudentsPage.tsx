import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaSearch, FaUserGraduate, FaPhone, FaEnvelope, FaIdCard} from 'react-icons/fa';
import api from "@/api";
import {Group} from "@/types/group.entity.ts";

interface Student {
    id: string;
    name: string;
    class: string;
    performance: number;
    attendance: number;
    emotionalState: string;
    payments: string;
    image: string;
    phone?: string;
    email?: string;
    birthDate?: string;
    parentName?: string;
    parentPhone?: string;
}

interface StudentModalProps {
    student: Student | null;
    onClose: () => void;
    onViewDetails: (studentId: string) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({student, onClose, onViewDetails}) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                                <img src={student.image || "https://media.istockphoto.com/id/588348500/nl/vector/male-avatar-profile-picture-vector.jpg?s=612x612&w=0&k=20&c=5IcAtIJUOTcrRDxQd5Q6Yi8C83ptgrOgXTCP-GaDrRY="} alt={student.name} className="w-32 h-32 object-cover"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{student.name + " " + student.surname + " " + student.lastname}</h2>
                                <p className="text-gray-600">Группа: {student.group.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Личная информация</h3>
                            <div className="space-y-3">
                                {student.birthDate && (
                                    <div className="flex items-center">
                                        <FaIdCard className="w-5 h-5 text-gray-500 mr-3"/>
                                        <span>Дата рождения: {student.birthDate}</span>
                                    </div>
                                )}
                                {student.phone && (
                                    <div className="flex items-center">
                                        <FaPhone className="w-5 h-5 text-gray-500 mr-3"/>
                                        <span>{student.phone}</span>
                                    </div>
                                )}
                                {student.email && (
                                    <div className="flex items-center">
                                        <FaEnvelope className="w-5 h-5 text-gray-500 mr-3"/>
                                        <span>{student.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Контакты родителей</h3>
                            <div className="space-y-3">
                                {student.parentName && (
                                    <div className="flex items-center">
                                        <FaUserGraduate className="w-5 h-5 text-gray-500 mr-3"/>
                                        <span>{student.parentName}</span>
                                    </div>
                                )}
                                {student.parentPhone && (
                                    <div className="flex items-center">
                                        <FaPhone className="w-5 h-5 text-gray-500 mr-3"/>
                                        <span>{student.parentPhone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => onViewDetails(student.id)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StudentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
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
            const response = await api.get('/students', {
                // params: {
                //     page: page,
                //     limit: 10
                // },
            });

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
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-48">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="..."
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
                                    src={student.image || "https://media.istockphoto.com/id/588348500/nl/vector/male-avatar-profile-picture-vector.jpg?s=612x612&w=0&k=20&c=5IcAtIJUOTcrRDxQd5Q6Yi8C83ptgrOgXTCP-GaDrRY="}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{student.name + " " + student.surname}</h3>
                                <p className="text-sm text-gray-600">Группа: {student.group.name}</p>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <FaPhone className="w-4 h-4 mr-2"/>
                                    <span>{student.phone}</span>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <FaEnvelope className="w-4 h-4 mr-2"/>
                                    <span>{student.email}</span>
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