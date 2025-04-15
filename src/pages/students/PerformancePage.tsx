import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend
} from 'recharts';
import { FaEllipsisH, FaArrowUp, FaArrowDown, FaChevronDown, FaClipboardCheck } from 'react-icons/fa';

interface Subject {
  name: string;
  grade: number;
  attendance: number;
  assignments: number;
  participation: number;
}

interface Student {
  name: string;
  grade: number;
  trend?: number;
}

interface ClassData {
  id: string;
  name: string;
  averageGrade: number;
  attendance: number;
  assignments: number;
  studentsCount: number;
}

interface TrialTestResult {
  studentName: string;
  subjectName: string;
  score: number;
  maxScore: number;
  date: string;
  progressSince: number;
}

const PerformancePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isClassSelectorOpen, setIsClassSelectorOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'general' | 'trialTests'>('general');

  const subjects: Subject[] = [
    { name: 'Математика', grade: 4.3, attendance: 95, assignments: 92, participation: 88 },
    { name: 'История', grade: 4.0, attendance: 88, assignments: 85, participation: 90 },
    { name: 'Биология', grade: 3.8, attendance: 92, assignments: 88, participation: 85 },
    { name: 'Английский', grade: 4.5, attendance: 94, assignments: 96, participation: 92 },
    { name: 'Физика', grade: 4.1, attendance: 90, assignments: 89, participation: 87 },
    { name: 'Химия', grade: 3.9, attendance: 91, assignments: 87, participation: 86 }
  ];

  const lowPerformingStudents: Student[] = [
    { name: 'Арман Сериков', grade: 2.8, trend: -0.2 },
    { name: 'Айдос Нурланов', grade: 3.1, trend: -0.1 },
    { name: 'Айгерим Жумабаева', grade: 3.3, trend: -0.3 }
  ];

  const highProgressStudents: Student[] = [
    { name: 'Бекзат Оспанов', grade: 4.8, trend: 0.5 },
    { name: 'Мадина Сатыбалды', grade: 4.7, trend: 0.4 },
    { name: 'Нурлан Алтынбеков', grade: 4.9, trend: 0.6 }
  ];

  const monthlyData = [
    { month: 'Сен', value: 3.8, attendance: 88, assignments: 85 },
    { month: 'Окт', value: 3.9, attendance: 90, assignments: 87 },
    { month: 'Ноя', value: 4.0, attendance: 92, assignments: 89 },
    { month: 'Дек', value: 4.1, attendance: 91, assignments: 90 },
    { month: 'Янв', value: 4.2, attendance: 93, assignments: 92 },
    { month: 'Фев', value: 4.3, attendance: 94, assignments: 93 }
  ];

  const gradeDistribution = [
    { name: '5', value: 25, color: '#10B981' },
    { name: '4', value: 40, color: '#3B82F6' },
    { name: '3', value: 25, color: '#F59E0B' },
    { name: '2', value: 10, color: '#EF4444' }
  ];

  const performanceMetrics = [
    { subject: 'Оценки', value: 85 },
    { subject: 'Посещаемость', value: 92 },
    { subject: 'Домашние задания', value: 88 },
    { subject: 'Активность', value: 78 },
    { subject: 'Тесты', value: 82 }
  ];

  const classes: ClassData[] = [
    { id: '10a', name: '10 А', averageGrade: 4.2, attendance: 92, assignments: 85, studentsCount: 25 },
    { id: '10b', name: '10 Б', averageGrade: 4.0, attendance: 88, assignments: 82, studentsCount: 23 },
    { id: '11a', name: '11 А', averageGrade: 4.3, attendance: 94, assignments: 88, studentsCount: 24 },
    { id: '11b', name: '11 Б', averageGrade: 3.9, attendance: 90, assignments: 84, studentsCount: 22 },
  ];

  const trialTestResults: TrialTestResult[] = [
    { studentName: 'Арман Сериков', subjectName: 'Математика', score: 78, maxScore: 100, date: '15.03.2025', progressSince: 12 },
    { studentName: 'Мадина Сатыбалды', subjectName: 'История', score: 92, maxScore: 100, date: '17.03.2025', progressSince: 8 },
    { studentName: 'Нурлан Алтынбеков', subjectName: 'Английский', score: 85, maxScore: 100, date: '12.03.2025', progressSince: 15 },
    { studentName: 'Айгерим Жумабаева', subjectName: 'Физика', score: 65, maxScore: 100, date: '20.03.2025', progressSince: -3 },
    { studentName: 'Бекзат Оспанов', subjectName: 'Химия', score: 88, maxScore: 100, date: '18.03.2025', progressSince: 10 },
  ];

  const filteredData = useMemo(() => {
    if (selectedClass === 'all') return {
      subjects,
      lowPerformingStudents,
      highProgressStudents,
      monthlyData,
      gradeDistribution,
      performanceMetrics
    };

    const classMultiplier = selectedClass.includes('a') ? 1.1 : 0.9;

    return {
      subjects: subjects.map(s => ({ ...s, grade: +(s.grade * classMultiplier).toFixed(1) })),
      lowPerformingStudents,
      highProgressStudents,
      monthlyData: monthlyData.map(m => ({ ...m, value: +(m.value * classMultiplier).toFixed(1) })),
      gradeDistribution,
      performanceMetrics: performanceMetrics.map(m => ({ ...m, value: Math.min(100, Math.round(m.value * classMultiplier)) }))
    };
  }, [selectedClass]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Селектор класса */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Успеваемость по классам</h1>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              className={`flex items-center justify-center px-6 py-4 rounded-lg text-lg font-medium transition-all
                ${selectedClass === 'all'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setSelectedClass('all')}
            >
              Все классы
            </button>
            {classes.map((cls) => (
              <button
                key={cls.id}
                className={`flex flex-col items-center justify-center px-6 py-4 rounded-lg transition-all
                  ${selectedClass === cls.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setSelectedClass(cls.id)}
              >
                <span className="text-lg font-medium">{cls.name}</span>
                <div className="flex items-center gap-2 mt-2 text-sm opacity-80">
                  <span>{cls.studentsCount} учеников</span>
                  <span>•</span>
                  <span>{cls.averageGrade.toFixed(1)} ср.балл</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Табы для переключения между общей успеваемостью и пробными тестами */}
        <div className="flex border-b border-gray-200 mt-8">
          <button
            className={`py-2 px-4 font-medium text-sm ${selectedTab === 'general'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setSelectedTab('general')}
          >
            Общая успеваемость
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${selectedTab === 'trialTests'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setSelectedTab('trialTests')}
          >
            Результаты пробных тестов
          </button>
        </div>
      </div>

      {selectedTab === 'general' ? (
        <>
          {/* Верхние карточки */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-2">Средний балл</h3>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-semibold text-gray-900">
                  {selectedClass === 'all'
                    ? '4,2'
                    : classes.find(c => c.id === selectedClass)?.averageGrade.toFixed(1)}
                </div>
                <div className="flex items-center text-green-500">
                  <FaArrowUp className="mr-1" />
                  <span className="text-sm">+0.3</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-2">Успеваемость</h3>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-semibold text-gray-900">78%</div>
                <div className="flex items-center text-green-500">
                  <FaArrowUp className="mr-1" />
                  <span className="text-sm">+5%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-2">Посещаемость</h3>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-semibold text-gray-900">92%</div>
                <div className="flex items-center text-red-500">
                  <FaArrowDown className="mr-1" />
                  <span className="text-sm">-2%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-2">Выполнение заданий</h3>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-semibold text-gray-900">85%</div>
                <div className="flex items-center text-green-500">
                  <FaArrowUp className="mr-1" />
                  <span className="text-sm">+3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Основные графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Динамика успеваемости</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData.monthlyData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E69FF" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#2E69FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis domain={[2, 5]} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#2E69FF" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Распределение оценок</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredData.gradeDistribution}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {filteredData.gradeDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Успеваемость по предметам и радар */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Успеваемость по предметам</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData.subjects} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="grade" fill="#2E69FF" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Общие показатели</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredData.performanceMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Показатели" dataKey="value" fill="#2E69FF" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Списки студентов */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Студенты с низкой успеваемостью</h3>
              <div className="space-y-3">
                {filteredData.lowPerformingStudents.map((student, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-900">{student.name}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-red-500 mr-2">{student.grade.toFixed(1)}</span>
                      <span className="text-xs text-red-600">({student.trend?.toFixed(1)})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Студенты с высоким прогрессом</h3>
              <div className="space-y-3">
                {filteredData.highProgressStudents.map((student, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-900">{student.name}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-500 mr-2">{student.grade.toFixed(1)}</span>
                      <span className="text-xs text-green-600">(+{student.trend?.toFixed(1)})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Страница результатов пробных тестов */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Результаты пробных тестов</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Студент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Предмет
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Результат
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Прогресс
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trialTestResults.map((result, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.subjectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {result.score}/{result.maxScore} ({Math.round((result.score / result.maxScore) * 100)}%)
                          </span>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${result.score / result.maxScore >= 0.7
                                ? 'bg-green-500'
                                : result.score / result.maxScore >= 0.4
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                                }`}
                              style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center ${result.progressSince > 0
                          ? 'text-green-500'
                          : result.progressSince < 0
                            ? 'text-red-500'
                            : 'text-gray-500'
                          }`}>
                          {result.progressSince > 0 ? (
                            <FaArrowUp className="mr-1" />
                          ) : result.progressSince < 0 ? (
                            <FaArrowDown className="mr-1" />
                          ) : null}
                          <span>{result.progressSince > 0 ? '+' : ''}{result.progressSince}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Статистика по пробным тестам */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Распределение результатов</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { range: '0-20%', count: 1 },
                      { range: '21-40%', count: 4 },
                      { range: '41-60%', count: 12 },
                      { range: '61-80%', count: 25 },
                      { range: '81-100%', count: 18 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2E69FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">Прогресс по сравнению с прошлыми тестами</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { subject: 'Математика', previous: 65, current: 78 },
                      { subject: 'История', previous: 82, current: 88 },
                      { subject: 'Английский', previous: 70, current: 85 },
                      { subject: 'Физика', previous: 68, current: 65 },
                      { subject: 'Химия', previous: 75, current: 88 },
                      { subject: 'Биология', previous: 80, current: 85 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="previous" stroke="#8884d8" name="Предыдущий тест" />
                    <Line type="monotone" dataKey="current" stroke="#82ca9d" name="Текущий тест" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformancePage;