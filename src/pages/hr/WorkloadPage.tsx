import React, { useState } from 'react';
import {
  FaDownload,
  FaFilter,
  FaSearch,
  FaFileExport,
  FaSortAmountDown,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaUserAlt,
  FaTrophy,
  FaUserGraduate,
  FaChalkboardTeacher
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TeacherWorkload {
  id: string;
  name: string;
  department: string;
  position: string;
  standardHours: number;
  actualHours: number;
  monthlyHours: {
    month: number;
    standardHours: number;
    actualHours: number;
  }[];
  quarterlyHours: {
    quarter: number;
    standardHours: number;
    actualHours: number;
  }[];
  subjects: {
    name: string;
    hours: number;
    classes: string[];
  }[];
  additionalActivities: {
    name: string;
    hours: number;
    description: string;
  }[];
  vacationDays: number;
  sickLeaveDays: number;
  olympiadPreparation?: number; // Часы на подготовку к олимпиадам
  olympiadResults?: {
    year: string;
    competition: string;
    level: string;
    results: string;
  }[]; // Результаты олимпиад учеников
  advancedPrograms?: string[]; // Специализированные программы
  educationLevel?: string; // Уровень образования
  specialization?: string; // Специализация
  competitionHours?: number; // Часы на подготовку к соревнованиям
}

const initialTeachers: TeacherWorkload[] = [
  {
    id: '001',
    name: 'Сатпаев Арман Болатович',
    department: 'Кафедра математики',
    position: 'Преподаватель высшей математики',
    standardHours: 720,
    actualHours: 680,
    monthlyHours: [
      { month: 9, standardHours: 80, actualHours: 75 },
      { month: 10, standardHours: 80, actualHours: 82 },
      { month: 11, standardHours: 80, actualHours: 78 },
      { month: 12, standardHours: 60, actualHours: 58 },
      { month: 1, standardHours: 80, actualHours: 76 },
      { month: 2, standardHours: 80, actualHours: 80 },
      { month: 3, standardHours: 80, actualHours: 82 },
      { month: 4, standardHours: 80, actualHours: 75 },
      { month: 5, standardHours: 100, actualHours: 95 }
    ],
    quarterlyHours: [
      { quarter: 1, standardHours: 240, actualHours: 235 },
      { quarter: 2, standardHours: 220, actualHours: 214 },
      { quarter: 3, standardHours: 240, actualHours: 238 },
      { quarter: 4, standardHours: 180, actualHours: 170 }
    ],
    subjects: [
      {
        name: 'Алгебра (углубленный курс)',
        hours: 280,
        classes: ['10A', '10Б', '11A', '11Б']
      },
      {
        name: 'Математический анализ',
        hours: 240,
        classes: ['10A', '10Б', '11A', '11Б']
      },
      {
        name: 'Олимпиадная математика',
        hours: 120,
        classes: ['11A', '11Б']
      }
    ],
    additionalActivities: [
      {
        name: 'Руководство методическим объединением',
        hours: 40,
        description: 'Координация работы преподавателей математики'
      },
      {
        name: 'Подготовка к Республиканской олимпиаде',
        hours: 60,
        description: 'Занятия с одаренными учениками'
      }
    ],
    vacationDays: 28,
    sickLeaveDays: 5,
    olympiadPreparation: 60,
    olympiadResults: [
      {
        year: '2024',
        competition: 'Международная математическая олимпиада',
        level: 'Международный',
        results: '1 серебряная, 2 бронзовые медали'
      },
      {
        year: '2023',
        competition: 'Республиканская олимпиада по математике',
        level: 'Республиканский',
        results: '2 золотые, 3 серебряные медали'
      }
    ],
    advancedPrograms: ['Подготовка к IMO', 'Высшая математика для школьников', 'Теория чисел'],
    educationLevel: 'Кандидат физико-математических наук',
    specialization: 'Дифференциальные уравнения',
    competitionHours: 120
  },
  {
    id: '002',
    name: 'Нурланова Айгуль Муратовна',
    department: 'Кафедра математики',
    position: 'Преподаватель алгебры',
    standardHours: 680,
    actualHours: 700,
    monthlyHours: [
      { month: 9, standardHours: 75, actualHours: 78 },
      { month: 10, standardHours: 75, actualHours: 77 },
      { month: 11, standardHours: 75, actualHours: 76 },
      { month: 12, standardHours: 55, actualHours: 57 },
      { month: 1, standardHours: 75, actualHours: 78 },
      { month: 2, standardHours: 75, actualHours: 77 },
      { month: 3, standardHours: 75, actualHours: 79 },
      { month: 4, standardHours: 75, actualHours: 77 },
      { month: 5, standardHours: 100, actualHours: 101 }
    ],
    quarterlyHours: [
      { quarter: 1, standardHours: 225, actualHours: 231 },
      { quarter: 2, standardHours: 205, actualHours: 212 },
      { quarter: 3, standardHours: 225, actualHours: 234 },
      { quarter: 4, standardHours: 175, actualHours: 178 }
    ],
    subjects: [
      {
        name: 'Алгебра (базовый курс)',
        hours: 360,
        classes: ['8А', '8Б', '9A', '9Б']
      },
      {
        name: 'Геометрия',
        hours: 300,
        classes: ['8А', '8Б', '9A', '9Б']
      },
      {
        name: 'Математическая логика',
        hours: 120,
        classes: ['9A', '9Б']
      }
    ],
    additionalActivities: [
      {
        name: 'Подготовка к олимпиадам',
        hours: 40,
        description: 'Дополнительные занятия с одаренными учениками'
      },
      {
        name: 'Разработка учебных материалов',
        hours: 30,
        description: 'Создание специализированных пособий по алгебре'
      }
    ],
    vacationDays: 35,
    sickLeaveDays: 0,
    olympiadPreparation: 40,
    olympiadResults: [
      {
        year: '2024',
        competition: 'Городская олимпиада по математике',
        level: 'Городской',
        results: '3 первых места, 5 призеров'
      }
    ],
    advancedPrograms: ['Нестандартные методы решения алгебраических задач', 'Элементы теории групп'],
    educationLevel: 'Магистр математики',
    specialization: 'Алгебра и теория чисел',
    competitionHours: 80
  },
  {
    id: '003',
    name: 'Ким Дмитрий Алексеевич',
    department: 'Кафедра математики',
    position: 'Преподаватель геометрии',
    standardHours: 640,
    actualHours: 620,
    monthlyHours: [
      { month: 9, standardHours: 70, actualHours: 68 },
      { month: 10, standardHours: 70, actualHours: 69 },
      { month: 11, standardHours: 70, actualHours: 67 },
      { month: 12, standardHours: 50, actualHours: 48 },
      { month: 1, standardHours: 70, actualHours: 69 },
      { month: 2, standardHours: 70, actualHours: 68 },
      { month: 3, standardHours: 70, actualHours: 67 },
      { month: 4, standardHours: 70, actualHours: 66 },
      { month: 5, standardHours: 100, actualHours: 98 }
    ],
    quarterlyHours: [
      { quarter: 1, standardHours: 210, actualHours: 204 },
      { quarter: 2, standardHours: 190, actualHours: 185 },
      { quarter: 3, standardHours: 210, actualHours: 204 },
      { quarter: 4, standardHours: 170, actualHours: 164 }
    ],
    subjects: [
      {
        name: 'Геометрия (углубленный курс)',
        hours: 320,
        classes: ['10A', '10Б', '11A', '11Б']
      },
      {
        name: 'Аналитическая геометрия',
        hours: 160,
        classes: ['10A', '10Б', '11A', '11Б']
      },
      {
        name: 'Проективная геометрия',
        hours: 120,
        classes: ['11A', '11Б']
      }
    ],
    additionalActivities: [
      {
        name: 'Научное руководство проектами',
        hours: 20,
        description: 'Руководство научными проектами учеников'
      },
      {
        name: 'Проведение дополнительных консультаций',
        hours: 40,
        description: 'Индивидуальные занятия с отстающими учениками'
      }
    ],
    vacationDays: 28,
    sickLeaveDays: 3,
    olympiadPreparation: 30,
    olympiadResults: [
      {
        year: '2023',
        competition: 'Международная олимпиада по геометрии',
        level: 'Международный',
        results: '1 бронзовая медаль'
      }
    ],
    advancedPrograms: ['Геометрия в олимпиадных задачах', 'Введение в топологию'],
    educationLevel: 'Кандидат физико-математических наук',
    specialization: 'Геометрия и топология',
    competitionHours: 60
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const WorkloadPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherWorkload[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherWorkload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'year'>('year');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState<'standard' | 'olympiad'>('standard');

  const departments = [...new Set(teachers.map(t => t.department))];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === null || teacher.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const getMonthName = (month: number): string => {
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return months[month - 1];
  };

  const getQuarterName = (quarter: number): string => {
    return `${quarter} четверть`;
  };

  const getPeriodData = (teacher: TeacherWorkload) => {
    switch (periodType) {
      case 'month':
        const monthData = teacher.monthlyHours.find(m => m.month === selectedPeriod);
        return {
          standardHours: monthData?.standardHours || 0,
          actualHours: monthData?.actualHours || 0
        };
      case 'quarter':
        const quarterData = teacher.quarterlyHours.find(q => q.quarter === selectedPeriod);
        return {
          standardHours: quarterData?.standardHours || 0,
          actualHours: quarterData?.actualHours || 0
        };
      default:
        return {
          standardHours: teacher.standardHours,
          actualHours: teacher.actualHours
        };
    }
  };

  // Обновляем агрегированные данные с учетом выбранного периода
  const departmentWorkload = departments.map(dept => {
    const teachersInDept = teachers.filter(t => t.department === dept);
    const periodTotals = teachersInDept.reduce((sum, teacher) => {
      const periodData = getPeriodData(teacher);
      return {
        standardHours: sum.standardHours + periodData.standardHours,
        actualHours: sum.actualHours + periodData.actualHours
      };
    }, { standardHours: 0, actualHours: 0 });

    return {
      name: dept,
      standardHours: periodTotals.standardHours,
      actualHours: periodTotals.actualHours,
      difference: periodTotals.actualHours - periodTotals.standardHours
    };
  });

  const subjectWorkload = Array.from(new Set(
    teachers.flatMap(t => t.subjects.map(s => s.name))
  )).map(subjectName => {
    const hours = teachers.reduce((sum, teacher) => {
      const subject = teacher.subjects.find(s => s.name === subjectName);
      return sum + (subject?.hours || 0);
    }, 0);

    return {
      name: subjectName,
      hours
    };
  }).sort((a, b) => b.hours - a.hours);

  // Новые данные для олимпиадной подготовки
  const olympiadData = teachers
    .filter(t => t.olympiadPreparation && t.olympiadPreparation > 0)
    .map(t => ({
      name: t.name,
      hours: t.olympiadPreparation || 0,
      results: t.olympiadResults?.length || 0
    }))
    .sort((a, b) => b.hours - a.hours);

  // Новые данные для общей статистики по олимпиадам
  const olympiadLevels = ['Школьный', 'Городской', 'Областной', 'Республиканский', 'Международный'];
  const olympiadResultsData = olympiadLevels.map(level => {
    const count = teachers.reduce((sum, teacher) => {
      return sum + (teacher.olympiadResults?.filter(r => r.level === level).length || 0);
    }, 0);

    return {
      name: level,
      count
    };
  });

  const handleTeacherClick = (teacher: TeacherWorkload) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} ч.
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Нагрузки и расписание ставок</h1>
            <p className="text-sm text-gray-500">Управление педагогической нагрузкой и ставками</p>
          </div>
          <div className="relative flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <select
              className="pl-8 pr-2 py-1.5 text-sm border-0 bg-transparent focus:ring-0 appearance-none cursor-pointer"
              value={periodType}
              onChange={(e) => {
                setPeriodType(e.target.value as 'month' | 'quarter' | 'year');
                setSelectedPeriod(e.target.value === 'month' ? new Date().getMonth() + 1 : 1);
              }}
            >
              <option value="year">За год</option>
              <option value="quarter">По четвертям</option>
              <option value="month">По месяцам</option>
            </select>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>

            {periodType !== 'year' && (
              <>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="relative">
                  <select
                    className="pl-2 pr-6 py-1.5 text-sm border-0 bg-transparent focus:ring-0 appearance-none cursor-pointer"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                  >
                    {periodType === 'month' ? (
                      Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>{getMonthName(month)}</option>
                      ))
                    ) : (
                      Array.from({ length: 4 }, (_, i) => i + 1).map(quarter => (
                        <option key={quarter} value={quarter}>{getQuarterName(quarter)}</option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaChevronDown className="text-gray-400" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('standard')}
          >
            <FaChalkboardTeacher className="mr-2" />
            Стандартная нагрузка
          </button>
          <button
            className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'olympiad' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('olympiad')}
          >
            <FaTrophy className="mr-2" />
            Олимпиадная подготовка
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center">
            <FaFileExport className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {viewMode === 'standard' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4 overflow-hidden">
              <h2 className="text-lg font-semibold mb-4">Нагрузка по кафедрам</h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart
                    data={departmentWorkload}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      label={{
                        value: 'Часы',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#6B7280' }
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "14px"
                      }}
                    />
                    <Bar
                      dataKey="standardHours"
                      name="Норма часов"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="actualHours"
                      name="Фактические часы"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 overflow-hidden">
              <h2 className="text-lg font-semibold mb-4">Распределение по предметам</h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="99%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectWorkload}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="hours"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#374151"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            className="text-sm"
                          >
                            {subjectWorkload[index].name} ({value} ч.)
                          </text>
                        );
                      }}
                    >
                      {subjectWorkload.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-medium text-gray-900">
                                {payload[0].name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {payload[0].value} ч. от общей нагрузки
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск преподавателя..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 appearance-none"
                  value={selectedDepartment || ''}
                  onChange={(e) => setSelectedDepartment(e.target.value || null)}
                >
                  <option value="">Все кафедры</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Преподаватель
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кафедра
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Нормативная нагрузка
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Фактическая нагрузка
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Отклонение
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => {
                  const periodData = getPeriodData(teacher);
                  return (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTeacherClick(teacher)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {periodData.standardHours} ч.
                        <div className="text-xs text-gray-400">
                          {periodType === 'month' ? getMonthName(selectedPeriod) :
                            periodType === 'quarter' ? getQuarterName(selectedPeriod) :
                              'За год'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {periodData.actualHours} ч.
                        <div className="text-xs text-gray-400">
                          {periodType === 'month' ? getMonthName(selectedPeriod) :
                            periodType === 'quarter' ? getQuarterName(selectedPeriod) :
                              'За год'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${periodData.actualHours > periodData.standardHours ? 'bg-red-100 text-red-800' :
                              periodData.actualHours < periodData.standardHours ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'}`}>
                            {periodData.actualHours - periodData.standardHours} ч.
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Режим олимпиадной подготовки
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4 overflow-hidden">
              <h2 className="text-lg font-semibold mb-4">Часы на подготовку к олимпиадам</h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart
                    data={olympiadData}
                    margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-medium text-gray-900">{label}</p>
                              <p className="text-sm text-gray-600">
                                Часы на подготовку: {payload[0].value}
                              </p>
                              <p className="text-sm text-gray-600">
                                Кол-во результатов: {payload[1]?.value || 0}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="hours" name="Часы на подготовку" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="results" name="Количество результатов" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 overflow-hidden">
              <h2 className="text-lg font-semibold mb-4">Результаты олимпиад по уровням</h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart
                    data={olympiadResultsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      label={{
                        value: 'Количество результатов',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#6B7280' }
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Количество результатов"
                      fill="#FF8042"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Преподаватель
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Специализация
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Часы на олимпиады
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Результаты
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Программы подготовки
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers
                  .filter(teacher => teacher.olympiadPreparation && teacher.olympiadPreparation > 0)
                  .map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTeacherClick(teacher)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.specialization || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {teacher.olympiadPreparation} ч.
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.olympiadResults?.length || 0} результатов</div>
                        {teacher.olympiadResults && teacher.olympiadResults.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Лучший: {teacher.olympiadResults[0].competition}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.advancedPrograms?.map((program, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs"
                            >
                              {program}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Модальное окно с подробностями о нагрузке преподавателя */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h2>
                  <p className="text-gray-600">{selectedTeacher.position} • {selectedTeacher.department}</p>
                  {selectedTeacher.educationLevel && (
                    <p className="text-sm text-blue-600 mt-1">{selectedTeacher.educationLevel}</p>
                  )}
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-700">Нормативная нагрузка</div>
                  <div className="text-2xl font-bold">
                    {getPeriodData(selectedTeacher).standardHours} ч.
                    <div className="text-sm font-normal text-blue-600">
                      {periodType === 'month' ? getMonthName(selectedPeriod) :
                        periodType === 'quarter' ? getQuarterName(selectedPeriod) :
                          'За год'}
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-700">Фактическая нагрузка</div>
                  <div className="text-2xl font-bold">
                    {getPeriodData(selectedTeacher).actualHours} ч.
                    <div className="text-sm font-normal text-green-600">
                      {periodType === 'month' ? getMonthName(selectedPeriod) :
                        periodType === 'quarter' ? getQuarterName(selectedPeriod) :
                          'За год'}
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${getPeriodData(selectedTeacher).actualHours > getPeriodData(selectedTeacher).standardHours ? 'bg-red-50 text-red-700' :
                  getPeriodData(selectedTeacher).actualHours < getPeriodData(selectedTeacher).standardHours ? 'bg-yellow-50 text-yellow-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                  <div className="text-sm">Отклонение</div>
                  <div className="text-2xl font-bold">
                    {getPeriodData(selectedTeacher).actualHours - getPeriodData(selectedTeacher).standardHours} ч.
                  </div>
                </div>
              </div>

              {/* Информация о специализации для математических олимпиад */}
              {selectedTeacher.olympiadPreparation && selectedTeacher.olympiadPreparation > 0 && (
                <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-indigo-800">Олимпиадная подготовка</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-indigo-600">Часы на подготовку</div>
                      <div className="text-xl font-bold text-indigo-900">{selectedTeacher.olympiadPreparation} ч.</div>
                    </div>
                    <div>
                      <div className="text-sm text-indigo-600">Специализация</div>
                      <div className="text-lg text-indigo-900">{selectedTeacher.specialization || 'Не указана'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-indigo-600">Результаты</div>
                      <div className="text-lg text-indigo-900">{selectedTeacher.olympiadResults?.length || 0} олимпиад</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Программы для углубленной математики */}
              {selectedTeacher.advancedPrograms && selectedTeacher.advancedPrograms.length > 0 && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Специализированные программы</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.advancedPrograms.map((program, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* График нагрузки по периодам */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Динамика нагрузки</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        periodType === 'month'
                          ? selectedTeacher.monthlyHours
                          : selectedTeacher.quarterlyHours
                      }
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey={periodType === 'month' ? 'month' : 'quarter'}
                        tickFormatter={
                          periodType === 'month'
                            ? (value) => getMonthName(value).substring(0, 3)
                            : (value) => `${value} чет.`
                        }
                      />
                      <YAxis
                        label={{
                          value: 'Часы',
                          angle: -90,
                          position: 'insideLeft',
                          style: { fill: '#6B7280' }
                        }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                <p className="font-medium text-gray-900">
                                  {periodType === 'month' ? getMonthName(label) : `${label} четверть`}
                                </p>
                                {payload.map((entry: any) => (
                                  <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name === 'standardHours' ? 'Норма: ' : 'Факт: '}
                                    {entry.value} ч.
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="standardHours" name="Норма часов" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actualHours" name="Фактические часы" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Распределение нагрузки по предметам</h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Предмет
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Классы
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Часы
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedTeacher.subjects.map((subject, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {subject.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {subject.classes.map((cls, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                                >
                                  {cls}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {subject.hours} ч.
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedTeacher.additionalActivities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Дополнительная нагрузка</h3>
                  <div className="space-y-3">
                    {selectedTeacher.additionalActivities.map((activity, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">{activity.name}</span>
                          <span className="text-gray-700">{activity.hours} ч.</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Результаты олимпиад */}
              {selectedTeacher.olympiadResults && selectedTeacher.olympiadResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Результаты олимпиад</h3>
                  <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Год
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Соревнование
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Уровень
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Результаты
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTeacher.olympiadResults.map((result, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.year}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {result.competition}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.level === 'Международный' ? 'bg-purple-100 text-purple-800' :
                                result.level === 'Республиканский' ? 'bg-blue-100 text-blue-800' :
                                  result.level === 'Областной' ? 'bg-green-100 text-green-800' :
                                    result.level === 'Городской' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                }`}>
                                {result.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {result.results}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <span className="text-sm text-gray-700">Отпуск</span>
                    </div>
                    <span className="font-semibold">{selectedTeacher.vacationDays} дней</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaClock className="text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-700">Больничный</span>
                    </div>
                    <span className="font-semibold">{selectedTeacher.sickLeaveDays} дней</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md mr-2">
                  Выгрузить данные
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Редактировать нагрузку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkloadPage;