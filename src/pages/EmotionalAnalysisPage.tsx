import React, { useState, useMemo } from 'react';
import {
  FaSmile,
  FaFrown,
  FaMeh,
  FaChartLine,
  FaCalendarAlt,
  FaComments,
  FaUserGraduate,
  FaHeart,
  FaBrain,
  FaHandshake,
  FaSchool,
  FaUsers,
  FaChalkboardTeacher,
  FaFilter,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

interface ClassEmotionalState {
  className: string;
  averageMood: number;
  averageStress: number;
  averageEngagement: number;
  studentCount: number;
  lastUpdate: string;
  trend: 'up' | 'down' | 'stable';
}

interface SchoolStats {
  totalStudents: number;
  averageMood: number;
  averageStress: number;
  averageEngagement: number;
  lastUpdate: string;
}

interface StudentAtRisk {
  id: string;
  name: string;
  class: string;
  photo: string;
  stress: number;
  mood: number;
  engagement: number;
  reason: string;
  trend: 'up' | 'down' | 'stable';
  contactTeacher: string;
  contactParent: string;
}

const schoolStats: SchoolStats = {
  totalStudents: 1250,
  averageMood: 82,
  averageStress: 35,
  averageEngagement: 78,
  lastUpdate: '2024-03-20'
};

const classesData: ClassEmotionalState[] = [
  {
    className: 'МК24-1М',
    averageMood: 85,
    averageStress: 30,
    averageEngagement: 90,
    studentCount: 25,
    lastUpdate: '2024-03-20',
    trend: 'up'
  },
  {
    className: 'МК24-2М',
    averageMood: 78,
    averageStress: 45,
    averageEngagement: 75,
    studentCount: 28,
    lastUpdate: '2024-03-20',
    trend: 'stable'
  },
  {
    className: 'ПК24-1П',
    averageMood: 72,
    averageStress: 50,
    averageEngagement: 68,
    studentCount: 30,
    lastUpdate: '2024-03-20',
    trend: 'down'
  },
  {
    className: 'ПР24-1Ю',
    averageMood: 88,
    averageStress: 25,
    averageEngagement: 92,
    studentCount: 26,
    lastUpdate: '2024-03-20',
    trend: 'up'
  }
];

const weeklyTrends = [
  {
    date: '2024-03-14',
    mood: 75,
    stress: 40,
    engagement: 80,
    events: 'Наурыз мейрамы'
  },
  {
    date: '2024-03-15',
    mood: 82,
    stress: 35,
    engagement: 85,
    events: 'Олимпиада по математике'
  },
  {
    date: '2024-03-16',
    mood: 80,
    stress: 38,
    engagement: 82,
    events: 'Спортивные соревнования'
  },
  {
    date: '2024-03-17',
    mood: 85,
    stress: 32,
    engagement: 88,
    events: 'День открытых дверей'
  },
  {
    date: '2024-03-18',
    mood: 79,
    stress: 42,
    engagement: 76,
    events: 'Контрольные работы'
  },
  {
    date: '2024-03-19',
    mood: 83,
    stress: 36,
    engagement: 84,
    events: 'Внеклассные мероприятия'
  },
  {
    date: '2024-03-20',
    mood: 82,
    stress: 35,
    engagement: 78,
    events: 'Родительское собрание'
  }
];

const studentsAtRisk: StudentAtRisk[] = [
  {
    id: '1',
    name: 'Айсұлтан Нұрланұлы',
    class: 'ПК24-1П',
    photo: 'https://i.pravatar.cc/100?img=1',
    stress: 85,
    mood: 45,
    engagement: 30,
    reason: 'Высокий уровень стресса, снижение успеваемости',
    trend: 'down',
    contactTeacher: 'Әсел Маратқызы',
    contactParent: '+7 (777) 123-45-67'
  },
  {
    id: '2',
    name: 'Мадина Ерланқызы',
    class: 'МК24-2М',
    photo: 'https://i.pravatar.cc/100?img=2',
    stress: 75,
    mood: 50,
    engagement: 45,
    reason: 'Снижение вовлеченности в учебный процесс',
    trend: 'down',
    contactTeacher: 'Бақыт Сәрсенұлы',
    contactParent: '+7 (777) 234-56-78'
  },
  {
    id: '3',
    name: 'Нұрлан Серікұлы',
    class: 'МК24-1М',
    photo: 'https://i.pravatar.cc/100?img=3',
    stress: 80,
    mood: 55,
    engagement: 40,
    reason: 'Повышенная тревожность перед ЕНТ',
    trend: 'down',
    contactTeacher: 'Гүлнар Асқарқызы',
    contactParent: '+7 (777) 345-67-89'
  },
  {
    id: '4',
    name: 'Айгерім Дінмұхамедқызы',
    class: 'ПР24-1Ю',
    photo: 'https://i.pravatar.cc/100?img=4',
    stress: 70,
    mood: 60,
    engagement: 50,
    reason: 'Сложности в адаптации после перевода',
    trend: 'stable',
    contactTeacher: 'Мақсат Жанатұлы',
    contactParent: '+7 (777) 456-78-90'
  },
  {
    id: '5',
    name: 'Бекзат Асланұлы',
    class: 'МК24-2М',
    photo: 'https://i.pravatar.cc/100?img=5',
    stress: 78,
    mood: 52,
    engagement: 48,
    reason: 'Конфликтные ситуации в классе',
    trend: 'up',
    contactTeacher: 'Сәуле Бақытқызы',
    contactParent: '+7 (777) 567-89-01'
  }
];

const EmotionalAnalysisPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Функция для генерации данных за разные периоды
  const generateTrendsData = (period: 'week' | 'month' | 'quarter') => {
    const today = new Date();
    const data = [];
    const daysToGenerate = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Генерируем случайные значения с учетом тренда
      const baseValue = 75;
      const variation = 15;
      const randomValue = () => baseValue + (Math.random() * variation * 2 - variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        mood: Math.round(randomValue()),
        stress: Math.round(40 + (Math.random() * 20 - 10)),
        engagement: Math.round(randomValue()),
        events: getRandomEvent(date)
      });
    }
    return data;
  };

  // Функция для получения события по дате
  const getRandomEvent = (date: Date) => {
    const events = [
      'Контрольная работа',
      'Спортивные соревнования',
      'Олимпиада',
      'Родительское собрание',
      'Внеклассные мероприятия',
      'Экскурсия',
      'Праздничный концерт',
      'День самоуправления',
      'Научная конференция',
      'Творческий конкурс'
    ];
    return events[Math.floor(Math.random() * events.length)];
  };

  // Фильтрация данных по классам
  const filteredClassesData = useMemo(() => {
    if (selectedClass === 'all') return classesData;
    return classesData.filter(classData => classData.className.startsWith(selectedClass));
  }, [selectedClass]);

  // Генерация данных трендов в зависимости от выбранного периода
  const currentTrends = useMemo(() => {
    return generateTrendsData(selectedPeriod);
  }, [selectedPeriod]);

  // Расчет средних показателей на основе отфильтрованных данных
  const filteredStats = useMemo(() => {
    if (selectedClass === 'all') return schoolStats;

    const filteredClasses = filteredClassesData;
    const totalStudents = filteredClasses.reduce((sum, c) => sum + c.studentCount, 0);
    const avgMood = Math.round(
      filteredClasses.reduce((sum, c) => sum + c.averageMood * c.studentCount, 0) / totalStudents
    );
    const avgStress = Math.round(
      filteredClasses.reduce((sum, c) => sum + c.averageStress * c.studentCount, 0) / totalStudents
    );
    const avgEngagement = Math.round(
      filteredClasses.reduce((sum, c) => sum + c.averageEngagement * c.studentCount, 0) / totalStudents
    );

    return {
      totalStudents,
      averageMood: avgMood,
      averageStress: avgStress,
      averageEngagement: avgEngagement,
      lastUpdate: schoolStats.lastUpdate
    };
  }, [selectedClass]);

  // Фильтрация учеников группы риска
  const filteredStudentsAtRisk = useMemo(() => {
    if (selectedClass === 'all') return studentsAtRisk;
    return studentsAtRisk.filter(student => student.class.startsWith(selectedClass));
  }, [selectedClass]);

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Заголовок и фильтры */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Эмоциональный анализ групп</h1>
          <p className="text-sm text-gray-500">
            Общая статистика эмоционального состояния учащихся | Последнее обновление: {schoolStats.lastUpdate}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <FaFilter className="text-gray-400" />
            <div className="mb-4">
              <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700">
                Группа
              </label>
              <select
                id="class-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">Все группы</option>
                <option value="МК24-1М">МК24-1М</option>
                <option value="МК24-2М">МК24-2М</option>
                <option value="ПК24-1П">ПК24-1П</option>
                <option value="ПР24-1Ю">ПР24-1Ю</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod('week')}
            >
              Неделя
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod('month')}
            >
              Месяц
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'quarter'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod('quarter')}
            >
              Квартал
            </button>
          </div>
        </div>
      </div>

      {/* Общая статистика школы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <FaSchool className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего учащихся</p>
              <h3 className="text-2xl font-semibold text-gray-900">{filteredStats.totalStudents}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <FaSmile className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Общее настроение</p>
              <h3 className="text-2xl font-semibold text-gray-900">{filteredStats.averageMood}%</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-red-50">
              <FaBrain className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Уровень стресса</p>
              <h3 className="text-2xl font-semibold text-gray-900">{filteredStats.averageStress}%</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <FaHeart className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Вовлеченность</p>
              <h3 className="text-2xl font-semibold text-gray-900">{filteredStats.averageEngagement}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Динамика показателей
            {selectedClass !== 'all' && ` (${selectedClass} группа)`}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentTrends}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E5945" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1E5945" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="#1E5945" 
                fill="url(#colorMood)" 
                name="Настроение"
              />
              <Area 
                type="monotone" 
                dataKey="stress" 
                stroke="#EF4444" 
                fill="url(#colorStress)" 
                name="Стресс"
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#8B5CF6" 
                fill="url(#colorEngagement)" 
                name="Вовлеченность"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Статистика по группам
            {selectedClass !== 'all' && ` (${selectedClass} группа)`}
          </h3>
          <div className="space-y-4">
            {filteredClassesData.map((classData) => (
              <div key={classData.className} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FaUserGraduate className={`w-5 h-5 ${
                      classData.trend === 'up' ? 'text-green-500' : 
                      classData.trend === 'down' ? 'text-red-500' : 
                      'text-yellow-500'
                    }`} />
                    <span className="font-medium text-gray-900">Группа {classData.className}</span>
                  </div>
                  <span className="text-sm text-gray-500">{classData.studentCount} учащихся</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Настроение</span>
                      <span className="text-sm font-medium text-gray-900">{classData.averageMood}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${classData.averageMood}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Стресс</span>
                      <span className="text-sm font-medium text-gray-900">{classData.averageStress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{ width: `${classData.averageStress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Вовлеченность</span>
                      <span className="text-sm font-medium text-gray-900">{classData.averageEngagement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full" 
                        style={{ width: `${classData.averageEngagement}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* События и комментарии */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          События и их влияние
          {selectedClass !== 'all' && ` (${selectedClass} группа)`}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[280px] overflow-y-auto">
          {currentTrends.map((day) => (
            <div key={day.date} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">{day.date}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{day.events}</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Настроение</span>
                  <span className="text-xs font-medium text-gray-900">{day.mood}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full" 
                    style={{ width: `${day.mood}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Стресс</span>
                  <span className="text-xs font-medium text-gray-900">{day.stress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-red-500 h-1 rounded-full" 
                    style={{ width: `${day.stress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Вовлеченность</span>
                  <span className="text-xs font-medium text-gray-900">{day.engagement}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-purple-500 h-1 rounded-full" 
                    style={{ width: `${day.engagement}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ученики, требующие внимания */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Ученики, требующие внимания
            {selectedClass !== 'all' && ` (${selectedClass} группа)`}
          </h3>
          <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
            {filteredStudentsAtRisk.length} учеников
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudentsAtRisk.map((student) => (
            <div key={student.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <img 
                  src={student.photo} 
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <FaExclamationTriangle className={`w-5 h-5 ${
                      student.trend === 'up' ? 'text-green-500' : 
                      student.trend === 'down' ? 'text-red-500' : 
                      'text-yellow-500'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-500">Группа {student.class}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">Уровень стресса</span>
                    <span className="text-sm font-medium text-red-600">{student.stress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-red-500 h-1.5 rounded-full" 
                      style={{ width: `${student.stress}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">{student.reason}</p>

                <div className="pt-3 border-t border-gray-200 mt-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <FaChalkboardTeacher className="w-4 h-4" />
                    <span>{student.contactTeacher}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <FaPhoneAlt className="w-4 h-4" />
                    <span>{student.contactParent}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalAnalysisPage;