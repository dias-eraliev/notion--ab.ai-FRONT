import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
  FaPlus,
  FaDownload,
  FaCalendar,
  FaFileAlt,
  FaTimes,
  FaEdit,
  FaSave,
  FaSpinner,
  FaTrash,
  FaClock,
  FaUser,
  FaBook
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import {
  ClassroomUIModel,
  updateClassroom,
  useClassroom,
  useInventoryObjects,
  assignInventoryToClassroom,
  removeInventoryFromClassroom,
  addDocumentToClassroom,
  deleteDocumentFromClassroom,
  ScheduleDto
} from '../api/classrooms.api';
import { InventoryObjectDto } from '../api/classrooms.api';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassroomUIModel;
  onMutate?: () => void;
}

// Function to check if the classroom is currently in use
const isClassroomInUse = (schedule: ScheduleDto[] = []) => {
  if (!schedule || schedule.length === 0) return false;

  const now = new Date();
  const currentDay = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][now.getDay()];
  const currentDayEn = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];

  // Current time in HH:MM format
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Check if any schedule slot overlaps with current time
  return schedule.some(slot => {
    // Check if the slot is for today
    const isToday = slot.day.toLowerCase() === currentDayEn.toLowerCase() ||
      slot.day === currentDay;

    if (!isToday) return false;

    // Get the time values, handling both field naming patterns
    const startTime = slot.startTime || (slot as any).timeStart || '';
    const endTime = slot.endTime || (slot as any).timeEnd || '';

    // Check if current time is between start and end time
    return currentTime >= startTime && currentTime <= endTime;
  });
};

// Function to format the day name
const formatDayName = (day: string) => {
  const dayMap: { [key: string]: string } = {
    'monday': 'Понедельник',
    'tuesday': 'Вторник',
    'wednesday': 'Среда',
    'thursday': 'Четверг',
    'friday': 'Пятница',
    'saturday': 'Суббота',
    'sunday': 'Воскресенье'
  };

  return dayMap[day.toLowerCase()] || day;
};

