import {IStudent} from "@/Interfeces/Student.interface.ts";
import React from "react";
import {FaIdCard, FaUserGraduate} from "react-icons/fa";

interface StudentModalProps {
    student: IStudent | null;
    onClose: () => void;
    onViewDetails: (studentId: string) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({student, onClose, onViewDetails}) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                                <img
                                    src={"https://media.istockphoto.com/id/588348500/nl/vector/male-avatar-profile-picture-vector.jpg?s=612x612&w=0&k=20&c=5IcAtIJUOTcrRDxQd5Q6Yi8C83ptgrOgXTCP-GaDrRY="}
                                    alt={student.name} className="w-32 h-32 object-cover"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{student.name + " " + student.surname}</h2>
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
                                {student.user.role && (
                                    <div className="flex items-center">
                                        <FaIdCard className="w-5 h-5 text-gray-500 mr-3"/>
                                        <span>Дата рождения: {student.user.role}</span>
                                    </div>
                                )}
                                {/*{student.phone && (*/}
                                {/*    <div className="flex items-center">*/}
                                {/*        <FaPhone className="w-5 h-5 text-gray-500 mr-3"/>*/}
                                {/*        <span>{student.phone}</span>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {/*{student.email && (*/}
                                {/*    <div className="flex items-center">*/}
                                {/*        <FaEnvelope className="w-5 h-5 text-gray-500 mr-3"/>*/}
                                {/*        <span>{student.email}</span>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Контакты родителей</h3>
                            <div className="space-y-3">
                                {student.Parent.user.username && (
                                    <div className="flex items-center">
                                        <FaUserGraduate className="w-5 h-5 text-gray-500 mr-3"/>
                                        <span>{student.student.Parent.user.username}</span>
                                    </div>
                                )}
                                {/*{student.parentPhone && (*/}
                                {/*    <div className="flex items-center">*/}
                                {/*        <FaPhone className="w-5 h-5 text-gray-500 mr-3"/>*/}
                                {/*        <span>{student.parentPhone}</span>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => onViewDetails('1')}
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