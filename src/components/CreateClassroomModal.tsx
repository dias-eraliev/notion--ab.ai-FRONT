import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaSave, FaPlus, FaTrash, FaSpinner, FaCheck } from 'react-icons/fa';
import { createClassroom, CreateClassroomDto, InventoryObjectDto } from '../api/classrooms.api';
import useSWR from 'swr';
import { fetcher } from '../api';

interface CreateClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// Days of the week for schedule
const DAYS_OF_WEEK = [
    'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
];

const CreateClassroomModal: React.FC<CreateClassroomModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    // Updated formData to match backend DTO structure
    const [formData, setFormData] = useState<{
        name: string;
        isFree: boolean;
        type: 'laboratory' | 'lecture' | 'seminar';
        capacity: number;
        responsibleStaffId?: number;
    }>({
        name: '',
        isFree: true,
        type: 'lecture',
        capacity: 30,
        responsibleStaffId: undefined,
    });

    // State for inventory and documents
    const [equipmentIds, setEquipmentIds] = useState<number[]>([]);
    const [documentIds, setDocumentIds] = useState<number[]>([]);

    // State for schedule items
    const [scheduleItems, setScheduleItems] = useState<Array<{
        day: string;
        startTime: string;
        endTime: string;
        type: string;
        repeat: string;
    }>>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetch available inventory objects
    const { data: inventoryData } = useSWR('/inventory', fetcher);
    const inventoryObjects = inventoryData as InventoryObjectDto[] || [];

    // Fetch available teachers
    const { data: teachersData } = useSWR('/teachers', fetcher);
    const teachers = teachersData as Array<{ id: number, name: string, surname: string }> || [];

    // Fetch available documents
    const { data: documentsData } = useSWR('/documents', fetcher);
    const documents = documentsData as Array<{ id: number, name: string, type: string }> || [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        // Handle number inputs
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
            return;
        }

        // Handle responsibleStaffId (convert to number or undefined)
        if (name === 'responsibleStaffId') {
            setFormData(prev => ({
                ...prev,
                [name]: value ? parseInt(value) : undefined
            }));
            return;
        }

        // Handle text inputs
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle inventory selection
    const handleInventoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const inventoryId = parseInt(value);

        if (checked) {
            setEquipmentIds(prev => [...prev, inventoryId]);
        } else {
            setEquipmentIds(prev => prev.filter(id => id !== inventoryId));
        }
    };

    // Handle document selection
    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const documentId = parseInt(value);

        if (checked) {
            setDocumentIds(prev => [...prev, documentId]);
        } else {
            setDocumentIds(prev => prev.filter(id => id !== documentId));
        }
    };

    // Add new schedule item
    const addScheduleItem = () => {
        setScheduleItems(prev => [
            ...prev,
            {
                day: 'Понедельник',
                startTime: '09:00',
                endTime: '10:30',
                type: 'lecture',
                repeat: 'weekly'
            }
        ]);
    };

    // Remove schedule item
    const removeScheduleItem = (index: number) => {
        setScheduleItems(prev => prev.filter((_, i) => i !== index));
    };

    // Update schedule item
    const updateScheduleItem = (index: number, field: string, value: string) => {
        setScheduleItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Validate form data
            if (!formData.name) {
                setError('Пожалуйста, заполните название аудитории');
                setLoading(false);
                return;
            }

            // Prepare payload according to backend DTO expectations
            const payload = {
                name: formData.name,
                isFree: formData.isFree,
                type: formData.type,
                capacity: formData.capacity,
                responsibleStaffId: formData.responsibleStaffId,
                equipmentIds: equipmentIds.length > 0 ? equipmentIds : undefined,
                documentIds: documentIds.length > 0 ? documentIds : undefined,
            };

            // Create classroom
            await createClassroom(payload);

            // Show success message
            setSuccess(true);

            setLoading(false);

            // Wait for success message to be visible before closing
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error creating classroom:', err);
            setError('Ошибка при создании аудитории. Пожалуйста, попробуйте снова.');
            setLoading(false);
        }
    };

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                isFree: true,
                type: 'lecture',
                capacity: 30,
                responsibleStaffId: undefined,
            });
            setEquipmentIds([]);
            setDocumentIds([]);
            setScheduleItems([]);
            setError('');
            setSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Добавить аудиторию</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                        disabled={loading}
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                            <FaCheck className="mr-2" />
                            Аудитория успешно создана!
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 mb-6">
                        {/* Basic Info */}
                        <div className="border rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4">Основная информация</h3>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Название аудитории <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Тип помещения</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="lecture">Лекционный</option>
                                    <option value="laboratory">Лаборатория</option>
                                    <option value="seminar">Кабинет/Семинар</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Вместимость (чел.)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Ответственный сотрудник</label>
                                <select
                                    name="responsibleStaffId"
                                    value={formData.responsibleStaffId || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">Не выбрано</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.surname} {teacher.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        checked={formData.isFree}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Свободна
                                </label>
                            </div>
                        </div>

                        {/* Equipment (Inventory) */}
                        <div className="border rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4">Оборудование</h3>

                            {inventoryObjects.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {inventoryObjects.map(item => (
                                        <div key={item.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`inventory-${item.id}`}
                                                value={item.id}
                                                checked={equipmentIds.includes(item.id)}
                                                onChange={handleInventoryChange}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`inventory-${item.id}`} className="text-sm">
                                                {item.name} {item.quantity > 1 && `(${item.quantity} шт.)`}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Нет доступного оборудования</p>
                            )}
                        </div>

                        {/* Documents */}
                        <div className="border rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4">Документы</h3>

                            {documents.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`document-${doc.id}`}
                                                value={doc.id}
                                                checked={documentIds.includes(doc.id)}
                                                onChange={handleDocumentChange}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`document-${doc.id}`} className="text-sm">
                                                {doc.name} ({doc.type})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Нет доступных документов</p>
                            )}
                        </div>

                        {/* Schedule */}
                        <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Расписание</h3>
                                <button
                                    type="button"
                                    onClick={addScheduleItem}
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <FaPlus className="mr-1" /> Добавить время
                                </button>
                            </div>

                            {scheduleItems.length === 0 ? (
                                <p className="text-gray-500 italic">Расписание не задано</p>
                            ) : (
                                <div className="space-y-4">
                                    {scheduleItems.map((item, index) => (
                                        <div key={index} className="border p-3 rounded-md relative">
                                            <button
                                                type="button"
                                                onClick={() => removeScheduleItem(index)}
                                                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-gray-700 text-sm mb-1">День</label>
                                                    <select
                                                        value={item.day}
                                                        onChange={(e) => updateScheduleItem(index, 'day', e.target.value)}
                                                        className="w-full p-2 border rounded-md"
                                                    >
                                                        {DAYS_OF_WEEK.map(day => (
                                                            <option key={day} value={day}>{day}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm mb-1">Тип занятия</label>
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => updateScheduleItem(index, 'type', e.target.value)}
                                                        className="w-full p-2 border rounded-md"
                                                    >
                                                        <option value="lecture">Лекция</option>
                                                        <option value="practice">Практика</option>
                                                        <option value="lab">Лабораторная</option>
                                                        <option value="seminar">Семинар</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm mb-1">Время начала</label>
                                                    <input
                                                        type="time"
                                                        value={item.startTime}
                                                        onChange={(e) => updateScheduleItem(index, 'startTime', e.target.value)}
                                                        className="w-full p-2 border rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm mb-1">Время окончания</label>
                                                    <input
                                                        type="time"
                                                        value={item.endTime}
                                                        onChange={(e) => updateScheduleItem(index, 'endTime', e.target.value)}
                                                        className="w-full p-2 border rounded-md"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-gray-700 text-sm mb-1">Повторение</label>
                                                    <select
                                                        value={item.repeat}
                                                        onChange={(e) => updateScheduleItem(index, 'repeat', e.target.value)}
                                                        className="w-full p-2 border rounded-md"
                                                    >
                                                        <option value="weekly">Еженедельно</option>
                                                        <option value="biweekly">Каждые две недели</option>
                                                        <option value="once">Однократно</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={loading || success}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Сохранение...
                                </>
                            ) : success ? (
                                <>
                                    <FaCheck className="mr-2" />
                                    Создано
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Создать аудиторию
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateClassroomModal; 