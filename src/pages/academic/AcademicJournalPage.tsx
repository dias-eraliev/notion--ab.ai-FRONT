import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaPlus, FaEllipsisH, FaCalendar, FaCaretDown, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage';
import DateRangePicker from '../../components/DateRangePicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuthContext, UserRole } from '../../providers/AuthProvider';

interface Student {
  id: number;
  name: string;
  grades: {
    [date: string]: {
      value: number;
      type?: string;
      comment?: string;
      createdAt?: string;
    } | null;
  };
}

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (grade: number, type: string, comment: string) => void;
}

interface GradeInfo {
  value: number;
  type: string;
  comment?: string;
  date: string;
  createdAt?: string;
}

const GradeModal: React.FC<GradeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [grade, setGrade] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Number(grade), type, comment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-[400px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Редактирование оценки</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Оценка <span className="text-red-500">*</span>
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">0</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип оценки <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Выберите тип</option>
              <option value="homework">Домашняя работа</option>
              <option value="classwork">Классная работа</option>
              <option value="test">Контрольная работа</option>
              <option value="exam">Экзамен</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
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

const GradeInfoModal: React.FC<{
  grade: GradeInfo;
  onClose: () => void;
}> = ({ grade, onClose }) => {
  const getGradeTypeName = (type: string) => {
    switch (type) {
      case 'homework': return 'Домашняя работа';
      case 'classwork': return 'Классная работа';
      case 'test': return 'Контрольная работа';
      case 'exam': return 'Экзамен';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-[400px] shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Информация об оценке</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500">Оценка</div>
            <div className="text-lg font-medium">{grade.value}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Тип работы</div>
            <div className="font-medium">{getGradeTypeName(grade.type)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Дата</div>
            <div className="font-medium">{grade.date}</div>
          </div>
          {grade.createdAt && (
            <div>
              <div className="text-sm text-gray-500">Поставлена</div>
              <div className="font-medium">{grade.createdAt}</div>
            </div>
          )}
          {grade.comment && (
            <div>
              <div className="text-sm text-gray-500">Комментарий</div>
              <div className="font-medium">{grade.comment}</div>
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

// Компонент переключателя ролей
const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useAuthContext();
  
  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-yellow-800">
          Тестовый режим просмотра:
        </span>
        <div className="flex gap-2">
          {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${role === r 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
            >
              {r === 'admin' && 'Администратор'}
              {r === 'teacher' && 'Учитель'}
              {r === 'student' && 'Ученик'}
              {r === 'parent' && 'Родитель'}
            </button>
          ))}
        </div>
        <span className="text-xs text-yellow-600">
          Текущая роль: {
            role === 'admin' ? 'Администратор' :
            role === 'teacher' ? 'Учитель' :
            role === 'student' ? 'Ученик' :
            'Родитель'
          }
        </span>
      </div>
    </div>
  );
};

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

  // Пример данных студентов
  const students: Student[] = [
    {
      id: 1,
      name: 'Абдуллаев Арман',
      grades: {
        '27.02': { value: 5, type: 'classwork', createdAt: '27.02.2024 14:30', comment: 'Отличная работа на уроке' },
        '01.03': { value: 4, type: 'homework', createdAt: '01.03.2024 09:15', comment: 'Небольшие неточности в решении' },
        '05.03': { value: 5, type: 'test', createdAt: '05.03.2024 11:45', comment: 'Все задачи решены верно' },
      }
    },
    {
      id: 2,
      name: 'Бекенов Дамир',
      grades: {
        '27.02': { value: 4, type: 'classwork' },
        '01.03': { value: 3, type: 'homework' },
        '05.03': { value: 4, type: 'test' },
      }
    },
    {
      id: 3,
      name: 'Васильев Александр',
      grades: {
        '28.02': { value: 5, type: 'test' },
        '02.03': { value: 4, type: 'homework' },
        '06.03': { value: 5, type: 'classwork' },
      }
    },
    {
      id: 4,
      name: 'Галимова Алия',
      grades: {
        '27.02': { value: 4, type: 'classwork' },
        '01.03': { value: 5, type: 'homework' },
        '05.03': { value: 4, type: 'test' },
      }
    },
    {
      id: 5,
      name: 'Дмитриев Кирилл',
      grades: {
        '28.02': { value: 3, type: 'classwork' },
        '02.03': { value: 4, type: 'test' },
        '06.03': { value: 4, type: 'homework' },
      }
    },
    {
      id: 6,
      name: 'Ержанов Тимур',
      grades: {
        '27.02': { value: 5, type: 'test' },
        '01.03': { value: 5, type: 'classwork' },
        '05.03': { value: 4, type: 'homework' },
      }
    },
    {
      id: 7,
      name: 'Жумабаева Айгерим',
      grades: {
        '28.02': { value: 4, type: 'homework' },
        '02.03': { value: 5, type: 'test' },
        '06.03': { value: 5, type: 'classwork' },
      }
    },
    {
      id: 8,
      name: 'Иванов Максим',
      grades: {
        '27.02': { value: 3, type: 'classwork' },
        '01.03': { value: 4, type: 'test' },
        '05.03': { value: 4, type: 'homework' },
      }
    }
  ];

  // Функция фильтрации студентов в зависимости от роли
  const getFilteredStudents = () => {
    let filtered = [...students];

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
    setSelectedGradeInfo({ studentId, date });
    setIsModalOpen(true);
  };

  const handleGradeSave = (grade: number, type: string, comment: string) => {
    // Здесь должна быть логика сохранения оценки
    console.log('Saving grade:', { grade, type, comment, selectedGradeInfo });
  };

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case 5: return 'bg-green-500';
      case 4: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <RoleSwitcher />
      
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
              <option value="">{t('selectClass')}</option>
              <option value="10A">10A</option>
              <option value="10B">10B</option>
              <option value="11A">11A</option>
              <option value="11B">11B</option>
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
                              onClick={() => setSelectedGrade({
                                value: student.grades[date]!.value,
                                type: student.grades[date]!.type || 'classwork',
                                comment: student.grades[date]!.comment,
                                createdAt: student.grades[date]!.createdAt,
                                date
                              })}
                              className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white font-medium ${getGradeColor(student.grades[date]!.value)} hover:opacity-90 transition-opacity`}
                            >
                              {student.grades[date]!.value}
                            </button>
                            {/* Тултип при наведении */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                                <div>{student.grades[date]!.type === 'homework' ? 'Домашняя работа' : 
                                     student.grades[date]!.type === 'classwork' ? 'Классная работа' :
                                     student.grades[date]!.type === 'test' ? 'Контрольная работа' : 'Экзамен'}</div>
                                <div className="text-xs text-gray-300 mt-1">{student.grades[date]!.createdAt}</div>
                              </div>
                              <div className="border-8 border-transparent border-t-gray-900 absolute left-1/2 transform -translate-x-1/2 -bottom-2"></div>
                            </div>
                          </div>
                        ) : (
                          canEditGrades() && (
                            <button
                              onClick={() => handleGradeClick(student.id, date)}
                              className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors"
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