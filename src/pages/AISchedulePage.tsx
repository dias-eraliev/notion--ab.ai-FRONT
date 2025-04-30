import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaCalendar, FaDownload, FaPrint, FaShare, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Типы данных
interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  hoursPerWeek: number;
  availableDays: string[];
  availableHours: string[];
  constraints: {
    noConsecutive: boolean;
    morningOnly: boolean;
    maxLessonsPerDay: number;
  };
}

interface ClassGroup {
  id: string;
  name: string;
  subgroups: string[];
  daysPerWeek: number;
  maxLessonsPerDay: number;
}

interface Subject {
  id: string;
  name: string;
  requiresSpecialRoom: boolean;
  hoursPerWeek: Record<string, number>; // класс -> часов
  splitGroups: boolean;
}

interface Room {
  id: string;
  name: string;
  type: 'regular' | 'specialized';
  subjectBinding?: string;
  capacity: number;
}

interface Constraint {
  id: string;
  type: 'general' | 'personal';
  description: string;
  target?: 'class' | 'teacher' | 'subject';
  targetId?: string;
  rule: string;
}

interface ScheduleItem {
  id: string;
  day: string;
  lesson: number;
  classId: string;
  subgroupId?: string;
  subject: string;
  teacherId: string;
  roomId: string;
  conflicts: string[];
}

// Моковые данные
const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Иванова Анна Петровна',
    subjects: ['Математика'],
    hoursPerWeek: 20,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    availableHours: ['8:00', '9:00', '10:00', '11:00', '12:00'],
    constraints: {
      noConsecutive: false,
      morningOnly: true,
      maxLessonsPerDay: 4
    }
  },
  {
    id: '2',
    name: 'Петров Иван Сергеевич',
    subjects: ['Физика'],
    hoursPerWeek: 18,
    availableDays: ['monday', 'tuesday', 'thursday', 'friday'],
    availableHours: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    constraints: {
      noConsecutive: true,
      morningOnly: false,
      maxLessonsPerDay: 3
    }
  },
  {
    id: '3',
    name: 'Сидорова Елена Викторовна',
    subjects: ['Русский язык', 'Литература'],
    hoursPerWeek: 22,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    availableHours: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'],
    constraints: {
      noConsecutive: false,
      morningOnly: false,
      maxLessonsPerDay: 4
    }
  },
  {
    id: '4',
    name: 'Козлов Андрей Иванович',
    subjects: ['Химия'],
    hoursPerWeek: 15,
    availableDays: ['tuesday', 'wednesday', 'friday'],
    availableHours: ['10:00', '11:00', '12:00', '13:00', '14:00'],
    constraints: {
      noConsecutive: false,
      morningOnly: false,
      maxLessonsPerDay: 3
    }
  },
  {
    id: '5',
    name: 'Смирнова Ольга Александровна',
    subjects: ['Биология'],
    hoursPerWeek: 16,
    availableDays: ['monday', 'wednesday', 'thursday'],
    availableHours: ['9:00', '10:00', '11:00', '12:00', '13:00'],
    constraints: {
      noConsecutive: false,
      morningOnly: false,
      maxLessonsPerDay: 3
    }
  },
  {
    id: '6',
    name: 'Кузнецов Дмитрий Петрович',
    subjects: ['Физкультура'],
    hoursPerWeek: 24,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    availableHours: ['8:00', '9:00', '10:00', '11:00'],
    constraints: {
      noConsecutive: false,
      morningOnly: true,
      maxLessonsPerDay: 5
    }
  }
];

const mockClasses: ClassGroup[] = [
  { id: '1', name: '7А', subgroups: ['1', '2'], daysPerWeek: 5, maxLessonsPerDay: 6 },
  { id: '2', name: '7Б', subgroups: ['1', '2'], daysPerWeek: 5, maxLessonsPerDay: 6 },
  { id: '3', name: '8А', subgroups: ['1', '2'], daysPerWeek: 5, maxLessonsPerDay: 6 },
  { id: '4', name: '8Б', subgroups: ['1', '2'], daysPerWeek: 5, maxLessonsPerDay: 6 },
  { id: '5', name: '9А', subgroups: ['1', '2', '3'], daysPerWeek: 5, maxLessonsPerDay: 7 }
];

