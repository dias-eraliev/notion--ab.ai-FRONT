import React, { useState } from 'react';

const TABS = [
  'По школе',
  'По классам',
  'По ученикам',
  'По учителю',
  'По классу / предмету',
  'Анализ СОР и СОЧ',
];

const YEARS = [2023, 2024, 2025];
const QUARTERS = [1, 2, 3, 4];
const ASSESSMENT_TYPES = ['ФО', 'СО', 'СОР'];
const CLASSES = ['9A', '9B', '10A', '10B', '11A', '11B'];
const SUBJECTS = [
  'Математика',
  'Алгебра',
  'Геометрия',
  'Физика',
  'Химия',
  'Биология',
  'Казахский язык',
  'Русский язык',
  'Английский язык',
  'Информатика',
  'История Казахстана',
  'Всемирная история',
  'География',
  'Литература',
];
const STUDENTS = [
  'Айсултан Нурланулы',
  'Аружан Ермеккызы',
  'Ерасыл Даниярулы',
  'Алихан Саматов',
  'Диас Ерланулы',
  'Аяулым Мейрамкызы',
  'Жанель Бекзаткызы',
  'Алима Нурбеккызы',
  'Мадияр Арманулы',
  'Аружан Мухамеджанкызы',
  'Аянат Еркебуланкызы',
  'Еркежан Амангельдыкызы',
  'Алихан Ермекулы',
  'Алиса Ерланкызы',
  'Алибек Нурланулы',
  'Аружан Ерланкызы',
  'Ернар Бекзатулы',
  'Айдана Мейрамкызы',
  'Аянат Данияркызы',
  'Ерасыл Арманулы',
  'Алихан Мейрамулы',
  'Диас Саматов',
  'Аяулым Ермеккызы',
  'Жанель Арманкызы',
  'Алима Бекзаткызы',
  'Мадияр Ерланулы',
  'Аружан Арманкызы',
  'Аянат Нурланкызы',
  'Еркежан Данияркызы',
  'Алихан Бекзатулы',
];
const TEACHERS = [
  'Гульнар Кайратовна',
  'Айгуль Ерлановна',
  'Мейрамбек Нурланович',
  'Данияр Ермекович',
  'Салтанат Армановна',
  'Бекзат Саматович',
  'Жанар Еркебулановна',
  'Арман Ерланович',
  'Алия Мухамеджановна',
  'Ерлан Бекзатович',
  'Асемгуль Еркебулановна',
  'Нурлан Даниярович',
  'Гульмира Алибековна',
  'Ермек Мадиярович',
  'Айдана Еркежановна',
];
const TOPICS = [
  'Тема 1: Рациональные числа',
  'Тема 2: Квадратные уравнения',
  'Тема 3: Законы Ньютона',
  'Тема 4: Химические реакции',
  'Тема 5: Биосфера',
  'Тема 6: История Казахстана в XX веке',
  'Тема 7: География материков',
  'Тема 8: Программирование на Python',
  'Тема 9: Литературные жанры',
];

