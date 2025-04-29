import React, { useState, useMemo } from 'react';
import { 
  FaFileAlt, 
  FaDownload, 
  FaFilter, 
  FaSortAmountDown, 
  FaChartBar,
  FaCalendarAlt,
  FaFileExport,
  FaChartLine,
  FaMoneyBillWave,
  FaUserGraduate
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';

interface FinancialReport {
  id: string;
  title: string;
  period: string;
  createdAt: string;
  type: 'balance' | 'income' | 'expense' | 'tax' | 'custom';
  status: 'draft' | 'submitted' | 'approved' | 'final';
  author: string;
  description: string;
  tags: string[];
}

// Константы
const reportTypeLabels = {
  balance: 'Баланс школы',
  income: 'Доходы',
  expense: 'Расходы',
  tax: 'Налоговый отчет',
  custom: 'Пользовательский отчет'
};

const statusLabels = {
  draft: 'Черновик',
  final: 'Финальный',
  approved: 'Утвержден',
  submitted: 'Отправлен'
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  final: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  submitted: 'bg-purple-100 text-purple-800'
};

// Демо-данные
const initialReports: FinancialReport[] = [
  {
    id: 'r001',
    title: 'Баланс школы за 3 квартал 2024',
    type: 'balance',
    period: 'Q3 2024',
    createdAt: '2024-10-05',
    author: 'Бекетова А.М.',
    status: 'approved',
    description: 'Квартальный отчет о финансовом состоянии школы',
    tags: ['квартальный', '2024']
  },
  {
    id: 'r002',
    title: 'Отчет о доходах за сентябрь 2024',
    type: 'income',
    period: 'Сентябрь 2024',
    createdAt: '2024-10-02',
    author: 'Каримова Н.С.',
    status: 'final',
    description: 'Ежемесячный отчет о поступлениях',
    tags: ['ежемесячный', 'доходы', '2024']
  },
  {
    id: 'r003',
    title: 'Отчет о расходах за сентябрь 2024',
    type: 'expense',
    period: 'Сентябрь 2024',
    createdAt: '2024-10-03',
    author: 'Каримова Н.С.',
    status: 'final',
    description: 'Ежемесячный отчет о расходах',
    tags: ['ежемесячный', 'расходы', '2024']
  },
  {
    id: 'r004',
    title: 'Налоговый отчет за 3 квартал 2024',
    type: 'tax',
    period: 'Q3 2024',
    createdAt: '2024-10-15',
    author: 'Бекетова А.М.',
    status: 'submitted',
    description: 'Квартальная налоговая отчетность',
    tags: ['квартальный', 'налоги', '2024']
  },
  {
    id: 'r005',
    title: 'Анализ эффективности расходов за 2024 год',
    type: 'custom',
    period: '2024 год',
    createdAt: '2024-10-10',
    author: 'Мырзахметов К.А.',
    status: 'draft',
    description: 'Специальный отчет о эффективности использования бюджета',
    tags: ['аналитика', 'эффективность', '2024']
  },
  {
    id: 'r006',
    title: 'Баланс школы за август 2024',
    type: 'balance',
    period: 'Август 2024',
    createdAt: '2024-09-05',
    author: 'Бекетова А.М.',
    status: 'approved',
    description: 'Ежемесячный отчет о финансовом состоянии школы',
    tags: ['ежемесячный', '2024']
  },
  {
    id: 'r007',
    title: 'Отчет по целевому использованию средств гранта',
    type: 'custom',
    period: 'Q1-Q3 2024',
    createdAt: '2024-10-12',
    author: 'Мырзахметов К.А.',
    status: 'draft',
    description: 'Отчет о расходовании средств образовательного гранта',
    tags: ['грант', 'целевое использование']
  },
  {
    id: 'r008',
    title: 'Отчет о доходах за август 2024',
    type: 'income',
    period: 'Август 2024',
    createdAt: '2024-09-02',
    author: 'Каримова Н.С.',
    status: 'approved',
    description: 'Ежемесячный отчет о поступлениях',
    tags: ['ежемесячный', 'доходы', '2024']
  },
  {
    id: 'r009',
    title: 'Отчет о расходах за август 2024',
    type: 'expense',
    period: 'Август 2024',
    createdAt: '2024-09-03',
    author: 'Каримова Н.С.',
    status: 'approved',
    description: 'Ежемесячный отчет о расходах',
    tags: ['ежемесячный', 'расходы', '2024']
  },
  {
    id: 'r010',
    title: 'Финансовая отчетность для учредителей',
    type: 'custom',
    period: 'Q3 2024',
    createdAt: '2024-10-08',
    author: 'Бекетова А.М.',
    status: 'final',
    description: 'Квартальный отчет для совета учредителей',
    tags: ['квартальный', 'учредители', '2024']
  }
];

// Данные для графиков
const monthlyRevenueData = [
  { name: 'Янв', value: 5200000 },
  { name: 'Фев', value: 4800000 },
  { name: 'Мар', value: 5000000 },
  { name: 'Апр', value: 5300000 },
  { name: 'Май', value: 5500000 },
  { name: 'Июн', value: 4100000 },
  { name: 'Июл', value: 3800000 },
  { name: 'Авг', value: 5000000 },
  { name: 'Сен', value: 5700000 },
  { name: 'Окт', value: 5400000 },
  { name: 'Ноя', value: 5300000 },
  { name: 'Дек', value: 5200000 }
];

const expensesByCategory = [
  { name: 'Зарплаты', value: 6800000 },
  { name: 'Аренда', value: 1200000 },
  { name: 'Коммунальные', value: 800000 },
  { name: 'Материалы', value: 1500000 },
  { name: 'Оборудование', value: 2200000 },
  { name: 'Питание', value: 1800000 },
  { name: 'Прочее', value: 700000 }
];

const ReportsPage: React.FC = () => {
  // Состояния
  const [reports, setReports] = useState<FinancialReport[]>(initialReports);
  const [filters, setFilters] = useState({
    period: 'all',
    type: 'all',
    status: 'all'
  });
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Вычисляемые данные
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const typeMatch = filters.type === 'all' || report.type === filters.type;
      const periodMatch = filters.period === 'all' || report.period.includes(filters.period);
      const statusMatch = filters.status === 'all' || report.status === filters.status;
      return typeMatch && periodMatch && statusMatch;
    });
  }, [reports, filters]);

  // Статистика
  const stats = useMemo(() => {
    const totalIncome = filteredReports
      .filter(r => r.type === 'income')
      .length * 1000000; // Демо-данные

    const avgPayment = totalIncome / (filteredReports.length || 1);
    
    const activeStudents = Math.floor(totalIncome / 50000); // Демо-расчет
    
    const growthRate = 2; // Демо-данные

    return {
      totalIncome: totalIncome.toLocaleString(),
      avgPayment: Math.floor(avgPayment).toLocaleString(),
      activeStudents,
      growthRate
    };
  }, [filteredReports]);

  // График доходов
  const chartData = useMemo(() => {
    const currentDate = new Date();
    const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    return monthlyRevenueData.map((data, index) => {
      const isCurrentPeriod = filters.period === 'all' || 
        (filters.period === monthNames[index]);
      
      return {
        ...data,
        value: isCurrentPeriod ? data.value : data.value * (Math.random() * 0.4 + 0.8)
      };
    });
  }, [filters.period]);

  // Обработчики событий
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      period: 'all',
      type: 'all',
      status: 'all'
    });
    setShowFilterModal(false);
  };

  const handleRowClick = (report: FinancialReport) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDownloadReport = (id: string) => {
    // Логика скачивания отчета
    alert(`Скачивание отчета #${id}`);
  };

  const handleExportToPdf = (id: string) => {
    // Логика экспорта в PDF
    alert(`Экспорт отчета #${id} в PDF`);
  };

  // Компоненты фильтров
  const FilterModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Фильтры</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип отчета</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="balance">Баланс школы</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
            <option value="tax">Налоговый отчет</option>
            <option value="custom">Пользовательский отчет</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Период</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option value="all">Все периоды</option>
            <option value="2024">2024 год</option>
            <option value="Q3">Q3 2024</option>
            <option value="Сентябрь">Сентябрь</option>
            <option value="Август">Август</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="submitted">Отправлен</option>
            <option value="approved">Утвержден</option>
            <option value="final">Финальный</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onClick={handleResetFilters}
          >
            Сбросить
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            onClick={() => setShowFilterModal(false)}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );

  // Модальное окно отчета
  const ReportModal: React.FC<{
    report: FinancialReport | null;
    onClose: () => void;
    show: boolean;
  }> = ({ report, onClose, show }) => {
    if (!report || !show) return null;

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800';
        case 'submitted': return 'bg-blue-100 text-blue-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'final': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'balance': return '⚖️';
        case 'income': return '📈';
        case 'expense': return '📉';
        case 'tax': return '📋';
        case 'custom': return '📊';
        default: return '📄';
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{report.title}</h2>
              <button onClick={onClose} className="text-white hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
              <span className="text-white text-sm">•</span>
              <span className="text-white text-sm">{report.period}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getTypeIcon(report.type)}</span>
                  <h3 className="text-lg font-semibold">Тип отчета</h3>
                </div>
                <p className="text-gray-600">{report.type.charAt(0).toUpperCase() + report.type.slice(1)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👤</span>
                  <h3 className="text-lg font-semibold">Автор</h3>
                </div>
                <p className="text-gray-600">{report.author}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Описание</h3>
              <p className="text-gray-600">{report.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Создан: {new Date(report.createdAt).toLocaleDateString('ru-RU')}</span>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-xs hover:bg-blue-600 transition-colors">
                  Экспорт
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xs hover:bg-gray-200 transition-colors">
                  Скачать PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Рендер
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Финансовые отчеты</h1>
      
      {/* Фильтры и действия */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
            onClick={() => setShowFilterModal(true)}
          >
            <FaFilter className="mr-2" />
            Фильтры
            {(filters.period !== 'all' || filters.type !== 'all' || filters.status !== 'all') && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filters).filter(v => v !== 'all').length}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            <FaFileExport className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Общий доход</div>
            <FaChartLine className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.totalIncome} KZT</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Средний платеж</div>
            <FaMoneyBillWave className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.avgPayment} KZT</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Активных учеников</div>
            <FaUserGraduate className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.activeStudents}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Рост дохода</div>
            <FaChartBar className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold mt-2">+{stats.growthRate}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${stats.growthRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* График доходов */}
      <div className="bg-white p-6 rounded-xl shadow-xs mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Динамика доходов и расходов</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()} KZT`}
                labelStyle={{ color: '#1F2937' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Доходы" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Таблица отчетов */}
      <div className="bg-white rounded-lg shadow-xs">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название отчета
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Период
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата создания
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr 
                key={report.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedReport(report);
                  setShowReportModal(true);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{report.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.period}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(report.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    <FaFileExport />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальные окна */}
      {showFilterModal && <FilterModal />}
      {showReportModal && <ReportModal report={selectedReport} onClose={() => setShowReportModal(false)} show={showReportModal} />}
    </div>
  );
};

export default ReportsPage; 