const mockSubjects: Subject[] = [
  { id: '1', name: 'Математика', requiresSpecialRoom: false, hoursPerWeek: {'7А': 5, '7Б': 5, '8А': 5, '8Б': 5, '9А': 6}, splitGroups: false },
  { id: '2', name: 'Физика', requiresSpecialRoom: true, hoursPerWeek: {'7А': 2, '7Б': 2, '8А': 3, '8Б': 3, '9А': 3}, splitGroups: false },
  { id: '3', name: 'Химия', requiresSpecialRoom: true, hoursPerWeek: {'7А': 0, '7Б': 0, '8А': 2, '8Б': 2, '9А': 2}, splitGroups: false },
  { id: '4', name: 'Биология', requiresSpecialRoom: false, hoursPerWeek: {'7А': 2, '7Б': 2, '8А': 2, '8Б': 2, '9А': 2}, splitGroups: false },
  { id: '5', name: 'Русский язык', requiresSpecialRoom: false, hoursPerWeek: {'7А': 4, '7Б': 4, '8А': 4, '8Б': 4, '9А': 4}, splitGroups: false },
  { id: '6', name: 'Литература', requiresSpecialRoom: false, hoursPerWeek: {'7А': 2, '7Б': 2, '8А': 2, '8Б': 2, '9А': 3}, splitGroups: false },
  { id: '7', name: 'Физкультура', requiresSpecialRoom: true, hoursPerWeek: {'7А': 3, '7Б': 3, '8А': 3, '8Б': 3, '9А': 3}, splitGroups: true },
  { id: '8', name: 'Информатика', requiresSpecialRoom: true, hoursPerWeek: {'7А': 1, '7Б': 1, '8А': 1, '8Б': 1, '9А': 2}, splitGroups: true }
];

const mockRooms: Room[] = [
  { id: '1', name: '101', type: 'regular', capacity: 30 },
  { id: '2', name: '102', type: 'regular', capacity: 30 },
  { id: '3', name: '201', type: 'specialized', subjectBinding: 'Физика', capacity: 25 },
  { id: '4', name: '301', type: 'specialized', subjectBinding: 'Химия', capacity: 25 },
  { id: '5', name: 'Спортзал', type: 'specialized', subjectBinding: 'Физкультура', capacity: 60 },
  { id: '6', name: 'Компьютерный класс', type: 'specialized', subjectBinding: 'Информатика', capacity: 20 }
];

const mockConstraints: Constraint[] = [
  { id: '1', type: 'general', description: 'Не ставить один и тот же предмет подряд', rule: 'noConsecutiveSubject' },
  { id: '2', type: 'general', description: 'Физкультура только в 1-3 урок', rule: 'sportEarly' },
  { id: '3', type: 'general', description: 'Математика не позднее 5 урока', rule: 'mathEarly' },
  { id: '4', type: 'personal', target: 'teacher', targetId: '1', description: 'Иванова А.П. преподает только до 13:00', rule: 'teacherTimeLimit' },
  { id: '5', type: 'personal', target: 'class', targetId: '5', description: '9А класс - не более 2 точных наук в день', rule: 'classScientificLimit' }
];

// Вспомогательные компоненты
const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-bold text-lg">{teacher.name}</h3>
      <div className="text-sm mt-2">
        <div>Предметы: {teacher.subjects.join(', ')}</div>
        <div>Часов в неделю: {teacher.hoursPerWeek}</div>
        <div>Ограничения:</div>
        <ul className="list-disc pl-5 text-xs">
          {teacher.constraints.noConsecutive && <li>Не ставить уроки подряд</li>}
          {teacher.constraints.morningOnly && <li>Только утренние часы</li>}
          <li>Не более {teacher.constraints.maxLessonsPerDay} уроков в день</li>
        </ul>
      </div>
    </div>
  );
};

const ClassCard: React.FC<{ classGroup: ClassGroup }> = ({ classGroup }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-bold text-lg">{classGroup.name}</h3>
      <div className="text-sm mt-2">
        <div>Подгруппы: {classGroup.subgroups.join(', ')}</div>
        <div>Дней в неделю: {classGroup.daysPerWeek}</div>
        <div>Макс. уроков в день: {classGroup.maxLessonsPerDay}</div>
      </div>
    </div>
  );
};

