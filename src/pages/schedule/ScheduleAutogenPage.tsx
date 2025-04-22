import React, { useState } from 'react';

const TABS = [
  { key: 'teachers', label: 'Учителя' },
  { key: 'classes', label: 'Классы' },
  { key: 'subjects', label: 'Предметы' },
  { key: 'rooms', label: 'Кабинеты' },
  { key: 'constraints', label: 'Ограничения' },
];

// MOCK DATA для учителей
const MOCK_TEACHERS = [
  {
    id: 1,
    name: 'Айгуль Ерлановна',
    subjects: ['Математика'],
    workload: 18,
    availableDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
    availableLessons: [1, 2, 3, 4, 5],
    restrictions: {
      notInRow: true,
      onlyMorning: false,
      maxPerDay: 4,
    },
  },
  {
    id: 2,
    name: 'Мейрамбек Нурланович',
    subjects: ['Физика', 'Информатика'],
    workload: 16,
    availableDays: ['Пн', 'Ср', 'Пт'],
    availableLessons: [1, 2, 3, 4],
    restrictions: {
      notInRow: false,
      onlyMorning: true,
      maxPerDay: 3,
    },
  },
  {
    id: 3,
    name: 'Салтанат Армановна',
    subjects: ['Химия'],
    workload: 14,
    availableDays: ['Вт', 'Чт'],
    availableLessons: [2, 3, 4, 5, 6],
    restrictions: {
      notInRow: true,
      onlyMorning: false,
      maxPerDay: 2,
    },
  },
  {
    id: 4,
    name: 'Бекзат Саматович',
    subjects: ['Биология'],
    workload: 12,
    availableDays: ['Пн', 'Ср', 'Пт'],
    availableLessons: [1, 2, 3],
    restrictions: {
      notInRow: false,
      onlyMorning: false,
      maxPerDay: 2,
    },
  },
  {
    id: 5,
    name: 'Жанар Еркебулановна',
    subjects: ['Русский язык', 'Литература'],
    workload: 20,
    availableDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
    availableLessons: [1, 2, 3, 4, 5, 6],
    restrictions: {
      notInRow: true,
      onlyMorning: false,
      maxPerDay: 5,
    },
  },
  {
    id: 6,
    name: 'Арман Ерланович',
    subjects: ['История', 'География'],
    workload: 15,
    availableDays: ['Вт', 'Чт', 'Пт'],
    availableLessons: [2, 3, 4, 5],
    restrictions: {
      notInRow: false,
      onlyMorning: false,
      maxPerDay: 3,
    },
  },
];

// MOCK DATA для классов
const MOCK_CLASSES = [
  { id: 1, name: '7А', subgroups: 2, days: 5, maxLessons: 6 },
  { id: 2, name: '7Б', subgroups: 1, days: 5, maxLessons: 6 },
  { id: 3, name: '8А', subgroups: 2, days: 5, maxLessons: 6 },
  { id: 4, name: '9А', subgroups: 3, days: 5, maxLessons: 7 },
  { id: 5, name: '10А', subgroups: 1, days: 6, maxLessons: 7 },
];

type SubjectHours = Record<string, number>;
const MOCK_SUBJECTS = [
  { id: 1, name: 'Математика', specialRoom: true, hours: { '7': 5, '8': 5, '9': 6, '10': 6 } as SubjectHours, groupSplit: true },
  { id: 2, name: 'Физика', specialRoom: true, hours: { '7': 2, '8': 3, '9': 3, '10': 4 } as SubjectHours, groupSplit: false },
  { id: 3, name: 'Химия', specialRoom: true, hours: { '7': 2, '8': 2, '9': 3, '10': 3 } as SubjectHours, groupSplit: true },
  { id: 4, name: 'Биология', specialRoom: false, hours: { '7': 2, '8': 2, '9': 2, '10': 2 } as SubjectHours, groupSplit: false },
  { id: 5, name: 'Русский язык', specialRoom: false, hours: { '7': 3, '8': 3, '9': 3, '10': 3 } as SubjectHours, groupSplit: false },
  { id: 6, name: 'Литература', specialRoom: false, hours: { '7': 2, '8': 2, '9': 2, '10': 2 } as SubjectHours, groupSplit: false },
  { id: 7, name: 'История', specialRoom: false, hours: { '7': 2, '8': 2, '9': 2, '10': 2 } as SubjectHours, groupSplit: false },
  { id: 8, name: 'Информатика', specialRoom: true, hours: { '7': 1, '8': 2, '9': 2, '10': 2 } as SubjectHours, groupSplit: true },
];
const PARALLELS = ['7', '8', '9', '10'];

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];
const LESSONS = [1, 2, 3, 4, 5, 6];

