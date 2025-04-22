import React, { useState } from 'react';

const TABS = ['По школе', 'По классам'];

const YEARS = [2023, 2024, 2025];
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const QUARTERS = [1, 2, 3, 4];
const CLASSES = ['7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B'];
const TEACHERS = [
  'Гульнар Кайратовна',
  'Айгуль Ерлановна',
  'Мейрамбек Нурланович',
  'Данияр Ермекович',
  'Салтанат Армановна',
  'Бекзат Саматович',
  'Жанар Еркебулановна',
  'Арман Ерланович',
];
const ABSENCE_TYPES = ['Все', 'Уважительные', 'Неуважительные'];

// MOCK DATA
const STUDENTS = [
  'Нурсеитова Айдана', 'Серикова Аружан', 'Ермеков Алихан', 'Кайратов Диас', 'Саматов Мадияр',
  'Бекзатова Алина', 'Жанарбекова Аяулым', 'Арманов Ернар', 'Мейрамов Данияр', 'Ерланова Асем',
  'Султанова Аружан', 'Айгуль Ерланкызы', 'Мейрамбеков Арман', 'Даниярова Аружан', 'Салтанат Бекзаткызы',
  'Бекзат Саматов', 'Жанар Еркебуланкызы', 'Арман Ерланович', 'Алия Мухамеджанкызы', 'Ерлан Бекзатович',
  'Асемгуль Еркебулановна', 'Нурлан Даниярович', 'Гульмира Алибековна', 'Ермек Мадиярович', 'Айдана Еркежановна',
  'Алихан Саматов', 'Диас Ерланулы', 'Аяулым Мейрамкызы', 'Жанель Бекзаткызы', 'Алима Нурбеккызы',
  'Мадияр Арманулы', 'Аружан Мухамеджанкызы', 'Аянат Еркебуланкызы', 'Еркежан Амангельдыкызы', 'Алихан Ермекулы',
  'Алиса Ерланкызы', 'Алибек Нурланулы', 'Аружан Ерланкызы', 'Ернар Бекзатулы', 'Айдана Мейрамкызы',
  'Аянат Данияркызы', 'Ерасыл Арманулы', 'Алихан Мейрамулы', 'Диас Саматов', 'Аяулым Ермеккызы',
  'Жанель Арманкызы', 'Алима Бекзаткызы', 'Мадияр Ерланулы', 'Аружан Арманкызы', 'Аянат Нурланкызы',
  'Еркежан Данияркызы', 'Алихан Бекзатулы',
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateSchoolData = (filters: any) => {
  // 10 классов, 60+ учеников, 4-8 уроков в день, случайные пропуски
  return CLASSES.map(cls => {
    const students = getRandomInt(25, 32);
    const lessons = getRandomInt(3000, 3500);
    const missed = getRandomInt(40, 120);
    const excused = getRandomInt(30, missed); // уважительные
    const unexcused = missed - excused;
    const percent = ((1 - missed / lessons) * 100).toFixed(2);
    return {
      class: cls,
      students,
      lessons,
      missed,
      excused,
      unexcused,
      percent,
    };
  });
};

const generateClassData = (filters: any) => {
  // 15 учеников, 4-8 уроков в день, случайные пропуски
  return STUDENTS.slice(0, 15).map((fio, idx) => {
    const lessons = getRandomInt(110, 130);
    const missed = getRandomInt(0, 10);
    const excused = getRandomInt(0, missed);
    const unexcused = missed - excused;
    const percent = ((1 - missed / lessons) * 100).toFixed(2);
    return {
      idx: idx + 1,
      fio,
      class: filters.class || getRandom(CLASSES),
      lessons,
      missed,
      excused,
      unexcused,
      percent,
    };
  });
};

const AttendanceSchoolPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<any>({});
  const [reportGenerated, setReportGenerated] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = () => {
    setReportGenerated(true);
    if (activeTab === 0) {
      setResults(generateSchoolData(filters));
    } else {
      setResults(generateClassData(filters));
    }
  };

  const renderFilters = () => {
    if (activeTab === 0) {
      // По школе
      return (
        <div className="bg-gray-50 border border-corporate-primary/30 rounded-xl p-4 mb-4 flex flex-wrap gap-4 shadow-sm">
          <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
            <option value="">Год</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="input-filter" value={filters.month || ''} onChange={e => handleFilterChange('month', e.target.value)}>
            <option value="">Месяц</option>
            {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
          </select>
          <select className="input-filter" value={filters.absenceType || ''} onChange={e => handleFilterChange('absenceType', e.target.value)}>
            {ABSENCE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      );
    } else {
      // По классам
      return (
        <div className="bg-gray-50 border border-corporate-primary/30 rounded-xl p-4 mb-4 flex flex-wrap gap-4 shadow-sm">
          <select className="input-filter" value={filters.year || ''} onChange={e => handleFilterChange('year', e.target.value)}>
            <option value="">Год</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="input-filter" value={filters.quarter || ''} onChange={e => handleFilterChange('quarter', e.target.value)}>
            <option value="">Четверть</option>
            {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <select className="input-filter" value={filters.class || ''} onChange={e => handleFilterChange('class', e.target.value)}>
            <option value="">Класс</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="date"
            className="input-filter"
            value={filters.dateFrom || ''}
            onChange={e => handleFilterChange('dateFrom', e.target.value)}
            placeholder="От"
            style={{ minWidth: 120 }}
          />
          <input
            type="date"
            className="input-filter"
            value={filters.dateTo || ''}
            onChange={e => handleFilterChange('dateTo', e.target.value)}
            placeholder="До"
            style={{ minWidth: 120 }}
          />
          <select className="input-filter" value={filters.teacher || ''} onChange={e => handleFilterChange('teacher', e.target.value)}>
            <option value="">Преподаватель (опц.)</option>
            {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input-filter" value={filters.absenceType || ''} onChange={e => handleFilterChange('absenceType', e.target.value)}>
            {ABSENCE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      );
    }
  };

  const renderTable = () => {
    if (!reportGenerated) return null;
    if (!results || results.length === 0) {
      return <div className="text-gray-400 text-center py-8">🚫 Данных по заданным параметрам не найдено</div>;
    }
    if (activeTab === 0) {
      // По школе
      const sumStudents = results.reduce((acc, r) => acc + r.students, 0);
      const sumLessons = results.reduce((acc, r) => acc + r.lessons, 0);
      const sumMissed = results.reduce((acc, r) => acc + r.missed, 0);
      const sumExcused = results.reduce((acc, r) => acc + r.excused, 0);
      const sumUnexcused = results.reduce((acc, r) => acc + r.unexcused, 0);
      const avgPercent = (results.reduce((acc, r) => acc + parseFloat(r.percent), 0) / results.length).toFixed(2);
      return (
        <table className="w-full mt-6 table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-2 text-left">Класс</th>
              <th className="py-2 px-2 text-left">Всего учеников</th>
              <th className="py-2 px-2 text-left">Всего уроков</th>
              <th className="py-2 px-2 text-left">Всего пропущено</th>
              <th className="py-2 px-2 text-left">Уважит.</th>
              <th className="py-2 px-2 text-left">Неуважит.</th>
              <th className="py-2 px-2 text-left">Средний % посещаемости</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row: any, i: number) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-2 px-2">{row.class}</td>
                <td className="py-2 px-2">{row.students}</td>
                <td className="py-2 px-2">{row.lessons}</td>
                <td className="py-2 px-2">{row.missed}</td>
                <td className="py-2 px-2">{row.excused}</td>
                <td className="py-2 px-2">{row.unexcused}</td>
                <td className={`py-2 px-2 font-semibold ${parseFloat(row.percent) < 90 ? 'bg-red-100 text-red-600' : ''}`}>{row.percent}%</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="py-2 px-2">Итого</td>
              <td className="py-2 px-2">{sumStudents}</td>
              <td className="py-2 px-2">{sumLessons}</td>
              <td className="py-2 px-2">{sumMissed}</td>
              <td className="py-2 px-2">{sumExcused}</td>
              <td className="py-2 px-2">{sumUnexcused}</td>
              <td className="py-2 px-2">{avgPercent}%</td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      // По классам
      const sumLessons = results.reduce((acc, r) => acc + r.lessons, 0);
      const sumMissed = results.reduce((acc, r) => acc + r.missed, 0);
      const sumExcused = results.reduce((acc, r) => acc + r.excused, 0);
      const sumUnexcused = results.reduce((acc, r) => acc + r.unexcused, 0);
      const avgPercent = (results.reduce((acc, r) => acc + parseFloat(r.percent), 0) / results.length).toFixed(2);
      return (
        <table className="w-full mt-6 table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-2 text-left">№</th>
              <th className="py-2 px-2 text-left">ФИО</th>
              <th className="py-2 px-2 text-left">Класс</th>
              <th className="py-2 px-2 text-left">Всего уроков</th>
              <th className="py-2 px-2 text-left">Пропущено (уроки)</th>
              <th className="py-2 px-2 text-left">Уважит.</th>
              <th className="py-2 px-2 text-left">Неуважит.</th>
              <th className="py-2 px-2 text-left">% посещаемости</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row: any, i: number) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-2 px-2">{row.idx}</td>
                <td className="py-2 px-2">{row.fio}</td>
                <td className="py-2 px-2">{row.class}</td>
                <td className="py-2 px-2">{row.lessons}</td>
                <td className="py-2 px-2">{row.missed}</td>
                <td className="py-2 px-2">{row.excused}</td>
                <td className="py-2 px-2">{row.unexcused}</td>
                <td className={`py-2 px-2 font-semibold ${parseFloat(row.percent) < 90 ? 'bg-red-100 text-red-600' : ''}`}>{row.percent}%</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="py-2 px-2" colSpan={3}>Итого</td>
              <td className="py-2 px-2">{sumLessons}</td>
              <td className="py-2 px-2">{sumMissed}</td>
              <td className="py-2 px-2">{sumExcused}</td>
              <td className="py-2 px-2">{sumUnexcused}</td>
              <td className="py-2 px-2">{avgPercent}%</td>
            </tr>
          </tbody>
        </table>
      );
    }
  };

  // Проверка обязательных фильтров
  const isFiltersFilled = () => {
    if (activeTab === 0) {
      return filters.year && filters.month;
    } else {
      return filters.year && filters.quarter && filters.class && filters.dateFrom && filters.dateTo;
    }
  };

  // Кнопки экспорта (заглушки)
  const renderExportButtons = () => (
    <div className="flex gap-2 mt-4">
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">PDF</button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">Excel</button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">Поделиться</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold mb-2 text-corporate-primary">Посещаемость</h1>
      <div className="text-gray-600 mb-8 text-lg">Анализ и экспорт данных по посещаемости учащихся</div>

      {/* Табы */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-t-lg font-medium transition-all duration-200 focus:outline-none whitespace-nowrap
              ${activeTab === idx
                ? 'bg-white shadow-notion text-corporate-primary'
                : 'bg-gray-100 text-gray-500 hover:bg-white hover:text-corporate-primary'}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Карточка для фильтров и данных */}
      <div className="bg-white shadow-notion rounded-xl p-6 min-h-[200px] animate-fadeIn dashboard-card">
        {renderFilters()}
        <button
          className={`button-hover bg-corporate-primary text-white px-6 py-2 rounded-lg font-semibold mt-2 ${!isFiltersFilled() ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleGenerateReport}
          disabled={!isFiltersFilled()}
        >
          Сформировать отчёт
        </button>
        {reportGenerated && renderExportButtons()}
        {renderTable()}
      </div>
    </div>
  );
};

export default AttendanceSchoolPage; 