const SubjectCard: React.FC<{ subject: Subject }> = ({ subject }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-bold text-lg">{subject.name}</h3>
      <div className="text-sm mt-2">
        <div>Спец. кабинет: {subject.requiresSpecialRoom ? 'Да' : 'Нет'}</div>
        <div>Деление на группы: {subject.splitGroups ? 'Да' : 'Нет'}</div>
        <div>Часы по классам:</div>
        <ul className="list-disc pl-5 text-xs">
          {Object.entries(subject.hoursPerWeek).map(([className, hours]) => (
            <li key={className}>{className}: {hours} ч/нед</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-bold text-lg">{room.name}</h3>
      <div className="text-sm mt-2">
        <div>Тип: {room.type === 'regular' ? 'Обычный' : 'Специализированный'}</div>
        {room.subjectBinding && <div>Предмет: {room.subjectBinding}</div>}
        <div>Вместимость: {room.capacity}</div>
      </div>
    </div>
  );
};

const ConstraintCard: React.FC<{ constraint: Constraint }> = ({ constraint }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-bold text-lg">{constraint.description}</h3>
      <div className="text-sm mt-2">
        <div>Тип: {constraint.type === 'general' ? 'Общее' : 'Персональное'}</div>
        {constraint.target && <div>Применяется к: {constraint.target}</div>}
      </div>
    </div>
  );
};

// Компонент ячейки расписания
interface LessonCardProps {
  item: ScheduleItem;
  onRemove: (id: string) => void;
  teachers: Teacher[];
  rooms: Room[];
}

const LessonCard: React.FC<LessonCardProps> = ({ item, onRemove, teachers, rooms }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LESSON',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const teacher = teachers.find(t => t.id === item.teacherId);
  const hasConflicts = item.conflicts.length > 0;

  return (
    <div
      ref={drag}
      className={`p-2 rounded-md shadow-sm border ${hasConflicts ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'} ${isDragging ? 'opacity-50' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex justify-between items-start">
        <div className="font-medium text-sm">{item.subject}</div>
        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500">
          <FaTimes size={12} />
        </button>
      </div>
      <div className="text-xs text-gray-600">{item.classId} {item.subgroupId ? `(Группа ${item.subgroupId})` : ''}</div>
      <div className="text-xs text-gray-600">{teacher?.name?.split(' ').map(n => n[0]).join('.')}</div>
      <div className="text-xs text-gray-600">Каб. {rooms.find(r => r.id === item.roomId)?.name}</div>
      
      {hasConflicts && (
        <div className="mt-1 flex items-center text-xs text-red-600">
          <FaExclamationTriangle size={10} className="mr-1" />
          <span>Конфликт!</span>
        </div>
      )}
    </div>
  );
};

// Компонент ячейки расписания
interface ScheduleCellProps {
  day: string;
  lesson: number;
  items: ScheduleItem[];
  onRemove: (id: string) => void;
  onDrop: (day: string, lesson: number, id: string) => void;
  onAdd: (day: string, lesson: number) => void;
  teachers: Teacher[];
  rooms: Room[];
}

const ScheduleCell: React.FC<ScheduleCellProps> = ({ 
  day, lesson, items, onRemove, onDrop, onAdd, teachers, rooms 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LESSON',
    drop: (item: { id: string }) => onDrop(day, lesson, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div 
      ref={drop}
      className={`border border-gray-300 p-2 min-h-[120px] ${isOver ? 'bg-blue-100' : 'bg-white'}`}
    >
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => (
            <LessonCard 
              key={item.id} 
              item={item} 
              onRemove={onRemove} 
              teachers={teachers}
              rooms={rooms}
            />
          ))}
        </div>
      ) : (
        <div 
          className="h-full flex items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500"
          onClick={() => onAdd(day, lesson)}
        >
          <FaPlus />
        </div>
      )}
    </div>
  );
};

// Модальное окно добавления занятия
interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lesson: Partial<ScheduleItem>) => void;
  day: string;
  lesson: number;
  teachers: Teacher[];
  classes: ClassGroup[];
  subjects: Subject[];
  rooms: Room[];
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  day,
  lesson,
  teachers,
  classes,
  subjects,
  rooms
}) => {
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    day,
    lesson,
    classId: '',
    subject: '',
    teacherId: '',
    roomId: '',
    conflicts: []
  });

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);

  // Фильтрация учителей по выбранному предмету
  const filteredTeachers = formData.subject
    ? teachers.filter(t => t.subjects.includes(formData.subject))
    : [];

  // Фильтрация кабинетов по выбранному предмету
  const filteredRooms = formData.subject
    ? rooms.filter(r => {
        const subj = subjects.find(s => s.name === formData.subject);
        if (!subj) return true;
        if (!subj.requiresSpecialRoom) return true;
        return r.type !== 'specialized' || r.subjectBinding === formData.subject;
      })
    : rooms;

  // Обработчик изменения предмета
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectName = e.target.value;
    setFormData({ ...formData, subject: subjectName, teacherId: '', roomId: '' });
    setSelectedSubject(subjects.find(s => s.name === subjectName) || null);
  };

  // Обработчик изменения класса
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setFormData({ ...formData, classId, subgroupId: undefined });
    setSelectedClass(classes.find(c => c.id === classId) || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.random().toString(36).substring(2, 9) // Генерация уникального ID
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Добавить занятие</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              День недели
            </label>
            <select
              value={formData.day}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            >
              <option value="monday">Понедельник</option>
              <option value="tuesday">Вторник</option>
              <option value="wednesday">Среда</option>
              <option value="thursday">Четверг</option>
              <option value="friday">Пятница</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Урок
            </label>
            <select
              value={formData.lesson}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Класс
            </label>
            <select
              value={formData.classId || ''}
              onChange={handleClassChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Выберите класс</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {selectedClass && selectedClass.subgroups.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подгруппа
              </label>
              <select
                value={formData.subgroupId || ''}
                onChange={(e) => setFormData({ ...formData, subgroupId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Весь класс</option>
                {selectedClass.subgroups.map(sg => (
                  <option key={sg} value={sg}>Группа {sg}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Предмет
            </label>
            <select
              value={formData.subject || ''}
              onChange={handleSubjectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Выберите предмет</option>
              {subjects.map(subj => (
                <option key={subj.id} value={subj.name}>{subj.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Учитель
            </label>
            <select
              value={formData.teacherId || ''}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={!formData.subject}
            >
              <option value="">Выберите учителя</option>
              {filteredTeachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Кабинет
            </label>
            <select
              value={formData.roomId || ''}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={!formData.subject}
            >
              <option value="">Выберите кабинет</option>
              {filteredRooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} {room.type === 'specialized' ? `(${room.subjectBinding})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Компонент конфликтов
interface ConflictsListProps {
  conflicts: { id: string; description: string }[];
}

const ConflictsList: React.FC<ConflictsListProps> = ({ conflicts }) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
      <h3 className="font-medium text-red-800 flex items-center">
        <FaExclamationTriangle className="mr-2" /> Обнаружены конфликты ({conflicts.length})
      </h3>
      <ul className="mt-2 space-y-1">
        {conflicts.map(conflict => (
          <li key={conflict.id} className="text-sm text-red-700">
            • {conflict.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Основной компонент страницы
const AISchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [conflicts, setConflicts] = useState<{ id: string; description: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; lesson: number } | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'class' | 'teacher' | 'room'>('all');
  const [viewFilter, setViewFilter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  // Дни недели и уроки
  const days = [
    { id: 'monday', label: 'Понедельник' },
    { id: 'tuesday', label: 'Вторник' },
    { id: 'wednesday', label: 'Среда' },
    { id: 'thursday', label: 'Четверг' },
    { id: 'friday', label: 'Пятница' }
  ];
  
  const lessons = [1, 2, 3, 4, 5, 6, 7];

  // Функция для отображения контента вкладок
  const renderTabContent = () => {
    switch (activeTab) {
      case 'teachers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTeachers.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        );
      case 'classes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockClasses.map(classGroup => (
              <ClassCard key={classGroup.id} classGroup={classGroup} />
            ))}
          </div>
        );
      case 'subjects':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSubjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        );
      case 'rooms':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        );
      case 'constraints':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockConstraints.map(constraint => (
              <ConstraintCard key={constraint.id} constraint={constraint} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Функция для фильтрации расписания
  const filteredSchedule = () => {
    if (viewMode === 'all' || !viewFilter) {
      return schedule;
    }

    switch (viewMode) {
      case 'class':
        return schedule.filter(item => item.classId === viewFilter);
      case 'teacher':
        return schedule.filter(item => item.teacherId === viewFilter);
      case 'room':
        return schedule.filter(item => item.roomId === viewFilter);
      default:
        return schedule;
    }
  };

  // Получение уроков для конкретной ячейки
  const getLessonsForCell = (day: string, lesson: number) => {
    return filteredSchedule().filter(item => item.day === day && item.lesson === lesson);
  };

  // Обработка добавления урока
  const handleAddLesson = (day: string, lesson: number) => {
    setSelectedCell({ day, lesson });
    setIsModalOpen(true);
  };

  // Обработка сохранения урока
  const handleSaveLesson = (lesson: Partial<ScheduleItem>) => {
    const newSchedule = [...schedule, lesson as ScheduleItem];
    setSchedule(newSchedule);
    checkConflicts(newSchedule);
  };

  // Обработка удаления урока
  const handleRemoveLesson = (id: string) => {
    const newSchedule = schedule.filter(item => item.id !== id);
    setSchedule(newSchedule);
    checkConflicts(newSchedule);
  };

  // Обработка перетаскивания
  const handleDropLesson = (day: string, lesson: number, id: string) => {
    const newSchedule = schedule.map(item => 
      item.id === id ? { ...item, day, lesson } : item
    );
    setSchedule(newSchedule);
    checkConflicts(newSchedule);
  };

  // Проверка конфликтов
  const checkConflicts = (scheduleItems: ScheduleItem[]) => {
    const newConflicts: { id: string; description: string }[] = [];
    const updatedSchedule = [...scheduleItems];
    
    // Сбрасываем все конфликты
    updatedSchedule.forEach(item => {
      item.conflicts = [];
    });

    // Проверка на конфликты учителей (один учитель не может вести два урока одновременно)
    for (let i = 0; i < updatedSchedule.length; i++) {
      for (let j = i + 1; j < updatedSchedule.length; j++) {
        const item1 = updatedSchedule[i];
        const item2 = updatedSchedule[j];

        // Конфликт учителя (один и тот же учитель в одно и то же время в тот же день)
        if (item1.teacherId === item2.teacherId && 
            item1.day === item2.day && 
            item1.lesson === item2.lesson) {
          
          const teacher = mockTeachers.find(t => t.id === item1.teacherId);
          const class1 = mockClasses.find(c => c.id === item1.classId)?.name || item1.classId;
          const class2 = mockClasses.find(c => c.id === item2.classId)?.name || item2.classId;
          
          item1.conflicts.push('teacher');
          item2.conflicts.push('teacher');
          
          newConflicts.push({
            id: `teacher-${item1.id}-${item2.id}`,
            description: `Учитель ${teacher?.name} не может одновременно вести уроки в классах ${class1} и ${class2} (${days.find(d => d.id === item1.day)?.label}, ${item1.lesson} урок)`
          });
        }

        // Конфликт кабинета (один и тот же кабинет в одно и то же время в тот же день)
        if (item1.roomId === item2.roomId && 
            item1.day === item2.day && 
            item1.lesson === item2.lesson) {
          
          const room = mockRooms.find(r => r.id === item1.roomId);
          const class1 = mockClasses.find(c => c.id === item1.classId)?.name || item1.classId;
          const class2 = mockClasses.find(c => c.id === item2.classId)?.name || item2.classId;
          
          item1.conflicts.push('room');
          item2.conflicts.push('room');
          
          newConflicts.push({
            id: `room-${item1.id}-${item2.id}`,
            description: `Кабинет ${room?.name} используется одновременно для ${item1.subject} (${class1}) и ${item2.subject} (${class2}) (${days.find(d => d.id === item1.day)?.label}, ${item1.lesson} урок)`
          });
        }

        // Конфликт класса (один и тот же класс не может быть в двух местах одновременно)
        if (item1.classId === item2.classId && 
            item1.day === item2.day && 
            item1.lesson === item2.lesson &&
            (!item1.subgroupId || !item2.subgroupId || item1.subgroupId === item2.subgroupId)) {
          
          const className = mockClasses.find(c => c.id === item1.classId)?.name || item1.classId;
          
          item1.conflicts.push('class');
          item2.conflicts.push('class');
          
          newConflicts.push({
            id: `class-${item1.id}-${item2.id}`,
            description: `Класс ${className} не может одновременно посещать ${item1.subject} и ${item2.subject} (${days.find(d => d.id === item1.day)?.label}, ${item1.lesson} урок)`
          });
        }
      }
    }

    // Проверка на предметные ограничения
    updatedSchedule.forEach(item => {
      // Физкультура только в 1-3 урок
      if (item.subject === 'Физкультура' && item.lesson > 3) {
        item.conflicts.push('constraint');
        newConflicts.push({
          id: `constraint-sport-${item.id}`,
          description: `Физкультура может быть только на 1-3 уроке (сейчас ${item.lesson} урок)`
        });
      }

      // Математика не позже 5 урока
      if (item.subject === 'Математика' && item.lesson > 5) {
        item.conflicts.push('constraint');
        newConflicts.push({
          id: `constraint-math-${item.id}`,
          description: `Математика должна быть не позднее 5 урока (сейчас ${item.lesson} урок)`
        });
      }

      // Проверка доступности учителя
      const teacher = mockTeachers.find(t => t.id === item.teacherId);
      if (teacher) {
        // Проверка доступных дней
        if (!teacher.availableDays.includes(item.day)) {
          item.conflicts.push('teacherAvailability');
          newConflicts.push({
            id: `teacher-availability-day-${item.id}`,
            description: `Учитель ${teacher.name} недоступен в ${days.find(d => d.id === item.day)?.label.toLowerCase() || item.day}`
          });
        }

        // Проверка ограничения "только утро"
        if (teacher.constraints.morningOnly && item.lesson > 4) {
          item.conflicts.push('teacherMorningOnly');
          newConflicts.push({
            id: `teacher-morning-only-${item.id}`,
            description: `Учитель ${teacher.name} может вести уроки только до 4-го включительно (сейчас ${item.lesson} урок)`
          });
        }
      }

      // Проверка специализированного кабинета
      const subject = mockSubjects.find(s => s.name === item.subject);
      const room = mockRooms.find(r => r.id === item.roomId);
      if (subject?.requiresSpecialRoom && room?.type !== 'specialized' && room?.subjectBinding !== subject.name) {
        item.conflicts.push('specialRoom');
        newConflicts.push({
          id: `special-room-${item.id}`,
          description: `Предмет ${subject.name} требует специализированный кабинет`
        });
      }
    });

    setSchedule(updatedSchedule);
    setConflicts(newConflicts);
  };

  // Генерация расписания
  const generateSchedule = () => {
    setIsGenerating(true);
    
    // Имитация процесса генерации
    setTimeout(() => {
      const generatedSchedule: ScheduleItem[] = [];
      
      // Для каждого класса
      mockClasses.forEach(cls => {
        // Для каждого предмета
        mockSubjects.forEach(subj => {
          const hoursPerWeek = subj.hoursPerWeek[cls.name] || 0;
          
          if (hoursPerWeek === 0) return;
          
          // Находим подходящего учителя
          const teachers = mockTeachers.filter(t => t.subjects.includes(subj.name));
          if (teachers.length === 0) return;
          
          const teacher = teachers[0];
          
          // Находим подходящий кабинет
          let availableRooms: Room[] = [];
          if (subj.requiresSpecialRoom) {
            // Ищем специализированный кабинет для этого предмета
            const specialRooms = mockRooms.filter(r => r.type === 'specialized' && r.subjectBinding === subj.name);
            if (specialRooms.length > 0) {
              availableRooms = specialRooms;
            }
          }
          
          // Если специализированный кабинет не требуется или не найден, используем обычные кабинеты
          if (availableRooms.length === 0) {
            availableRooms = mockRooms.filter(r => r.type === 'regular');
          }
          
          // Если нет доступных кабинетов, используем любой кабинет
          if (availableRooms.length === 0) {
            availableRooms = mockRooms;
          }
          
          // Распределяем уроки по дням недели
          let remainingHours = hoursPerWeek;
          let maxAttempts = 50; // Максимальное количество попыток найти место для урока
          
          while (remainingHours > 0 && maxAttempts > 0) {
            // Выбираем случайный день из доступных для учителя
            const availableDays = teacher.availableDays.length > 0 
              ? teacher.availableDays 
              : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                
            const dayIndex = Math.floor(Math.random() * availableDays.length);
            const day = availableDays[dayIndex];
            
            // Определяем возможные уроки с учетом ограничений
            const maxLesson = Math.min(
              cls.maxLessonsPerDay,
              teacher.constraints.morningOnly ? 4 : 7
            );
            
            // Выбираем случайный урок
            let lesson = Math.floor(Math.random() * maxLesson) + 1;
            
            // Специальная обработка для предметов с ограничениями
            if (subj.name === 'Физкультура') {
              lesson = Math.min(lesson, 3); // Только 1-3 уроки
            }
            if (subj.name === 'Математика') {
              lesson = Math.min(lesson, 5); // Только до 5 урока
            }
            
            // Проверяем, нет ли уже урока в этот день и время у этого класса или у этого учителя
            const classConflict = generatedSchedule.find(item => 
              item.day === day && 
              item.lesson === lesson && 
              item.classId === cls.id
            );
            
            const teacherConflict = generatedSchedule.find(item => 
              item.day === day && 
              item.lesson === lesson && 
              item.teacherId === teacher.id
            );
            
            // Если нет конфликтов с классом и учителем, пытаемся найти свободный кабинет
            if (!classConflict && !teacherConflict || maxAttempts < 10) {
              // Находим свободные кабинеты (те, которые не заняты в это время)
              const freeRooms = availableRooms.filter(room => {
                return !generatedSchedule.some(item => 
                  item.day === day && 
                  item.lesson === lesson && 
                  item.roomId === room.id
                );
              });
              
              // Выбираем случайный свободный кабинет или, если все заняты, любой из доступных
              const room = freeRooms.length > 0 
                ? freeRooms[Math.floor(Math.random() * freeRooms.length)] 
                : availableRooms[Math.floor(Math.random() * availableRooms.length)];
              
              // Добавляем урок в расписание
              generatedSchedule.push({
                id: Math.random().toString(36).substring(2, 9),
                day,
                lesson,
                classId: cls.id,
                subject: subj.name,
                teacherId: teacher.id,
                roomId: room.id,
                conflicts: []
              });
              
              remainingHours--;
            }
            
            maxAttempts--;
          }
        });
      });
      
      setSchedule(generatedSchedule);
      checkConflicts(generatedSchedule);
      setIsGenerating(false);
      setGenerated(true);
    }, 1000); // Уменьшил время имитации для более быстрого результата
  };

  // Экспорт в Excel
  const exportToExcel = () => {
    alert('Экспорт в Excel: Эта функция будет реализована позже');
  };

  // Сохранение в PDF
  const exportToPdf = () => {
    alert('Экспорт в PDF: Эта функция будет реализована позже');
  };

  // Печать
  const printSchedule = () => {
    window.print();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 max-w-[1600px] mx-auto print:p-0">
        <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">Генератор расписания</h1>
        <p className="mt-2 text-gray-700 print:text-sm">
          Сформируйте автоматическое расписание на неделю для всех классов и учителей с учётом ограничений
        </p>

        {/* Только для печати - заголовок */}
        <div className="hidden print:block mt-4 mb-6 text-center">
          <h2 className="text-xl font-bold">РАСПИСАНИЕ ЗАНЯТИЙ</h2>
          {viewMode !== 'all' && viewFilter && (
            <p className="text-lg">
              {viewMode === 'class' ? `Класс: ${mockClasses.find(c => c.id === viewFilter)?.name}` :
               viewMode === 'teacher' ? `Учитель: ${mockTeachers.find(t => t.id === viewFilter)?.name}` :
               `Кабинет: ${mockRooms.find(r => r.id === viewFilter)?.name}`}
            </p>
          )}
        </div>

        {/* Конфигурационные вкладки */}
        <div className="mt-6 print:hidden">
          <div className="flex flex-wrap space-x-4 border-b pb-2">
            <button 
              onClick={() => setActiveTab('teachers')} 
              className={`px-4 py-2 ${activeTab === 'teachers' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            >
              Учителя
            </button>
            <button 
              onClick={() => setActiveTab('classes')} 
              className={`px-4 py-2 ${activeTab === 'classes' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            >
              Классы
            </button>
            <button 
              onClick={() => setActiveTab('subjects')} 
              className={`px-4 py-2 ${activeTab === 'subjects' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            >
              Предметы
            </button>
            <button 
              onClick={() => setActiveTab('rooms')} 
              className={`px-4 py-2 ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            >
              Кабинеты
            </button>
            <button 
              onClick={() => setActiveTab('constraints')} 
              className={`px-4 py-2 ${activeTab === 'constraints' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            >
              Ограничения
            </button>
          </div>

          <div className="mt-4 mb-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Панель генерации */}
        <div className="flex flex-wrap items-center justify-between mb-6 print:hidden">
          <div className="flex flex-wrap space-x-2 mb-2 sm:mb-0">
            <button 
              className={`px-4 py-2 rounded-md ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center`}
              onClick={generateSchedule}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Генерируется...
                </>
              ) : 'Сгенерировать расписание'}
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              onClick={() => {
                setSchedule([]);
                setConflicts([]);
                setGenerated(false);
              }}
            >
              Очистить
            </button>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
              Сохранить шаблон
            </button>
          </div>

          <div className="flex flex-wrap space-x-2">
            <button 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
              onClick={exportToExcel}
            >
              <FaDownload className="mr-2" /> Excel
            </button>
            <button 
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center"
              onClick={exportToPdf}
            >
              <FaDownload className="mr-2" /> PDF
            </button>
            <button 
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center"
              onClick={printSchedule}
            >
              <FaPrint className="mr-2" /> Печать
            </button>
          </div>
        </div>

        {/* Фильтры просмотра */}
        <div className="mb-4 flex flex-wrap items-center space-x-4 print:hidden">
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => { setViewMode('all'); setViewFilter(''); }}
            >
              Все
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${viewMode === 'class' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => { setViewMode('class'); setViewFilter(mockClasses[0].id); }}
            >
              По классу
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${viewMode === 'teacher' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => { setViewMode('teacher'); setViewFilter(mockTeachers[0].id); }}
            >
              По учителю
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${viewMode === 'room' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => { setViewMode('room'); setViewFilter(mockRooms[0].id); }}
            >
              По кабинету
            </button>
          </div>

          {viewMode !== 'all' && (
            <div className="flex-grow">
              <select
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                {viewMode === 'class' && mockClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
                {viewMode === 'teacher' && mockTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
                {viewMode === 'room' && mockRooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Список конфликтов */}
        {conflicts.length > 0 && (
          <div className="mb-4 print:hidden">
            <ConflictsList conflicts={conflicts} />
          </div>
        )}

        {/* Таблица расписания */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto print:shadow-none">
          <table className="min-w-full">
            <thead>
              <tr className="text-center bg-gray-50 text-gray-600 print:text-sm">
                <th className="py-3 px-4 font-medium border">Урок \ День</th>
                {days.map(day => (
                  <th key={day.id} className="py-3 px-4 font-medium border">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lessons.map(lesson => (
                <tr key={lesson} className="print:text-xs">
                  <td className="py-2 px-4 border bg-gray-50 font-medium text-center">
                    {lesson}
                  </td>
                  {days.map(day => (
                    <td key={`${day.id}-${lesson}`} className="p-1 border">
                      <ScheduleCell
                        day={day.id}
                        lesson={lesson}
                        items={getLessonsForCell(day.id, lesson)}
                        onRemove={handleRemoveLesson}
                        onDrop={handleDropLesson}
                        onAdd={handleAddLesson}
                        teachers={mockTeachers}
                        rooms={mockRooms}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Информация если нет данных */}
        {filteredSchedule().length === 0 && !isGenerating && (
          <div className="mt-6 text-center p-6 bg-gray-50 rounded-md print:hidden">
            <h3 className="text-xl font-medium text-gray-700">Расписание не сгенерировано</h3>
            <p className="mt-2 text-gray-600">
              Нажмите кнопку "Сгенерировать расписание", чтобы создать расписание автоматически, 
              или добавьте занятия вручную, кликнув на ячейки таблицы.
            </p>
          </div>
        )}

        {/* Модальное окно добавления занятия */}
        <AnimatePresence>
          {isModalOpen && selectedCell && (
            <AddLessonModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={handleSaveLesson}
              day={selectedCell.day}
              lesson={selectedCell.lesson}
              teachers={mockTeachers}
              classes={mockClasses}
              subjects={mockSubjects}
              rooms={mockRooms}
            />
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
};

export default AISchedulePage;