const ClassroomModal: React.FC<ClassroomModalProps> = ({ isOpen, onClose, classroom, onMutate }) => {
  // Refs and state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { payload } = useAuth();
  const userRole = payload?.role || 'STUDENT';
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get fresh classroom data
  const {
    classroom: apiClassroom,
    classroomUI: updatedClassroomUI,
    isLoading: isClassroomLoading,
    mutate: mutateClassroom
  } = useClassroom(classroom.id);

  // Available inventory for adding
  const { inventoryObjects, isLoading: isInventoryLoading } = useInventoryObjects();

  // Form data for editing
  const [formData, setFormData] = useState({
    name: classroom.name,
    capacity: classroom.capacity,
    isFree: classroom.status === 'free',
    type: classroom.type as 'lecture' | 'laboratory' | 'seminar',
  });

  // Check if classroom is currently in use based on schedule
  const currentlyInUse = isClassroomInUse(updatedClassroomUI?.schedule || classroom.schedule);

  // Update form data when we get fresh data from API
  useEffect(() => {
    if (apiClassroom) {
      setFormData({
        name: apiClassroom.name,
        capacity: apiClassroom.capacity,
        isFree: apiClassroom.isFree,
        type: apiClassroom.type,
      });
    }
  }, [apiClassroom]);

  // Permissions
  const canEdit = ['ADMIN', 'TEACHER'].includes(userRole);
  const isAdmin = userRole === 'ADMIN';

  // Current data
  const currentClassroom = updatedClassroomUI || classroom;

  // Handle file upload for documents
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      await addDocumentToClassroom(parseInt(classroom.id), file);

      // Refresh data
      if (onMutate) onMutate();
      if (mutateClassroom) mutateClassroom();

      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Не удалось загрузить документ');
      setLoading(false);
    }
  };

  // Navigate to schedule page
  const handleViewSchedule = () => {
    onClose();
    navigate(`/academic/schedule?room=${classroom.number}`);
  };

  // Handle form changes
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

    // Handle text inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save changes to classroom
  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');

    try {
      await updateClassroom(parseInt(classroom.id), formData);

      setIsEditing(false);
      setLoading(false);

      // Refresh data
      if (onMutate) onMutate();
      if (mutateClassroom) mutateClassroom();
    } catch (err) {
      console.error('Error updating classroom:', err);
      setError('Не удалось обновить аудиторию');
      setLoading(false);
    }
  };

  // Add equipment to classroom
  const handleAddEquipment = async (inventoryId: number) => {
    setLoading(true);
    setError('');

    try {
      await assignInventoryToClassroom(inventoryId, parseInt(classroom.id));

      // Refresh data
      if (onMutate) onMutate();
      if (mutateClassroom) mutateClassroom();

      setLoading(false);
    } catch (error) {
      console.error('Error adding equipment:', error);
      setError('Не удалось добавить оборудование');
      setLoading(false);
    }
  };

  // Remove equipment from classroom
  const handleRemoveEquipment = async (inventoryId: number) => {
    setLoading(true);
    setError('');

    try {
      await removeInventoryFromClassroom(inventoryId);

      // Refresh data
      if (onMutate) onMutate();
      if (mutateClassroom) mutateClassroom();

      setLoading(false);
    } catch (error) {
      console.error('Error removing equipment:', error);
      setError('Не удалось удалить оборудование');
      setLoading(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (documentId: number) => {
    setLoading(true);
    setError('');

    try {
      await deleteDocumentFromClassroom(documentId);

      // Refresh data
      if (onMutate) onMutate();
      if (mutateClassroom) mutateClassroom();

      setLoading(false);
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Не удалось удалить документ');
      setLoading(false);
    }
  };

  // Check if modal should be visible
  if (!isOpen) return null;

  // List of available inventory that's not already in the classroom
  const availableInventory = inventoryObjects?.filter(item =>
    !currentClassroom.equipment.some(eq => eq.id === item.id)
  ) || [];

  // Format current time for real-time display
  const now = new Date();
  const currentTimeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Редактирование: ' : ''}{currentClassroom.name} / №{currentClassroom.number}
          </h2>
          <div className="flex items-center">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mr-3 text-blue-600 hover:text-blue-700"
                disabled={loading}
              >
                <FaEdit size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={loading}
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isClassroomLoading && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            <span className="ml-2 text-gray-600">Загрузка данных...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 mx-6 mt-4 rounded">
            {error}
          </div>
        )}

        {/* Content */}
        {!isClassroomLoading && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">📘 Основная информация</h3>

              {/* Edit Mode */}
              {isEditing ? (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="block text-gray-700 mb-1">Название</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Тип помещения</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="lecture">Лекционный</option>
                      <option value="laboratory">Лаборатория</option>
                      <option value="seminar">Кабинет/Зал</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Вместимость</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="isFree">Свободна</label>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 mr-2 border border-gray-300 rounded text-gray-600"
                      disabled={loading}
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="px-3 py-1 bg-blue-500 text-white rounded flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-1" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-1" />
                          Сохранить
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Тип помещения:</span>
                    <span className="font-medium">
                      {currentClassroom.type === 'lecture' ? 'Лекционный' :
                        currentClassroom.type === 'laboratory' ? 'Лаборатория' :
                          'Кабинет/Зал'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Вместимость:</span>
                    <span className="font-medium">{currentClassroom.capacity} чел.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Административный статус:</span>
                    <span className={`font-medium ${currentClassroom.status === 'free' ? 'text-green-600' :
                      currentClassroom.status === 'occupied' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                      {currentClassroom.status === 'free' ? 'Свободна' :
                        currentClassroom.status === 'occupied' ? 'Занята' :
                          'В ремонте'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Текущее состояние:</span>
                    <span className={`font-medium flex items-center ${currentlyInUse ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {currentlyInUse ? (
                        <>🔴 Идет занятие</>
                      ) : (
                        <>🟢 Не используется</>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Текущее время:</span>
                    <span className="font-medium flex items-center">
                      <FaClock className="mr-1" /> {currentTimeFormatted}
                    </span>
                  </div>
                </div>
              )}

              {/* Equipment Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">⚙️ Оснащение</h3>
                  {isAdmin && (
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                      onClick={() => setIsEditing(true)}
                      disabled={loading || isEditing}
                    >
                      <FaPlus className="mr-1" />
                      Добавить оборудование
                    </button>
                  )}
                </div>

                {/* Available Equipment (Edit Mode) */}
                {isEditing && (
                  <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Доступное оборудование:</h4>
                    {isInventoryLoading ? (
                      <div className="text-center py-2">
                        <FaSpinner className="animate-spin text-blue-500 mx-auto" />
                      </div>
                    ) : availableInventory.length > 0 ? (
                      <div className="max-h-40 overflow-y-auto">
                        {availableInventory.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-sm">
                              {item.name} {item.quantity > 1 && `× ${item.quantity}`}
                            </span>
                            <button
                              onClick={() => handleAddEquipment(item.id)}
                              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                              disabled={loading}
                            >
                              {loading ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                'Добавить'
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">Нет доступного оборудования</p>
                    )}
                  </div>
                )}

                {/* Current Equipment */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">Текущее оборудование:</h4>
                  {currentClassroom.equipment.length > 0 ? (
                    <div className="space-y-1">
                      {currentClassroom.equipment.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="flex items-center text-sm">
                            {item.status ? (
                              <FaCheckCircle className="text-green-500 mr-2" />
                            ) : (
                              <FaTimesCircle className="text-red-500 mr-2" />
                            )}
                            {item.name} {item.quantity && item.quantity > 1 && `× ${item.quantity}`}
                          </span>

                          {isEditing && isAdmin && (
                            <button
                              onClick={() => handleRemoveEquipment(item.id)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                              disabled={loading}
                            >
                              {loading ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                'Удалить'
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">Нет оборудования</p>
                  )}
                </div>

                {/* Action Buttons */}
                {canEdit && (
                  <div className="mt-2 space-y-1">
                    <button
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                      disabled={loading}
                    >
                      <FaTools className="mr-1" />
                      Проверка состояния
                    </button>
                    <button
                      onClick={() => navigate('/academic/requests/new?room=' + currentClassroom.number)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                      disabled={loading}
                    >
                      <FaCalendar className="mr-1" />
                      Забронировать
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Responsible Persons */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">👤 Ответственные</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {currentClassroom.responsiblePersons.length > 0 ? (
                    currentClassroom.responsiblePersons.map((person, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{person.role}:</span>
                        <span className="font-medium">{person.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Ответственный не назначен</p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Последняя проверка:</span>
                    <span className="font-medium">{currentClassroom.lastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 Расписание использования</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {currentClassroom.schedule && currentClassroom.schedule.length > 0 ? (
                    <div className="space-y-2">
                      {currentClassroom.schedule.map((slot, index) => {
                        // Get values handling both field naming patterns
                        const startTime = slot.startTime || (slot as any).timeStart || '';
                        const endTime = slot.endTime || (slot as any).timeEnd || '';
                        const lessonType = slot.type || (slot as any).status || '';

                        return (
                          <div key={index} className="p-2 border-b border-gray-100 last:border-b-0">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{formatDayName(slot.day)}</span>
                              <span className={`${isTimeActive(startTime, endTime) ? 'text-red-600 font-bold' : ''}`}>
                                {startTime} - {endTime}
                              </span>
                            </div>
                            <div className="text-gray-600 text-sm mt-1 flex flex-wrap gap-1">
                              <span>{lessonType}</span>
                              {slot.groupId && (
                                <span className="flex items-center ml-1">
                                  • <FaUser className="mx-1" size={12} />
                                  Группа: {slot.Group?.name || `#${slot.groupId}`}
                                </span>
                              )}
                              {slot.lessonId && slot.lesson && (
                                <span className="flex items-center ml-1">
                                  • <FaBook className="mx-1" size={12} />
                                  {slot.lesson.name}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 italic">Нет запланированных занятий</p>
                      <p className="text-sm text-green-600 mt-2">
                        Аудитория свободна для использования
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleViewSchedule}
                    className="w-full mt-2 text-blue-600 hover:text-blue-700 flex items-center justify-center"
                    disabled={loading}
                  >
                    <FaCalendar className="mr-2" />
                    Посмотреть в расписании
                  </button>
                </div>
              </div>

              {/* Documents */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">📝 Документы</h3>
                  {isAdmin && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        disabled={loading}
                      >
                        <FaPlus className="mr-1" />
                        Добавить документ
                      </button>
                    </>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  {currentClassroom.documents.length > 0 ? (
                    <div className="space-y-2">
                      {currentClassroom.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-600 text-sm">{doc.name}</span>
                          <div className="flex items-center">
                            <a
                              href={doc.url}
                              className="text-blue-600 hover:text-blue-700 flex items-center mr-2"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaDownload className="mr-1" />
                              <span className="text-sm">Скачать</span>
                            </a>

                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={loading}
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center">Нет документов</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Helper function to check if a specific time slot is currently active
function isTimeActive(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const currentTimeValue = currentHour * 60 + currentMinute;
  const startTimeValue = startHour * 60 + startMinute;
  const endTimeValue = endHour * 60 + endMinute;

  return currentTimeValue >= startTimeValue && currentTimeValue <= endTimeValue;
}

export default ClassroomModal; 