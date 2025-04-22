import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
// Импортируем все страницы из сайдбара (пример)
import ChatPage from './pages/app/ChatPage';
import AIChatPage from './pages/app/AIChatPage';
import CalendarPage from './pages/app/CalendarPage';
import EmailPage from './pages/app/EmailPage';
import TodoPage from './pages/app/TodoPage';
import FilesPage from './pages/app/FilesPage';
import AcademicJournalPage from './pages/academic/AcademicJournalPage';
import SchedulePage from './pages/academic/SchedulePage';
import HomeworkPage from './pages/academic/HomeworkPage';
import ClassroomsPage from './pages/academic/ClassroomsPage';
import StudyPlansPage from './pages/academic/StudyPlansPage';
import StudentsPage from './pages/students/StudentsPage';
import PerformancePage from './pages/reports/PerformanceSchoolPage';
import EmployeesPage from './pages/hr/EmployeesPage';
import WorkloadPage from './pages/hr/WorkloadPage';
import KpiPage from './pages/hr/KpiPage';
import VacationPage from './pages/hr/VacationPage';
import FakePositionsPage from './pages/hr/FakePositionsPage';
import PaymentsPage from './pages/finance/PaymentsPage';
import ReportsPage from './pages/finance/ReportsPage';
import BudgetPage from './pages/finance/BudgetPage';
import PayrollPage from './pages/finance/PayrollPage';
import UsersPage from './pages/settings/UsersPage';
import PermissionsPage from './pages/settings/PermissionsPage';
import IntegrationsPage from './pages/settings/IntegrationsPage';
import BrandingPage from './pages/settings/BrandingPage';
import SystemPage from './pages/settings/SystemPage';
import InventoryPage from './pages/erp/InventoryPage';
import SupplyPage from './pages/erp/SupplyPage';
import SecurityPage from './pages/erp/SecurityPage';
import { AuthProvider } from './providers/AuthProvider';
import AboutPage from './pages/reports/AboutPage';
import PerformanceClassesPage from './pages/reports/PerformanceClassesPage';
import PerformanceStudentsPage from './pages/reports/PerformanceStudentsPage';
import PerformanceTeacherSubjectPage from './pages/reports/PerformanceTeacherSubjectPage';
import PerformanceClassSubjectPage from './pages/reports/PerformanceClassSubjectPage';
import PerformanceSorSochPage from './pages/reports/PerformanceSorSochPage';
import AttendanceSchoolPage from './pages/reports/AttendanceSchoolPage';
import AttendanceClassesPage from './pages/reports/AttendanceClassesPage';

const NotFound = () => <div style={{padding: 32, fontSize: 24}}>Страница не найдена</div>;

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="teacher" element={<TeacherDashboard />} />
            <Route path="student" element={<StudentDashboard />} />
            <Route path="parent" element={<ParentDashboard />} />
            {/* Приложение */}
            <Route path="app/chat" element={<ChatPage />} />
            <Route path="app/ai-chat" element={<AIChatPage />} />
            <Route path="app/calendar" element={<CalendarPage />} />
            <Route path="app/email" element={<EmailPage />} />
            <Route path="app/tasks" element={<TodoPage />} />
            <Route path="app/files" element={<FilesPage />} />
            {/* Учебный процесс */}
            <Route path="academic/academic-journal" element={<AcademicJournalPage />} />
            <Route path="academic/schedule" element={<SchedulePage />} />
            <Route path="academic/homework" element={<HomeworkPage />} />
            <Route path="academic/classrooms" element={<ClassroomsPage />} />
            <Route path="study-plans" element={<StudyPlansPage />} />
            {/* Студенты */}
            <Route path="students" element={<StudentsPage />} />
            <Route path="performance" element={<PerformancePage />} />
            {/* HR */}
            <Route path="hr/employees" element={<EmployeesPage />} />
            <Route path="hr/workload" element={<WorkloadPage />} />
            <Route path="hr/kpi" element={<KpiPage />} />
            <Route path="hr/vacation" element={<VacationPage />} />
            <Route path="hr/fake-positions" element={<FakePositionsPage />} />
            {/* Финансы */}
            <Route path="finance/payments" element={<PaymentsPage />} />
            <Route path="finance/reports" element={<ReportsPage />} />
            <Route path="finance/budget" element={<BudgetPage />} />
            <Route path="finance/payroll" element={<PayrollPage />} />
            {/* ERP */}
            <Route path="app/erp/inventory" element={<InventoryPage />} />
            <Route path="app/erp/supply" element={<SupplyPage />} />
            <Route path="app/erp/security" element={<SecurityPage />} />
            {/* Настройки */}
            <Route path="settings/users" element={<UsersPage />} />
            <Route path="settings/permissions" element={<PermissionsPage />} />
            <Route path="settings/integrations" element={<IntegrationsPage />} />
            <Route path="settings/branding" element={<BrandingPage />} />
            <Route path="settings/system" element={<SystemPage />} />
            {/* Reports routes */}
            <Route path="reports/about" element={<AboutPage />} />
            <Route path="reports/performance/school" element={<PerformancePage />} />
            <Route path="reports/performance/classes" element={<PerformancePage />} />
            <Route path="reports/performance/students" element={<PerformancePage />} />
            <Route path="reports/performance/teacher-subject" element={<PerformancePage />} />
            <Route path="reports/performance/class-subject" element={<PerformancePage />} />
            <Route path="reports/performance/sor-soch" element={<PerformancePage />} />
            <Route path="reports/attendance/school" element={<AttendanceSchoolPage />} />
            <Route path="reports/attendance/classes" element={<AttendanceClassesPage />} />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App; 