// MOCK DATA для кабинетов
const MOCK_ROOMS = [
  { id: 1, name: '101', type: 'Обычный', subject: '', capacity: 30 },
  { id: 2, name: '201', type: 'Специализированный', subject: 'Химия', capacity: 24 },
  { id: 3, name: '301', type: 'Специализированный', subject: 'Физика', capacity: 20 },
  { id: 4, name: '401', type: 'Компьютерный', subject: 'Информатика', capacity: 18 },
];
const ROOM_TYPES = ['Обычный', 'Специализированный', 'Компьютерный'];

// MOCK DATA для ограничений
const MOCK_CONSTRAINTS = [
  { id: 1, type: 'Общее', description: 'Не ставить один и тот же предмет подряд' },
  { id: 2, type: 'Общее', description: 'Максимум 6 уроков в день' },
  { id: 3, type: 'Общее', description: 'Физкультура только 1–3 урок' },
  { id: 4, type: 'Персональное', target: '7А', description: 'Математика не позднее 4 урока' },
  { id: 5, type: 'Персональное', target: 'Айгуль Ерлановна', description: 'Не более 3 уроков в день' },
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const LESSON_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

// MOCK COLORS для учителей
const TEACHER_COLORS: Record<string, string> = {
  'Айгуль Ерлановна': 'bg-blue-100 text-blue-800',
  'Мейрамбек Нурланович': 'bg-green-100 text-green-800',
  'Салтанат Армановна': 'bg-pink-100 text-pink-800',
  'Бекзат Саматович': 'bg-yellow-100 text-yellow-800',
  'Жанар Еркебулановна': 'bg-purple-100 text-purple-800',
  'Арман Ерланович': 'bg-orange-100 text-orange-800',
};

const ScheduleAutogenPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [showAdd, setShowAdd] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subjects: '',
    workload: 10,
    availableDays: [] as string[],
    availableLessons: [] as number[],
    restrictions: { notInRow: false, onlyMorning: false, maxPerDay: 4 },
  });
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    subgroups: 1,
    days: 5,
    maxLessons: 6,
  });
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    specialRoom: false,
    hours: { '7': 0, '8': 0, '9': 0, '10': 0 } as SubjectHours,
    groupSplit: false,
  });
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'Обычный',
    subject: '',
    capacity: 20,
  });
  const [constraints, setConstraints] = useState(MOCK_CONSTRAINTS);
  const [showAddConstraint, setShowAddConstraint] = useState(false);
  const [newConstraint, setNewConstraint] = useState({
    type: 'Общее',
    target: '',
    description: '',
  });
  const [weeks, setWeeks] = useState(1);
  const [schedule, setSchedule] = useState<any>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleAddTeacher = () => {
    setTeachers([
      ...teachers,
      {
        id: Date.now(),
        name: newTeacher.name,
        subjects: newTeacher.subjects.split(',').map(s => s.trim()),
        workload: newTeacher.workload,
        availableDays: newTeacher.availableDays,
        availableLessons: newTeacher.availableLessons,
        restrictions: { ...newTeacher.restrictions },
      },
    ]);
    setShowAdd(false);
    setNewTeacher({
      name: '',
      subjects: '',
      workload: 10,
      availableDays: [],
      availableLessons: [],
      restrictions: { notInRow: false, onlyMorning: false, maxPerDay: 4 },
    });
  };

  const handleAddClass = () => {
    setClasses([
      ...classes,
      {
        id: Date.now(),
        name: newClass.name,
        subgroups: newClass.subgroups,
        days: newClass.days,
        maxLessons: newClass.maxLessons,
      },
    ]);
    setShowAddClass(false);
    setNewClass({ name: '', subgroups: 1, days: 5, maxLessons: 6 });
  };

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: newSubject.name,
        specialRoom: newSubject.specialRoom,
        hours: { ...newSubject.hours },
        groupSplit: newSubject.groupSplit,
      },
    ]);
    setShowAddSubject(false);
    setNewSubject({ name: '', specialRoom: false, hours: { '7': 0, '8': 0, '9': 0, '10': 0 } as SubjectHours, groupSplit: false });
  };

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        id: Date.now(),
        name: newRoom.name,
        type: newRoom.type,
        subject: newRoom.subject,
        capacity: newRoom.capacity,
      },
    ]);
    setShowAddRoom(false);
    setNewRoom({ name: '', type: 'Обычный', subject: '', capacity: 20 });
  };

  const handleAddConstraint = () => {
    setConstraints([
      ...constraints,
      {
        id: Date.now(),
        type: newConstraint.type,
        target: newConstraint.target,
        description: newConstraint.description,
      },
    ]);
    setShowAddConstraint(false);
    setNewConstraint({ type: 'Общее', target: '', description: '' });
  };

  const generateMockSchedule = () => {
    // Для простоты: 5 классов, 6 учителей, 8 предметов, 4 кабинета, 1 конфликт
    // Сетка: [день][урок][класс] = массив уроков (может быть несколько — подгруппы или конфликт)
    const classNames = classes.map(c => c.name);
    const teacherNames = teachers.map(t => t.name);
    const subjectNames = subjects.map(s => s.name);
    const roomNames = rooms.map(r => r.name);
    const schedule: Record<string, any> = {};
    WEEKDAYS.forEach(day => {
      LESSON_NUMBERS.forEach(lesson => {
        classNames.forEach((cls, ci) => {
          const key = `${day}_${lesson}_${cls}`;
          // Для теста: 1 конфликт на Пн, 2 урок, 7А
          if (day === 'Пн' && lesson === 2 && cls === '7А') {
            schedule[key] = [
              {
                subject: 'Математика',
                teacher: 'Айгуль Ерлановна',
                room: '101',
                subgroup: 1,
                conflict: true,
              },
              {
                subject: 'Физика',
                teacher: 'Айгуль Ерлановна', // тот же учитель — конфликт
                room: '301',
                subgroup: 2,
                conflict: true,
              },
            ];
          } else {
            // Обычный урок
            const subjIdx = (lesson + ci) % subjectNames.length;
            const teacherIdx = (lesson + ci) % teacherNames.length;
            const roomIdx = (lesson + ci) % roomNames.length;
            schedule[key] = [
              {
                subject: subjectNames[subjIdx],
                teacher: teacherNames[teacherIdx],
                room: roomNames[roomIdx],
                subgroup: 1,
                conflict: false,
              },
            ];
            // Для классов с подгруппами — делим урок
            const classObj = classes.find(c => c.name === cls);
            if (classObj && classObj.subgroups > 1) {
              for (let sg = 2; sg <= classObj.subgroups; sg++) {
                schedule[key].push({
                  subject: subjectNames[(subjIdx + sg) % subjectNames.length],
                  teacher: teacherNames[(teacherIdx + sg) % teacherNames.length],
                  room: roomNames[(roomIdx + sg) % roomNames.length],
                  subgroup: sg,
                  conflict: false,
                });
              }
            }
          }
        });
      });
    });
    return schedule;
  };

  const handleGenerate = () => {
    setSchedule(generateMockSchedule());
    setIsGenerated(true);
  };

  const handleClear = () => {
    setSchedule(null);
    setIsGenerated(false);
  };

  const renderTeachers = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Список учителей</div>
        <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={() => setShowAdd(true)}>
          + Добавить учителя
        </button>
      </div>
      <table className="w-full table-auto border mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-2">ФИО</th>
            <th className="py-2 px-2">Предметы</th>
            <th className="py-2 px-2">Нагрузка (ч)</th>
            <th className="py-2 px-2">Дни</th>
            <th className="py-2 px-2">Уроки</th>
            <th className="py-2 px-2">Ограничения</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.id} className="border-b">
              <td className="py-2 px-2">{t.name}</td>
              <td className="py-2 px-2">{t.subjects.join(', ')}</td>
              <td className="py-2 px-2">{t.workload}</td>
              <td className="py-2 px-2">{t.availableDays.join(', ')}</td>
              <td className="py-2 px-2">{t.availableLessons.join(', ')}</td>
              <td className="py-2 px-2 text-xs">
                {t.restrictions.notInRow && <span className="mr-2 bg-gray-100 px-2 py-1 rounded">не подряд</span>}
                {t.restrictions.onlyMorning && <span className="mr-2 bg-blue-100 px-2 py-1 rounded">только утро</span>}
                <span className="bg-green-100 px-2 py-1 rounded">макс. {t.restrictions.maxPerDay} в день</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAdd && (
        <div className="bg-white border rounded-xl p-6 shadow-lg max-w-lg mx-auto mb-6">
          <div className="mb-2 font-semibold">Добавить учителя</div>
          <input
            className="input-filter mb-2 w-full"
            placeholder="ФИО"
            value={newTeacher.name}
            onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
          />
          <input
            className="input-filter mb-2 w-full"
            placeholder="Предметы (через запятую)"
            value={newTeacher.subjects}
            onChange={e => setNewTeacher({ ...newTeacher, subjects: e.target.value })}
          />
          <input
            className="input-filter mb-2 w-full"
            type="number"
            min={1}
            max={40}
            placeholder="Нагрузка (ч)"
            value={newTeacher.workload}
            onChange={e => setNewTeacher({ ...newTeacher, workload: Number(e.target.value) })}
          />
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Доступные дни</div>
            <div className="flex gap-2">
              {DAYS.map(day => (
                <label key={day} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={newTeacher.availableDays.includes(day)}
                    onChange={e => {
                      setNewTeacher({
                        ...newTeacher,
                        availableDays: e.target.checked
                          ? [...newTeacher.availableDays, day]
                          : newTeacher.availableDays.filter(d => d !== day),
                      });
                    }}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Доступные уроки</div>
            <div className="flex gap-2">
              {LESSONS.map(lesson => (
                <label key={lesson} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={newTeacher.availableLessons.includes(lesson)}
                    onChange={e => {
                      setNewTeacher({
                        ...newTeacher,
                        availableLessons: e.target.checked
                          ? [...newTeacher.availableLessons, lesson]
                          : newTeacher.availableLessons.filter(l => l !== lesson),
                      });
                    }}
                  />
                  <span>{lesson}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-2 flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={newTeacher.restrictions.notInRow}
                onChange={e => setNewTeacher({ ...newTeacher, restrictions: { ...newTeacher.restrictions, notInRow: e.target.checked } })}
              />
              <span>не подряд</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={newTeacher.restrictions.onlyMorning}
                onChange={e => setNewTeacher({ ...newTeacher, restrictions: { ...newTeacher.restrictions, onlyMorning: e.target.checked } })}
              />
              <span>только утро</span>
            </label>
            <label className="flex items-center gap-1">
              <span>макс. в день</span>
              <input
                type="number"
                min={1}
                max={6}
                className="input-filter w-16"
                value={newTeacher.restrictions.maxPerDay}
                onChange={e => setNewTeacher({ ...newTeacher, restrictions: { ...newTeacher.restrictions, maxPerDay: Number(e.target.value) } })}
              />
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={handleAddTeacher}>
              Добавить
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-lg" onClick={() => setShowAdd(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderClasses = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Список классов</div>
        <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={() => setShowAddClass(true)}>
          + Добавить класс
        </button>
      </div>
      <table className="w-full table-auto border mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-2">Название</th>
            <th className="py-2 px-2">Подгруппы</th>
            <th className="py-2 px-2">Учебных дней</th>
            <th className="py-2 px-2">Макс. уроков в день</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls.id} className="border-b">
              <td className="py-2 px-2">{cls.name}</td>
              <td className="py-2 px-2">{cls.subgroups}</td>
              <td className="py-2 px-2">{cls.days}</td>
              <td className="py-2 px-2">{cls.maxLessons}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddClass && (
        <div className="bg-white border rounded-xl p-6 shadow-lg max-w-lg mx-auto mb-6">
          <div className="mb-2 font-semibold">Добавить класс</div>
          <input
            className="input-filter mb-2 w-full"
            placeholder="Название (например, 7А)"
            value={newClass.name}
            onChange={e => setNewClass({ ...newClass, name: e.target.value })}
          />
          <div className="mb-2 flex gap-4">
            <label className="flex items-center gap-1">
              <span>Подгруппы</span>
              <input
                type="number"
                min={1}
                max={4}
                className="input-filter w-16"
                value={newClass.subgroups}
                onChange={e => setNewClass({ ...newClass, subgroups: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-1">
              <span>Учебных дней</span>
              <input
                type="number"
                min={3}
                max={6}
                className="input-filter w-16"
                value={newClass.days}
                onChange={e => setNewClass({ ...newClass, days: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-1">
              <span>Макс. уроков в день</span>
              <input
                type="number"
                min={4}
                max={8}
                className="input-filter w-16"
                value={newClass.maxLessons}
                onChange={e => setNewClass({ ...newClass, maxLessons: Number(e.target.value) })}
              />
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={handleAddClass}>
              Добавить
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-lg" onClick={() => setShowAddClass(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubjects = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Список предметов</div>
        <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={() => setShowAddSubject(true)}>
          + Добавить предмет
        </button>
      </div>
      <table className="w-full table-auto border mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-2">Название</th>
            <th className="py-2 px-2">Спецкабинет</th>
            {PARALLELS.map(p => <th key={p} className="py-2 px-2">{p} класс (ч/нед)</th>)}
            <th className="py-2 px-2">Деление на группы</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(subj => (
            <tr key={subj.id} className="border-b">
              <td className="py-2 px-2">{subj.name}</td>
              <td className="py-2 px-2">{subj.specialRoom ? 'Да' : 'Нет'}</td>
              {PARALLELS.map(p => <td key={p} className="py-2 px-2">{subj.hours[p]}</td>)}
              <td className="py-2 px-2">{subj.groupSplit ? 'Да' : 'Нет'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddSubject && (
        <div className="bg-white border rounded-xl p-6 shadow-lg max-w-lg mx-auto mb-6">
          <div className="mb-2 font-semibold">Добавить предмет</div>
          <input
            className="input-filter mb-2 w-full"
            placeholder="Название предмета"
            value={newSubject.name}
            onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
          />
          <div className="mb-2 flex gap-4 items-center">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={newSubject.specialRoom}
                onChange={e => setNewSubject({ ...newSubject, specialRoom: e.target.checked })}
              />
              <span>Требуется спецкабинет</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={newSubject.groupSplit}
                onChange={e => setNewSubject({ ...newSubject, groupSplit: e.target.checked })}
              />
              <span>Деление на группы</span>
            </label>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Часы в неделю по параллелям</div>
            <div className="flex gap-2">
              {PARALLELS.map(p => (
                <label key={p} className="flex items-center gap-1">
                  <span>{p} класс</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    className="input-filter w-16"
                    value={newSubject.hours[p]}
                    onChange={e => setNewSubject({ ...newSubject, hours: { ...newSubject.hours, [p]: Number(e.target.value) } })}
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={handleAddSubject}>
              Добавить
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-lg" onClick={() => setShowAddSubject(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderRooms = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Список кабинетов</div>
        <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={() => setShowAddRoom(true)}>
          + Добавить кабинет
        </button>
      </div>
      <table className="w-full table-auto border mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-2">Название</th>
            <th className="py-2 px-2">Тип</th>
            <th className="py-2 px-2">Предметная привязка</th>
            <th className="py-2 px-2">Вместимость</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id} className="border-b">
              <td className="py-2 px-2">{room.name}</td>
              <td className="py-2 px-2">{room.type}</td>
              <td className="py-2 px-2">{room.subject}</td>
              <td className="py-2 px-2">{room.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddRoom && (
        <div className="bg-white border rounded-xl p-6 shadow-lg max-w-lg mx-auto mb-6">
          <div className="mb-2 font-semibold">Добавить кабинет</div>
          <input
            className="input-filter mb-2 w-full"
            placeholder="Название (например, 101)"
            value={newRoom.name}
            onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
          />
          <div className="mb-2 flex gap-4 items-center">
            <label className="flex items-center gap-1">
              <span>Тип</span>
              <select
                className="input-filter"
                value={newRoom.type}
                onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
              >
                {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-1">
              <span>Предмет</span>
              <input
                className="input-filter"
                placeholder="(опц.)"
                value={newRoom.subject}
                onChange={e => setNewRoom({ ...newRoom, subject: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-1">
              <span>Вместимость</span>
              <input
                type="number"
                min={10}
                max={40}
                className="input-filter w-16"
                value={newRoom.capacity}
                onChange={e => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
              />
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={handleAddRoom}>
              Добавить
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-lg" onClick={() => setShowAddRoom(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderConstraints = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Ограничения</div>
        <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={() => setShowAddConstraint(true)}>
          + Добавить ограничение
        </button>
      </div>
      <table className="w-full table-auto border mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-2">Тип</th>
            <th className="py-2 px-2">Для кого</th>
            <th className="py-2 px-2">Описание</th>
          </tr>
        </thead>
        <tbody>
          {constraints.map(c => (
            <tr key={c.id} className="border-b">
              <td className="py-2 px-2">{c.type}</td>
              <td className="py-2 px-2">{c.type === 'Общее' ? '—' : c.target}</td>
              <td className="py-2 px-2">{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddConstraint && (
        <div className="bg-white border rounded-xl p-6 shadow-lg max-w-lg mx-auto mb-6">
          <div className="mb-2 font-semibold">Добавить ограничение</div>
          <div className="mb-2 flex gap-4 items-center">
            <label className="flex items-center gap-1">
              <span>Тип</span>
              <select
                className="input-filter"
                value={newConstraint.type}
                onChange={e => setNewConstraint({ ...newConstraint, type: e.target.value })}
              >
                <option value="Общее">Общее</option>
                <option value="Персональное">Персональное</option>
              </select>
            </label>
            {newConstraint.type === 'Персональное' && (
              <label className="flex items-center gap-1">
                <span>Для кого</span>
                <input
                  className="input-filter"
                  placeholder="Класс или учитель"
                  value={newConstraint.target}
                  onChange={e => setNewConstraint({ ...newConstraint, target: e.target.value })}
                />
              </label>
            )}
          </div>
          <input
            className="input-filter mb-2 w-full"
            placeholder="Описание ограничения"
            value={newConstraint.description}
            onChange={e => setNewConstraint({ ...newConstraint, description: e.target.value })}
          />
          <div className="flex gap-2 mt-4">
            <button className="bg-corporate-primary text-white px-4 py-2 rounded-lg" onClick={handleAddConstraint}>
              Добавить
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-lg" onClick={() => setShowAddConstraint(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderGenerationPanel = () => (
    <div className="bg-white shadow-notion rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-4 items-center flex-wrap">
        <button className="bg-corporate-primary text-white px-6 py-2 rounded-lg font-semibold" onClick={handleGenerate}>
          Сгенерировать расписание
        </button>
        <label className="flex items-center gap-2">
          <span>Недель:</span>
          <select className="input-filter" value={weeks} onChange={e => setWeeks(Number(e.target.value))}>
            {[1,2,3].map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </label>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button className="bg-gray-100 px-4 py-2 rounded-lg" onClick={handleClear}>Очистить</button>
        <button className="bg-gray-100 px-4 py-2 rounded-lg">Импортировать</button>
        <button className="bg-gray-100 px-4 py-2 rounded-lg">Сбросить</button>
        <button className="bg-gray-100 px-4 py-2 rounded-lg">Сохранить шаблон</button>
      </div>
    </div>
  );

  const renderScheduleGrid = () => (
    <div className="bg-white shadow-notion rounded-xl p-6 animate-fadeIn dashboard-card mt-4">
      <div className="text-lg font-semibold mb-4">Расписание (демо-сетка)</div>
      <div className="overflow-x-auto">
        {classes.length === 0 ? (
          <div className="text-gray-400 text-center py-8">Нет классов для отображения</div>
        ) : (
          classes.map(cls => (
            <div key={cls.name} className="mb-8">
              <div className="font-bold text-corporate-primary mb-2">Класс {cls.name}</div>
              <table className="min-w-full border mb-2">
                <thead>
                  <tr>
                    <th className="py-2 px-2 border-b bg-gray-50">Урок</th>
                    {WEEKDAYS.map(day => (
                      <th key={day} className="py-2 px-2 border-b bg-gray-50">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LESSON_NUMBERS.map(num => (
                    <tr key={num}>
                      <td className="py-2 px-2 border-b font-semibold bg-gray-50">{num}</td>
                      {WEEKDAYS.map(day => {
                        const key = `${day}_${num}_${cls.name}`;
                        const lessons = schedule?.[key] || [];
                        return (
                          <td key={day} className="py-2 px-2 border-b text-center">
                            {lessons.length === 0 && <span className="text-gray-300">—</span>}
                            <div className="flex flex-col gap-1 items-center">
                              {lessons.map((l: any, idx: number) => (
                                <div
                                  key={idx}
                                  className={`rounded-lg px-2 py-1 text-xs font-semibold mb-1 flex items-center gap-1
                                    ${TEACHER_COLORS[l.teacher] || 'bg-gray-100 text-gray-700'}
                                    ${l.conflict ? 'border-2 border-red-500 animate-pulse' : ''}
                                  `}
                                  title={l.conflict ? 'Конфликт: учитель занят в нескольких классах' : ''}
                                >
                                  <span>{l.subject}</span>
                                  <span className="opacity-60">/</span>
                                  <span>{l.teacher}</span>
                                  <span className="opacity-60">/</span>
                                  <span>{l.room}</span>
                                  {lessons.length > 1 && <span className="ml-1 bg-white text-gray-500 border px-1 rounded text-[10px]">{l.subgroup}</span>}
                                  {l.conflict && <span className="ml-1 text-red-600 font-bold">⚠</span>}
                                </div>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
      <div className="text-gray-400 text-center mt-6">{classes.length > 0 ? 'Демо: карточки уроков, подгруппы, конфликты' : 'Здесь появится сгенерированное расписание'}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-corporate-primary">Генератор расписания</h1>
      <div className="text-gray-600 mb-8 text-lg">
        Сформируйте автоматическое расписание на неделю для всех классов и учителей с учётом ограничений
      </div>

      {renderGenerationPanel()}

      {/* Вкладки */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-5 py-2 rounded-t-lg font-medium transition-all duration-200 focus:outline-none whitespace-nowrap
              ${activeTab === tab.key
                ? 'bg-white shadow-notion text-corporate-primary'
                : 'bg-gray-100 text-gray-500 hover:bg-white hover:text-corporate-primary'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент вкладки */}
      <div className="bg-white shadow-notion rounded-xl p-6 min-h-[200px] animate-fadeIn dashboard-card">
        {activeTab === 'teachers' && renderTeachers()}
        {activeTab === 'classes' && renderClasses()}
        {activeTab === 'subjects' && renderSubjects()}
        {activeTab === 'rooms' && renderRooms()}
        {activeTab === 'constraints' && renderConstraints()}
        {activeTab !== 'teachers' && activeTab !== 'classes' && activeTab !== 'subjects' && activeTab !== 'rooms' && activeTab !== 'constraints' && (
          <div className="text-gray-400 text-center py-12 text-lg">
            {TABS.find(t => t.key === activeTab)?.label} — секция в разработке
          </div>
        )}
      </div>

      {isGenerated && renderScheduleGrid()}
    </div>
  );
};

export default ScheduleAutogenPage; 