const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<any>({});
  const [results, setResults] = useState<any[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Сброс фильтров при смене таба
  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setFilters({});
    setResults([]);
    setReportGenerated(false);
  };

  // Универсальный обработчик фильтров
  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  // Генерация моковых данных для разных вкладок
  const generateMockData = () => {
    switch (activeTab) {
      case 0: // По школе
        return [
          { label: 'Средний балл', value: (3 + Math.random() * 2).toFixed(2) },
          { label: 'Всего учеников', value: 180 },
          { label: 'Успеваемость (%)', value: (80 + Math.random() * 15).toFixed(1) },
        ];
      case 1: // По классам
        return CLASSES.map(cls => ({
          class: cls,
          avg: (3 + Math.random() * 2).toFixed(2),
          students: 30 + Math.floor(Math.random() * 5),
          success: (80 + Math.random() * 15).toFixed(1),
        }));
      case 2: // По ученикам
        // Для каждого студента по 7 предметов
        let studentRows: any[] = [];
        STUDENTS.slice(0, 15).forEach((stu, idx) => {
          for (let j = 0; j < 7; j++) {
            studentRows.push({
              student: stu,
              class: CLASSES[(idx + j) % CLASSES.length],
              subject: SUBJECTS[j % SUBJECTS.length],
              avg: (3 + Math.random() * 2).toFixed(2),
            });
          }
        });
        return studentRows;
      case 3: // По учителю
        return TEACHERS.slice(0, 8).map((teacher, idx) => ({
          teacher,
          subject: SUBJECTS[idx % SUBJECTS.length],
          avg: (3 + Math.random() * 2).toFixed(2),
          students: 60 + Math.floor(Math.random() * 20),
        }));
      case 4: // По классу / предмету
        return CLASSES.map((cls, idx) => ({
          class: cls,
          subject: SUBJECTS[idx % SUBJECTS.length],
          avg: (3 + Math.random() * 2).toFixed(2),
        }));
      case 5: // Анализ СОР и СОЧ
        return SUBJECTS.slice(0, 8).map((subject, idx) => ({
          subject,
          topic: TOPICS[idx % TOPICS.length],
          avg: (3 + Math.random() * 2).toFixed(2),
          teacher: TEACHERS[idx % TEACHERS.length],
        }));
      default:
        return [];
    }
  };

  // Фильтрация данных по выбранным фильтрам
  const filterResults = (data: any[]) => {
    switch (activeTab) {
      case 1: // По классам
        if (filters.class) return data.filter((row: any) => row.class === filters.class);
        return data;
      case 2: // По ученикам
        return data.filter((row: any) =>
          (!filters.student || row.student === filters.student) &&
          (!filters.class || row.class === filters.class) &&
          (!filters.subject || row.subject === filters.subject)
        );
      case 3: // По учителю
        return data.filter((row: any) =>
          (!filters.teacher || row.teacher === filters.teacher) &&
          (!filters.subject || row.subject === filters.subject)
        );
      case 4: // По классу / предмету
        return data.filter((row: any) =>
          (!filters.class || row.class === filters.class) &&
          (!filters.subject || row.subject === filters.subject)
        );
      case 5: // Анализ СОР и СОЧ
        return data.filter((row: any) =>
          (!filters.subject || row.subject === filters.subject) &&
          (!filters.topic || row.topic === filters.topic) &&
          (!filters.teacher || row.teacher === filters.teacher)
        );
      default:
        return data;
    }
  };

  // Обработка нажатия на кнопку
  const handleGenerateReport = () => {
    setReportGenerated(true);
    const data = generateMockData();
    setResults(filterResults(data));
  };

  // Рендер таблицы результатов с итогами
  const renderResultsTable = () => {
    if (!reportGenerated) return null;
    if (!results || results.length === 0) {
      return <div className="text-gray-400 text-center py-8">Нет данных для выбранных фильтров</div>;
    }
    switch (activeTab) {
      case 0:
        return (
          <table className="w-full mt-6 table-auto">
            <tbody>
              {results.map((row: any, i: number) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 pr-4 font-medium text-gray-700">{row.label}</td>
                  <td className="py-2 text-corporate-primary font-bold">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 1:
        // Итоги по классам
        const avgAvg1 = (results.reduce((acc, r) => acc + parseFloat(r.avg), 0) / results.length).toFixed(2);
        const sumStudents1 = results.reduce((acc, r) => acc + r.students, 0);
        const avgSuccess1 = (results.reduce((acc, r) => acc + parseFloat(r.success), 0) / results.length).toFixed(1);
        return (
          <table className="w-full mt-6 table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left">Класс</th>
                <th className="py-2 px-2 text-left">Средний балл</th>
                <th className="py-2 px-2 text-left">Ученики</th>
                <th className="py-2 px-2 text-left">Успеваемость (%)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row: any, i: number) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 px-2">{row.class}</td>
                  <td className="py-2 px-2">{row.avg}</td>
                  <td className="py-2 px-2">{row.students}</td>
                  <td className="py-2 px-2">{row.success}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="py-2 px-2">Итого</td>
                <td className="py-2 px-2">{avgAvg1}</td>
                <td className="py-2 px-2">{sumStudents1}</td>
                <td className="py-2 px-2">{avgSuccess1}</td>
              </tr>
            </tbody>
          </table>
        );
      case 2:
        // Итоги по ученикам
        const avgAvg2 = (results.reduce((acc, r) => acc + parseFloat(r.avg), 0) / results.length).toFixed(2);
        return (
          <table className="w-full mt-6 table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left">Ученик</th>
                <th className="py-2 px-2 text-left">Класс</th>
                <th className="py-2 px-2 text-left">Предмет</th>
                <th className="py-2 px-2 text-left">Средний балл</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row: any, i: number) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 px-2">{row.student}</td>
                  <td className="py-2 px-2">{row.class}</td>
                  <td className="py-2 px-2">{row.subject}</td>
                  <td className="py-2 px-2">{row.avg}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="py-2 px-2" colSpan={3}>Средний балл</td>
                <td className="py-2 px-2">{avgAvg2}</td>
              </tr>
            </tbody>
          </table>
        );
      case 3:
        // Итоги по учителям
        const avgAvg3 = (results.reduce((acc, r) => acc + parseFloat(r.avg), 0) / results.length).toFixed(2);
        const sumStudents3 = results.reduce((acc, r) => acc + r.students, 0);
        return (
          <table className="w-full mt-6 table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left">Преподаватель</th>
                <th className="py-2 px-2 text-left">Предмет</th>
                <th className="py-2 px-2 text-left">Средний балл</th>
                <th className="py-2 px-2 text-left">Ученики</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row: any, i: number) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 px-2">{row.teacher}</td>
                  <td className="py-2 px-2">{row.subject}</td>
                  <td className="py-2 px-2">{row.avg}</td>
                  <td className="py-2 px-2">{row.students}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="py-2 px-2" colSpan={2}>Средний балл / Всего учеников</td>
                <td className="py-2 px-2">{avgAvg3}</td>
                <td className="py-2 px-2">{sumStudents3}</td>
              </tr>
            </tbody>
          </table>
        );
      case 4:
        // Итоги по класс/предмет
        const avgAvg4 = (results.reduce((acc, r) => acc + parseFloat(r.avg), 0) / results.length).toFixed(2);
        return (
          <table className="w-full mt-6 table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left">Класс</th>
                <th className="py-2 px-2 text-left">Предмет</th>
                <th className="py-2 px-2 text-left">Средний балл</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row: any, i: number) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 px-2">{row.class}</td>
                  <td className="py-2 px-2">{row.subject}</td>
                  <td className="py-2 px-2">{row.avg}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="py-2 px-2" colSpan={2}>Средний балл</td>
                <td className="py-2 px-2">{avgAvg4}</td>
              </tr>
            </tbody>
          </table>
        );
      case 5:
        // Итоги по анализу СОР/СОЧ
        const avgAvg5 = (results.reduce((acc, r) => acc + parseFloat(r.avg), 0) / results.length).toFixed(2);
        return (
          <table className="w-full mt-6 table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left">Предмет</th>
                <th className="py-2 px-2 text-left">Раздел/тема</th>
                <th className="py-2 px-2 text-left">Средний балл</th>
                <th className="py-2 px-2 text-left">Преподаватель</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row: any, i: number) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 px-2">{row.subject}</td>
                  <td className="py-2 px-2">{row.topic}</td>
                  <td className="py-2 px-2">{row.avg}</td>
                  <td className="py-2 px-2">{row.teacher}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="py-2 px-2" colSpan={2}>Средний балл</td>
                <td className="py-2 px-2">{avgAvg5}</td>
                <td className="py-2 px-2"></td>
              </tr>
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  // Состояние для переключения между таблицей и графиком (заглушка)
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // Кнопки экспорта (заглушки)
  const renderExportButtons = () => (
    <div className="flex gap-2 mt-4">
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">PDF</button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">Excel</button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">Поделиться</button>
    </div>
  );

  // Заглушка для графика
  const renderChartStub = () => (
    <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg mt-6">
      <span>График (заглушка)</span>
    </div>
  );

  // Фильтры для каждой вкладки
  const renderFilters = () => {
    return (
      <div className="bg-gray-50 border border-corporate-primary/30 rounded-xl p-4 mb-4 flex flex-wrap gap-4 shadow-sm">
        {/* Содержимое фильтров для каждой вкладки */}
        {(() => {
          switch (activeTab) {
            case 0:
              return (
                <>
                  <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
                    <option value="">Все годы</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select className="input-filter" value={filters.quarter || ''} onChange={e => handleFilterChange('quarter', e.target.value)}>
                    <option value="">Все четверти</option>
                    {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <select className="input-filter" value={filters.type || ''} onChange={e => handleFilterChange('type', e.target.value)}>
                    <option value="">Все типы оценки</option>
                    {ASSESSMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </>
              );
            case 1:
              return (
                <>
                  <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
                    <option value="">Все годы</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select className="input-filter" value={filters.quarter || ''} onChange={e => handleFilterChange('quarter', e.target.value)}>
                    <option value="">Все четверти</option>
                    {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <select className="input-filter" value={filters.type || ''} onChange={e => handleFilterChange('type', e.target.value)}>
                    <option value="">Все типы оценки</option>
                    {ASSESSMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select className="input-filter" value={filters.class || ''} onChange={e => handleFilterChange('class', e.target.value)}>
                    <option value="">Все классы</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </>
              );
            case 2:
              return (
                <>
                  <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
                    <option value="">Все годы</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select className="input-filter" value={filters.quarter || ''} onChange={e => handleFilterChange('quarter', e.target.value)}>
                    <option value="">Все четверти</option>
                    {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <select className="input-filter" value={filters.class || ''} onChange={e => handleFilterChange('class', e.target.value)}>
                    <option value="">Все классы</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="input-filter" value={filters.student || ''} onChange={e => handleFilterChange('student', e.target.value)}>
                    <option value="">Все ученики</option>
                    {STUDENTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="input-filter" value={filters.subject || ''} onChange={e => handleFilterChange('subject', e.target.value)}>
                    <option value="">Все предметы</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="input-filter" value={filters.type || ''} onChange={e => handleFilterChange('type', e.target.value)}>
                    <option value="">Все типы оценки</option>
                    {ASSESSMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </>
              );
            case 3:
              return (
                <>
                  <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
                    <option value="">Все годы</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select className="input-filter" value={filters.quarter || ''} onChange={e => handleFilterChange('quarter', e.target.value)}>
                    <option value="">Все четверти</option>
                    {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <select className="input-filter" value={filters.teacher || ''} onChange={e => handleFilterChange('teacher', e.target.value)}>
                    <option value="">Все преподаватели</option>
                    {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select className="input-filter" value={filters.subject || ''} onChange={e => handleFilterChange('subject', e.target.value)}>
                    <option value="">Все предметы</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </>
              );
            case 4:
              return (
                <>
                  <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
                    <option value="">Все годы</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select className="input-filter" value={filters.quarter || ''} onChange={e => handleFilterChange('quarter', e.target.value)}>
                    <option value="">Все четверти</option>
                    {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <select className="input-filter" value={filters.class || ''} onChange={e => handleFilterChange('class', e.target.value)}>
                    <option value="">Все классы</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="input-filter" value={filters.subject || ''} onChange={e => handleFilterChange('subject', e.target.value)}>
                    <option value="">Все предметы</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </>
              );
            case 5:
              return (
                <>
                  <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
                    <option value="">Все годы</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <select className="input-filter" value={filters.class || ''} onChange={e => handleFilterChange('class', e.target.value)}>
                    <option value="">Все классы</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="input-filter" value={filters.subject || ''} onChange={e => handleFilterChange('subject', e.target.value)}>
                    <option value="">Все предметы</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="input-filter" value={filters.topic || ''} onChange={e => handleFilterChange('topic', e.target.value)}>
                    <option value="">Все темы</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select className="input-filter" value={filters.teacher || ''} onChange={e => handleFilterChange('teacher', e.target.value)}>
                    <option value="">Все преподаватели</option>
                    {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </>
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold mb-2 text-corporate-primary">Успеваемость</h1>
      <div className="text-gray-600 mb-8 text-lg">Формирование и экспорт отчётов об успеваемости учащихся</div>

      {/* Табы */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-t-lg font-medium transition-all duration-200 focus:outline-none whitespace-nowrap
              ${activeTab === idx
                ? 'bg-white shadow-notion text-corporate-primary'
                : 'bg-gray-100 text-gray-500 hover:bg-white hover:text-corporate-primary'}`}
            onClick={() => handleTabChange(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Карточка для фильтров и данных */}
      <div className="bg-white shadow-notion rounded-xl p-6 min-h-[200px] animate-fadeIn dashboard-card">
        {/* Фильтры */}
        {renderFilters()}
        <div className="flex flex-wrap gap-2 items-center mt-2">
          <button
            className="button-hover bg-corporate-primary text-white px-6 py-2 rounded-lg font-semibold"
            onClick={handleGenerateReport}
          >
            Сформировать отчёт
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ml-2 ${viewMode === 'table' ? 'bg-corporate-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('table')}
          >
            Таблица
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'chart' ? 'bg-corporate-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('chart')}
          >
            График
          </button>
        </div>
        {/* Экспорт */}
        {reportGenerated && renderExportButtons()}
        {/* Результаты */}
        {reportGenerated && (viewMode === 'table' ? renderResultsTable() : renderChartStub())}
      </div>
    </div>
  );
};

export default PerformancePage; 