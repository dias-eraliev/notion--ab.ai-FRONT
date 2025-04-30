import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaPlus, FaEllipsisH, FaCalendar, FaCaretDown, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../hooks/useLanguage';
import DateRangePicker from '../components/DateRangePicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuthContext, UserRole } from '../providers/AuthProvider';

// Обновляем интерфейс для поддержки двух оценок
interface GradeItem {
  value: number; // Изменено на 100-балльную систему
  type: string;
  comment?: string;
  createdAt?: string;
}

interface Student {
  id: number;
  name: string;
  grades: {
    [date: string]: {
      classwork?: GradeItem;
      homework?: GradeItem;
      average?: number; // Среднее арифметическое двух оценок
    } | null;
  };
}

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    classwork?: GradeItem;
    homework?: GradeItem;
  };
  onSave: (classworkGrade: GradeItem | null, homeworkGrade: GradeItem | null) => void;
}

interface GradeInfo {
  classwork?: GradeItem;
  homework?: GradeItem;
  date: string;
  average?: number;
}

// Обновленный модальный компонент для двух оценок
const GradeModal: React.FC<GradeModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [classworkGrade, setClassworkGrade] = useState<GradeItem>({
    value: initialData?.classwork?.value || 0,
    type: 'classwork',
    comment: initialData?.classwork?.comment || ''
  });
  
  const [homeworkGrade, setHomeworkGrade] = useState<GradeItem>({
    value: initialData?.homework?.value || 0,
    type: 'homework',
    comment: initialData?.homework?.comment || ''
  });
  
  const [classworkEnabled, setClassworkEnabled] = useState<boolean>(!!initialData?.classwork);
  const [homeworkEnabled, setHomeworkEnabled] = useState<boolean>(!!initialData?.homework);
  const [attendanceTag, setAttendanceTag] = useState<string>('');

  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      classworkEnabled ? classworkGrade : null,
      homeworkEnabled ? homeworkGrade : null
    );
    console.log('Selected Attendance Tag:', attendanceTag); // Логируем выбранный тег
    onClose();
  };

  const getTagClass = (tag: string) => {
    if (attendanceTag === tag) {
      switch (tag) {
        case 'Б':
          return 'bg-yellow-300';
        case 'Н':
          return 'bg-red-300';
        case 'П':
          return 'bg-green-300';
        default:
          return '';
      }
    }
    return 'hover:bg-gray-100';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-[500px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Редактирование оценок</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Секция выбора тега посещаемости */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="text-md font-medium mb-3">Тег посещаемости</h4>
            <div className="flex space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="attendanceTag"
                  value="Б"
                  checked={attendanceTag === 'Б'}
                  onChange={(e) => setAttendanceTag(e.target.value)}
                  className="sr-only"
                />
                <div className={`px-4 py-2 border border-gray-300 rounded-md cursor-pointer ${getTagClass('Б')}`}>
                  Б (Болеет)
                </div>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="attendanceTag"
                  value="Н"
                  checked={attendanceTag === 'Н'}
                  onChange={(e) => setAttendanceTag(e.target.value)}
                  className="sr-only"
                />
                <div className={`px-4 py-2 border border-gray-300 rounded-md cursor-pointer ${getTagClass('Н')}`}>
                  Н (Не был)
                </div>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="attendanceTag"
                  value="П"
                  checked={attendanceTag === 'П'}
                  onChange={(e) => setAttendanceTag(e.target.value)}
                  className="sr-only"
                />
                <div className={`px-4 py-2 border border-gray-300 rounded-md cursor-pointer ${getTagClass('П')}`}>
                  П (Причина)
                </div>
              </label>
            </div>
          </div>

          {/* Секция классной работы */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium">Классная работа</h4>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={classworkEnabled}
                  onChange={(e) => setClassworkEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">{classworkEnabled ? 'Активно' : 'Неактивно'}</span>
              </label>
            </div>
            
            {classworkEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Оценка <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={classworkGrade.value}
                    onChange={(e) => setClassworkGrade({...classworkGrade, value: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={classworkEnabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Комментарий
                  </label>
                  <textarea
                    value={classworkGrade.comment || ''}
                    onChange={(e) => setClassworkGrade({...classworkGrade, comment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Секция домашней работы */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium">Домашняя работа</h4>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeworkEnabled}
                  onChange={(e) => setHomeworkEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">{homeworkEnabled ? 'Активно' : 'Неактивно'}</span>
              </label>
            </div>
            
            {homeworkEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Оценка <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={homeworkGrade.value}
                    onChange={(e) => setHomeworkGrade({...homeworkGrade, value: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={homeworkEnabled}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Комментарий
                  </label>
                  <textarea
                    value={homeworkGrade.comment || ''}
                    onChange={(e) => setHomeworkGrade({...homeworkGrade, comment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>
            )}
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

// Обновленный компонент информации об оценке
const GradeInfoModal: React.FC<{
  grade: GradeInfo;
  onClose: () => void;
}> = ({ grade, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        
        <div className="mb-4">
          <div className="text-sm text-gray-500">Дата</div>
          <div className="font-medium">{grade.date}</div>
        </div>
        
        {grade.average !== undefined && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-500">Средний балл</div>
            <div className="text-xl font-bold text-blue-600">{grade.average} / 100</div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {/* Классная работа */}
          {grade.classwork && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-800 mb-3">Классная работа</div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Оценка</div>
                  <div className="text-lg font-medium text-green-600">{grade.classwork.value} / 100</div>
                </div>
                
                {grade.classwork.createdAt && (
                  <div>
                    <div className="text-sm text-gray-500">Поставлена</div>
                    <div className="text-sm">{grade.classwork.createdAt}</div>
                  </div>
                )}
                
                {grade.classwork.comment && (
                  <div>
                    <div className="text-sm text-gray-500">Комментарий</div>
                    <div className="text-sm">{grade.classwork.comment}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Домашняя работа */}
          {grade.homework && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-800 mb-3">Домашняя работа</div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Оценка</div>
                  <div className="text-lg font-medium text-green-600">{grade.homework.value} / 100</div>
                </div>
                
                {grade.homework.createdAt && (
                  <div>
                    <div className="text-sm text-gray-500">Поставлена</div>
                    <div className="text-sm">{grade.homework.createdAt}</div>
                  </div>
                )}
                
                {grade.homework.comment && (
                  <div>
                    <div className="text-sm text-gray-500">Комментарий</div>
                    <div className="text-sm">{grade.homework.comment}</div>
                  </div>
                )}
              </div>
            </div>
          )}
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

// Добавлена логика для фильтрации таблицы на основе выбранных фильтров
const AcademicJournalPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGradeInfo, setSelectedGradeInfo] = useState<{
    studentId: number;
    date: string;
  } | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeInfo | null>(null);
  const { role } = useAuthContext();

  // Даты для колонок (в реальном приложении это должно быть динамическим)
  const dates = ['27.02', '28.02', '01.03', '02.03', '05.03', '06.03'];

  // Заполнены пустые места оценками для всех студентов, кроме 28 февраля у Абдуллаева Армана
  const students: Student[] = [
    {
      id: 1,
      name: 'Абдуллаев Арман',
      grades: {
        '27.02': {
          classwork: { value: 85, type: 'classwork', createdAt: '27.02.2024 14:30', comment: 'Отличная работа на уроке' },
          homework: { value: 78, type: 'homework', createdAt: '27.02.2024 18:45', comment: 'Небольшие неточности в решении' },
          average: 82
        },
        '28.02': null, // Оставляем пустым для демонстрации
        '01.03': {
          classwork: { value: 92, type: 'classwork', createdAt: '01.03.2024 09:15' },
          average: 92
        },
        '05.03': {
          classwork: { value: 88, type: 'classwork', createdAt: '05.03.2024 11:45', comment: 'Хорошая работа' },
          homework: { value: 94, type: 'homework', createdAt: '05.03.2024 15:30', comment: 'Все задачи решены верно' },
          average: 91
        },
        '06.03': {
          classwork: { value: 80, type: 'classwork', comment: 'Болеет' },
          average: 'Б'
        }
      }
    },
    {
      id: 2,
      name: 'Бекенов Дамир',
      grades: {
        '27.02': {
          classwork: { value: 76, type: 'classwork' },
          homework: { value: 68, type: 'homework' },
          average: 72
        },
        '28.02': {
          classwork: { value: 0, type: 'classwork', comment: 'Болеет' },
          average: 'Б'
        },
        '01.03': {
          classwork: { value: 65, type: 'classwork' },
          average: 65
        },
        '05.03': {
          classwork: { value: 82, type: 'classwork' },
          average: 82
        },
        '06.03': {
          classwork: { value: 70, type: 'classwork', comment: 'Причина' },
          average: 'П'
        }
      }
    },
    {
      id: 3,
      name: 'Васильев Александр',
      grades: {
        '28.02': { 
          classwork: { value: 90, type: 'classwork' },
          average: 90
        },
        '02.03': { 
          homework: { value: 60, type: 'homework', comment: 'Не был' },
          average: 'Н'
        },
        '06.03': { 
          classwork: { value: 95, type: 'classwork' },
          average: 95
        },
        '05.03': {
          classwork: { value: 85, type: 'classwork', comment: 'Болеет' },
          average: 'Б'
        }
      }
    },
    {
      id: 4,
      name: 'Галимова Алия',
      grades: {
        '27.02': { 
          classwork: { value: 78, type: 'classwork' },
          average: 78
        },
        '01.03': { 
          homework: { value: 88, type: 'homework' },
          average: 88
        },
        '05.03': { 
          classwork: { value: 70, type: 'classwork', comment: 'Причина' },
          average: 'П'
        },
        '06.03': {
          classwork: { value: 75, type: 'classwork', comment: 'Не был' },
          average: 'Н'
        }
      }
    },
    {
      id: 5,
      name: 'Дмитриев Кирилл',
      grades: {
        '28.02': { 
          classwork: { value: 60, type: 'classwork' },
          average: 60
        },
        '02.03': { 
          homework: { value: 75, type: 'homework' },
          average: 75
        },
        '06.03': { 
          classwork: { value: 80, type: 'classwork' },
          average: 80
        },
        '05.03': {
          classwork: { value: 70, type: 'classwork', comment: 'Болеет' },
          average: 'Б'
        }
      }
    },
    {
      id: 6,
      name: 'Ержанов Тимур',
      grades: {
        '27.02': { 
          classwork: { value: 95, type: 'classwork' },
          average: 95
        },
        '01.03': { 
          homework: { value: 93, type: 'homework' },
          average: 93
        },
        '05.03': { 
          classwork: { value: 88, type: 'classwork' },
          homework: { value: 90, type: 'homework' },
          average: 89
        },
        '06.03': {
          classwork: { value: 85, type: 'classwork', comment: 'Не был' },
          average: 'Н'
        }
      }
    },
    {
      id: 7,
      name: 'Жумабаева Айгерим',
      grades: {
        '28.02': { 
          homework: { value: 85, type: 'homework' },
          average: 85
        },
        '02.03': { 
          classwork: { value: 92, type: 'classwork' },
          average: 92
        },
        '06.03': { 
          classwork: { value: 94, type: 'classwork' },
          average: 94
        },
        '05.03': {
          classwork: { value: 80, type: 'classwork', comment: 'Причина' },
          average: 'П'
        }
      }
    },
    {
      id: 8,
      name: 'Иванов Максим',
      grades: {
        '27.02': { 
          classwork: { value: 65, type: 'classwork' },
          average: 65
        },
        '01.03': { 
          homework: { value: 78, type: 'homework' },
          average: 78
        },
        '05.03': { 
          classwork: { value: 80, type: 'classwork' },
          average: 80
        },
        '06.03': {
          classwork: { value: 70, type: 'classwork', comment: 'Болеет' },
          average: 'Б'
        }
      }
    },
    {
      id: 9,
      name: 'Кайратов Нурлан',
      grades: {
        '27.02': { 
          classwork: { value: 88, type: 'classwork' },
          average: 88
        },
        '01.03': { 
          homework: { value: 75, type: 'homework' },
          average: 75
        },
        '05.03': { 
          classwork: { value: 90, type: 'classwork' },
          average: 90
        },
        '06.03': {
          classwork: { value: 80, type: 'classwork', comment: 'Причина' },
          average: 'П'
        }
      }
    },
    {
      id: 10,
      name: 'Лесбекова Асем',
      grades: {
        '27.02': { 
          classwork: { value: 78, type: 'classwork' },
          average: 78
        },
        '01.03': { 
          homework: { value: 85, type: 'homework' },
          average: 85
        },
        '05.03': { 
          classwork: { value: 88, type: 'classwork' },
          average: 88
        },
        '06.03': {
          classwork: { value: 75, type: 'classwork', comment: 'Не был' },
          average: 'Н'
        }
      }
    },
    {
      id: 11,
      name: 'Мухамедьярова Алия',
      grades: {
        '27.02': {
          classwork: { value: 85, type: 'classwork' },
          average: 85
        },
        '28.02': {
          classwork: { value: 90, type: 'classwork' },
          average: 90
        },
        '01.03': {
          classwork: { value: 88, type: 'classwork' },
          average: 88
        },
      }
    },
    {
      id: 12,
      name: 'Нурмагамбетов Азамат',
      grades: {
        '27.02': {
          classwork: { value: 70, type: 'classwork' },
          average: 70
        },
        '28.02': {
          classwork: { value: 75, type: 'classwork' },
          average: 75
        },
        '01.03': {
          classwork: { value: 80, type: 'classwork' },
          average: 80
        },
      }
    },
    {
      id: 13,
      name: 'Омарова Айнур',
      grades: {
        '27.02': {
          classwork: { value: 95, type: 'classwork' },
          average: 95
        },
        '28.02': {
          classwork: { value: 85, type: 'classwork' },
          average: 85
        },
        '01.03': {
          classwork: { value: 90, type: 'classwork' },
          average: 90
        },
      }
    },
    {
      id: 14,
      name: 'Павлов Тимур',
      grades: {
        '27.02': {
          classwork: { value: 60, type: 'classwork' },
          average: 60
        },
        '28.02': {
          classwork: { value: 65, type: 'classwork' },
          average: 65
        },
        '01.03': {
          classwork: { value: 70, type: 'classwork' },
          average: 70
        },
      }
    },
    {
      id: 15,
      name: 'Рахимов Аскар',
      grades: {
        '27.02': {
          classwork: { value: 75, type: 'classwork' },
          average: 75
        },
        '28.02': {
          classwork: { value: 80, type: 'classwork' },
          average: 80
        },
        '01.03': {
          classwork: { value: 85, type: 'classwork' },
          average: 85
        },
      }
    },
    {
      id: 16,
      name: 'Сулейменов Ержан',
      grades: {
        '27.02': {
          classwork: { value: 90, type: 'classwork' },
          average: 90
        },
        '28.02': {
          classwork: { value: 95, type: 'classwork' },
          average: 95
        },
        '01.03': {
          classwork: { value: 88, type: 'classwork' },
          average: 88
        },
      }
    },
    {
      id: 17,
      name: 'Тлеубаев Нурсултан',
      grades: {
        '27.02': {
          classwork: { value: 65, type: 'classwork' },
          average: 65
        },
        '28.02': {
          classwork: { value: 70, type: 'classwork' },
          average: 70
        },
        '01.03': {
          classwork: { value: 75, type: 'classwork' },
          average: 75
        },
      }
    },
    {
      id: 18,
      name: 'Уразова Алия',
      grades: {
        '27.02': {
          classwork: { value: 80, type: 'classwork' },
          average: 80
        },
        '28.02': {
          classwork: { value: 85, type: 'classwork' },
          average: 85
        },
        '01.03': {
          classwork: { value: 90, type: 'classwork' },
          average: 90
        },
      }
    },
    {
      id: 19,
      name: 'Фазылов Ермек',
      grades: {
        '27.02': {
          classwork: { value: 88, type: 'classwork' },
          average: 88
        },
        '28.02': {
          classwork: { value: 92, type: 'classwork' },
          average: 92
        },
        '01.03': {
          classwork: { value: 85, type: 'classwork' },
          average: 85
        },
      }
    },
    {
      id: 20,
      name: 'Хасенова Асем',
      grades: {
        '27.02': {
          classwork: { value: 78, type: 'classwork' },
          average: 78
        },
        '28.02': {
          classwork: { value: 80, type: 'classwork' },
          average: 80
        },
        '01.03': {
          classwork: { value: 82, type: 'classwork' },
          average: 82
        },
      }
    },
  ];

  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);

  // Добавлены моковые данные для демонстрации изменения таблицы при выборе фильтров
  const mockData = {
    math: {
      'МК24-1М': [
        { id: 1, name: 'Абдуллаев Арман', grades: { '27.02': { classwork: { value: 85, type: 'classwork' }, average: 85 }, '28.02': { classwork: { value: 90, type: 'classwork' }, average: 90 }, '01.03': { classwork: { value: 88, type: 'classwork' }, average: 88 } } },
        { id: 2, name: 'Бекенов Дамир', grades: { '27.02': { classwork: { value: 70, type: 'classwork' }, average: 70 }, '28.02': { classwork: { value: 75, type: 'classwork' }, average: 75 }, '01.03': { classwork: { value: 80, type: 'classwork' }, average: 80 } } },
        { id: 3, name: 'Васильев Александр', grades: { '27.02': { classwork: { value: 95, type: 'classwork' }, average: 95 }, '28.02': { classwork: { value: 85, type: 'classwork' }, average: 85 }, '01.03': { classwork: { value: 90, type: 'classwork' }, average: 90 } } },
        { id: 4, name: 'Галимова Алия', grades: { '27.02': { classwork: { value: 60, type: 'classwork' }, average: 60 }, '28.02': { classwork: { value: 65, type: 'classwork' }, average: 65 }, '01.03': { classwork: { value: 70, type: 'classwork' }, average: 70 } } },
        { id: 5, name: 'Дмитриев Кирилл', grades: { '27.02': { classwork: { value: 75, type: 'classwork' }, average: 75 }, '28.02': { classwork: { value: 80, type: 'classwork' }, average: 80 }, '01.03': { classwork: { value: 85, type: 'classwork' }, average: 85 } } },
        { id: 6, name: 'Ержанов Тимур', grades: { '27.02': { classwork: { value: 90, type: 'classwork' }, average: 90 }, '28.02': { classwork: { value: 95, type: 'classwork' }, average: 95 }, '01.03': { classwork: { value: 88, type: 'classwork' }, average: 88 } } },
        { id: 7, name: 'Жумабаева Айгерим', grades: { '27.02': { classwork: { value: 65, type: 'classwork' }, average: 65 }, '28.02': { classwork: { value: 70, type: 'classwork' }, average: 70 }, '01.03': { classwork: { value: 75, type: 'classwork' }, average: 75 } } },
        { id: 8, name: 'Иванов Максим', grades: { '27.02': { classwork: { value: 80, type: 'classwork' }, average: 80 }, '28.02': { classwork: { value: 85, type: 'classwork' }, average: 85 }, '01.03': { classwork: { value: 90, type: 'classwork' }, average: 90 } } },
        { id: 9, name: 'Кайратов Нурлан', grades: { '27.02': { classwork: { value: 88, type: 'classwork' }, average: 88 }, '28.02': { classwork: { value: 92, type: 'classwork' }, average: 92 }, '01.03': { classwork: { value: 85, type: 'classwork' }, average: 85 } } },
        { id: 10, name: 'Лесбекова Асем', grades: { '27.02': { classwork: { value: 78, type: 'classwork' }, average: 78 }, '28.02': { classwork: { value: 80, type: 'classwork' }, average: 80 }, '01.03': { classwork: { value: 82, type: 'classwork' }, average: 82 } } },
      ],
      'МК24-2М': [
        { id: 11, name: 'Мухамедьярова Алия', grades: { '27.02': { classwork: { value: 85, type: 'classwork' }, average: 85 }, '28.02': { classwork: { value: 90, type: 'classwork' }, average: 90 }, '01.03': { classwork: { value: 88, type: 'classwork' }, average: 88 } } },
        { id: 12, name: 'Нурмагамбетов Азамат', grades: { '27.02': { classwork: { value: 70, type: 'classwork' }, average: 70 }, '28.02': { classwork: { value: 75, type: 'classwork' }, average: 75 }, '01.03': { classwork: { value: 80, type: 'classwork' }, average: 80 } } },
        { id: 13, name: 'Омарова Айнур', grades: { '27.02': { classwork: { value: 95, type: 'classwork' }, average: 95 }, '28.02': { classwork: { value: 85, type: 'classwork' }, average: 85 }, '01.03': { classwork: { value: 90, type: 'classwork' }, average: 90 } } },
        { id: 14, name: 'Павлов Тимур', grades: { '27.02': { classwork: { value: 60, type: 'classwork' }, average: 60 }, '28.02': { classwork: { value: 65, type: 'classwork' }, average: 65 }, '01.03': { classwork: { value: 70, type: 'classwork' }, average: 70 } } },
        { id: 15, name: 'Рахимов Аскар', grades: { '27.02': { classwork: { value: 75, type: 'classwork' }, average: 75 }, '28.02': { classwork: { value: 80, type: 'classwork' }, average: 80 }, '01.03': { classwork: { value: 85, type: 'classwork' }, average: 85 } } },
        { id: 16, name: 'Сулейменов Ержан', grades: { '27.02': { classwork: { value: 90, type: 'classwork' }, average: 90 }, '28.02': { classwork: { value: 95, type: 'classwork' }, average: 95 }, '01.03': { classwork: { value: 88, type: 'classwork' }, average: 88 } } },
        { id: 17, name: 'Тлеубаев Нурсултан', grades: { '27.02': { classwork: { value: 65, type: 'classwork' }, average: 65 }, '28.02': { classwork: { value: 70, type: 'classwork' }, average: 70 }, '01.03': { classwork: { value: 75, type: 'classwork' }, average: 75 } } },
        { id: 18, name: 'Уразова Алия', grades: { '27.02': { classwork: { value: 80, type: 'classwork' }, average: 80 }, '28.02': { classwork: { value: 85, type: 'classwork' }, average: 85 }, '01.03': { classwork: { value: 90, type: 'classwork' }, average: 90 } } },
        { id: 19, name: 'Фазылов Ермек', grades: { '27.02': { classwork: { value: 88, type: 'classwork' }, average: 88 }, '28.02': { classwork: { value: 92, type: 'classwork' }, average: 92 }, '01.03': { classwork: { value: 85, type: 'classwork' }, average: 85 } } },
        { id: 20, name: 'Хасенова Асем', grades: { '27.02': { classwork: { value: 78, type: 'classwork' }, average: 78 }, '28.02': { classwork: { value: 80, type: 'classwork' }, average: 80 }, '01.03': { classwork: { value: 82, type: 'classwork' }, average: 82 } } },
      ],
    },
    physics: {
      'МК24-1М': [
        {
          id: 5,
          name: 'Дмитриев Кирилл',
          grades: {
            '27.02': { classwork: { value: 75, type: 'classwork' }, average: 75 },
            '28.02': { classwork: { value: 80, type: 'classwork' }, average: 80 },
            '01.03': { classwork: { value: 85, type: 'classwork' }, average: 85 },
          },
        },
        {
          id: 6,
          name: 'Ержанов Тимур',
          grades: {
            '27.02': { classwork: { value: 90, type: 'classwork' }, average: 90 },
            '28.02': { classwork: { value: 95, type: 'classwork' }, average: 95 },
            '01.03': { classwork: { value: 88, type: 'classwork' }, average: 88 },
          },
        },
      ],
      'МК24-2М': [
        {
          id: 7,
          name: 'Жумабаева Айгерим',
          grades: {
            '27.02': { classwork: { value: 65, type: 'classwork' }, average: 65 },
            '28.02': { classwork: { value: 70, type: 'classwork' }, average: 70 },
            '01.03': { classwork: { value: 75, type: 'classwork' }, average: 75 },
          },
        },
        {
          id: 8,
          name: 'Иванов Максим',
          grades: {
            '27.02': { classwork: { value: 80, type: 'classwork' }, average: 80 },
            '28.02': { classwork: { value: 85, type: 'classwork' }, average: 85 },
            '01.03': { classwork: { value: 90, type: 'classwork' }, average: 90 },
          },
        },
      ],
    },
  };

  const handleFilterChange = () => {
    if (selectedSubject && selectedClass) {
      setFilteredStudents(mockData[selectedSubject]?.[selectedClass] || []);
    } else {
      setFilteredStudents([]); // Пустая таблица, если фильтры не выбраны
    }
  };

  // Добавлена возможность фильтрации по датам и календарю
  const handleDateFilter = () => {
    if (startDate && endDate) {
      const filtered = students.map(student => {
        const filteredGrades = Object.keys(student.grades)
          .filter(date => {
            const [day, month] = date.split('.').map(Number);
            const gradeDate = new Date(startDate.getFullYear(), month - 1, day);
            return gradeDate >= startDate && gradeDate <= endDate;
          })
          .reduce((acc, date) => {
            acc[date] = student.grades[date];
            return acc;
          }, {});

        return { ...student, grades: filteredGrades };
      });

      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  useEffect(() => {
    handleFilterChange();
    handleDateFilter();
  }, [selectedSubject, selectedClass, selectedSemester, startDate, endDate]);

  // Функция фильтрации студентов в зависимости от роли
  const getFilteredStudents = () => {
    let filtered = [...filteredStudents];

    // Базовая фильтрация по поиску
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтрация по роли
    switch (role) {
      case 'student':
        // Студент видит только свои оценки (допустим, его ID = 1)
        filtered = filtered.filter(student => student.id === 1);
        break;
      
      case 'parent':
        // Родитель видит оценки только своего ребенка (допустим, ID ребенка = 2)
        filtered = filtered.filter(student => student.id === 2);
        break;
      
      case 'teacher':
        // Учитель видит всех студентов выбранного класса
        if (selectedClass) {
          filtered = filtered.filter(student => true); // Здесь должна быть фильтрация по классу
        }
        break;
      
      case 'admin':
        // Администратор видит всех
        break;
    }

    return filtered;
  };

  // Определяем, можно ли редактировать оценки
  const canEditGrades = () => {
    return role === 'admin' || role === 'teacher';
  };

  const handleGradeClick = (studentId: number, date: string) => {
    const student = students.find(s => s.id === studentId);
    const gradeData = student?.grades[date];
    
    if (gradeData) {
      setSelectedGrade({
        classwork: gradeData.classwork,
        homework: gradeData.homework,
        average: gradeData.average,
        date
      });
    } else {
      setSelectedGradeInfo({ studentId, date });
      setIsModalOpen(true);
    }
  };

  const handleGradeSave = (classworkGrade: GradeItem | null, homeworkGrade: GradeItem | null) => {
    if (!selectedGradeInfo) return;
    
    const now = new Date().toLocaleString();
    let newGrades = {
      classwork: classworkGrade ? { ...classworkGrade, createdAt: now } : undefined,
      homework: homeworkGrade ? { ...homeworkGrade, createdAt: now } : undefined
    };
    
    // Расчет среднего арифметического
    if (classworkGrade && homeworkGrade) {
      const average = Math.round((classworkGrade.value + homeworkGrade.value) / 2);
      newGrades = { ...newGrades, average };
    } else if (classworkGrade) {
      newGrades = { ...newGrades, average: classworkGrade.value };
    } else if (homeworkGrade) {
      newGrades = { ...newGrades, average: homeworkGrade.value };
    }
    
    console.log('Saving grades:', { newGrades, selectedGradeInfo });
    // Здесь должна быть логика сохранения оценок в базе данных
  };

  // Функция для определения цвета оценки в 100-балльной системе
  const getGradeColor = (value: number | string) => {
    if (typeof value === 'string') {
      switch (value) {
        case 'Б':
          return 'bg-yellow-500'; // Желтый для "Б"
        case 'Н':
          return 'bg-red-500'; // Красный для "Н"
        case 'П':
          return 'bg-green-500'; // Зеленый для "П"
        default:
          return 'bg-gray-500';
      }
    }

    if (typeof value === 'number') {
      if (value >= 85) return 'bg-green-500'; // Отлично
      if (value >= 70) return 'bg-blue-500';  // Хорошо
      if (value >= 50) return 'bg-yellow-500'; // Удовлетворительно
      return 'bg-red-500'; // Неудовлетворительно
    }

    return 'bg-gray-500';
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {role === 'student' ? 'Мои оценки' :
           role === 'parent' ? 'Оценки ребенка' :
           role === 'teacher' ? 'Журнал успеваемости' :
           'Электронный журнал'}
        </h1>
      </div>

      {/* Показываем панель фильтров только для учителей и администраторов */}
      {(role === 'admin' || role === 'teacher') && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="">{t('selectSubject')}</option>
              <option value="math">{t('math')}</option>
              <option value="physics">{t('physics')}</option>
              <option value="chemistry">{t('chemistry')}</option>
              <option value="biology">{t('biology')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaCaretDown className="text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="">{t('selectGroup')}</option>
              <option value="МК24-1М">МК24-1М (Менеджмент)</option>
              <option value="МК24-2М">МК24-2М (Менеджмент)</option>
              <option value="ПК24-1П">ПК24-1П (Программирование)</option>
              <option value="ПР24-1Ю">ПР24-1Ю (Право)</option>
              <option value="ПР24-2Ю">ПР24-2Ю (Право)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaCaretDown className="text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="">{t('selectSemester')}</option>
              <option value="1">{t('semester1')}</option>
              <option value="2">{t('semester2')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaCaretDown className="text-gray-400" />
            </div>
          </div>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />

          <div className="relative">
            <div className="flex items-center w-full">
              <input
                type="text"
                placeholder={t('searchByName')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-white border border-l-0 border-gray-200 rounded-r-md hover:bg-gray-50">
                <FaSearch className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Для студентов и родителей показываем упрощенные фильтры */}
      {(role === 'student' || role === 'parent') && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="">{t('selectSubject')}</option>
              <option value="math">{t('math')}</option>
              <option value="physics">{t('physics')}</option>
              <option value="chemistry">{t('chemistry')}</option>
              <option value="biology">{t('biology')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaCaretDown className="text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="">{t('selectSemester')}</option>
              <option value="1">{t('semester1')}</option>
              <option value="2">{t('semester2')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaCaretDown className="text-gray-400" />
            </div>
          </div>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
        </div>
      )}
      
      {/* Таблица журнала */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 border-b border-r border-gray-200 min-w-[200px]">
                  {role === 'student' ? 'Предмет' : 'Студент'}
                </th>
                {dates.map((date) => (
                  <th key={date} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-b border-r border-gray-200 bg-gray-50">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredStudents().map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-200 ${index !== students.length - 1 ? 'border-b' : ''}`}>
                    {student.name}
                  </td>
                  {dates.map((date) => (
                    <td key={date} className={`px-6 py-4 border-r border-gray-200 ${index !== students.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex items-center justify-center">
                        {student.grades[date] ? (
                          <div className="relative group">
                            <button
                              onClick={() => handleGradeClick(student.id, date)}
                              className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-medium ${
                                getGradeColor(student.grades[date]!.average || 0)
                              } hover:opacity-90 transition-opacity`}
                            >
                              {student.grades[date]!.average}
                            </button>
                            
                            {/* Тултип при наведении показывает обе оценки */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                                {student.grades[date]!.classwork && (
                                  <div>Классная работа: {student.grades[date]!.classwork.value}</div>
                                )}
                                {student.grades[date]!.homework && (
                                  <div>Домашняя работа: {student.grades[date]!.homework.value}</div>
                                )}
                                <div className="text-xs text-gray-300 mt-1">
                                  Средний: {student.grades[date]!.average}
                                </div>
                              </div>
                              <div className="border-8 border-transparent border-t-gray-900 absolute left-1/2 transform -translate-x-1/2 -bottom-2"></div>
                            </div>
                          </div>
                        ) : (
                          canEditGrades() && (
                            <button
                              onClick={() => handleGradeClick(student.id, date)}
                              className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                              <span className="text-xl leading-none">+</span>
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <GradeModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedGradeInfo(null);
            }}
            onSave={handleGradeSave}
          />
        )}
        {selectedGrade && (
          <GradeInfoModal
            grade={selectedGrade}
            onClose={() => setSelectedGrade(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicJournalPage;