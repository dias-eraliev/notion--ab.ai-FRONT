import React from 'react';
import {
  FaGraduationCap,
  FaBook,
  FaTrophy,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaBrain,
  FaUsers,
  FaChartLine,
} from 'react-icons/fa';
import {
  ClassPerformanceWidget,
  CurriculumProgressWidget,
  TopStudentsWidget,
  TeacherActivityWidget,
  AttendanceTrendsWidget,
} from '../components/widgets/EducationWidgets';
import {
  WeeklyIncomeWidget,
  ClassDebtsWidget,
  AIRevenueWidget,
  SalaryFundWidget,
  ExpenseDeviationsWidget,
} from '../components/widgets/FinanceWidgets';
import { useLanguage } from '../hooks/useLanguage';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaGraduationCap className="text-blue-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('classPerformance')}</h3>
            </div>
            <ClassPerformanceWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaBook className="text-green-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('curriculumProgress')}</h3>
            </div>
            <CurriculumProgressWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaTrophy className="text-yellow-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('topStudents')}</h3>
            </div>
            <TopStudentsWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaChalkboardTeacher className="text-purple-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('teacherActivity')}</h3>
            </div>
            <TeacherActivityWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaUserGraduate className="text-indigo-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('attendanceTrends')}</h3>
            </div>
            <AttendanceTrendsWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaMoneyBillWave className="text-green-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('weeklyIncome')}</h3>
            </div>
            <WeeklyIncomeWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-red-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('classDebts')}</h3>
            </div>
            <ClassDebtsWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaBrain className="text-purple-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('aiRevenue')}</h3>
            </div>
            <AIRevenueWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaUsers className="text-blue-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('salaryFund')}</h3>
            </div>
            <SalaryFundWidget />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xs">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-orange-500 mr-2" size={20} />
              <h3 className="text-lg font-medium">{t('expenseDeviations')}</h3>
            </div>
            <ExpenseDeviationsWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 