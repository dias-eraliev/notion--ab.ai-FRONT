import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AcademicJournalPage from './pages/AcademicJournalPage';
import SchedulePage from './pages/SchedulePage';
import ClassroomsPage from './pages/ClassroomsPage';
import BookingRequestsPage from './pages/BookingRequestsPage';
import StudyPlansPage from './pages/StudyPlansPage';
import StudyPlanDetailPage from './pages/StudyPlanDetailPage';
import LessonDetailPage from './pages/LessonDetailPage';
import { LanguageProvider } from './providers/LanguageProvider';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import ChatPage from './pages/app/ChatPage';
import AIChatPage from './pages/app/AIChatPage';
import CalendarPage from './pages/app/CalendarPage';
import EmailPage from './pages/app/EmailPage';
import TodoPage from './pages/app/TodoPage';
import FilesPage from './pages/app/FilesPage';
import SettingsPage from './pages/app/SettingsPage';
import ProfilePage from './pages/app/ProfilePage';
import PerformancePage from './pages/PerformancePage';
import EmotionalAnalysisPage from './pages/EmotionalAnalysisPage';
import EmployeesPage from './pages/hr/EmployeesPage';
import WorkloadPage from './pages/hr/WorkloadPage';
import KpiPage from './pages/hr/KpiPage';
import VacationPage from './pages/hr/VacationPage';
import FakePositionsPage from './pages/hr/FakePositionsPage';
import PaymentsPage from './pages/finance/PaymentsPage';
import ReportsPage from './pages/finance/ReportsPage';
import BudgetPage from './pages/finance/BudgetPage';
import PayrollPage from './pages/finance/PayrollPage';
import SalariesPage from './pages/finance/SalariesPage';
import AntiFraudPage from './pages/finance/AntiFraudPage';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Academic routes */}
            <Route path="academic-journal" element={<AcademicJournalPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="classrooms" element={<ClassroomsPage />} />
            <Route path="requests" element={<BookingRequestsPage />} />
            <Route path="requests/new" element={<BookingRequestsPage />} />
            <Route path="study-plans" element={<StudyPlansPage />} />
            <Route path="study-plans/:id" element={<StudyPlanDetailPage />} />
            <Route path="study-plans/:id/lessons/:lessonId" element={<LessonDetailPage />} />
            
            {/* Students routes */}
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentDetailPage />} />
            <Route path="students/emotional-analysis" element={<EmotionalAnalysisPage />} />
            <Route path="performance" element={<PerformancePage />} />
            
            {/* Applications routes */}
            <Route path="app/chat" element={<ChatPage />} />
            <Route path="app/ai-chat" element={<AIChatPage />} />
            <Route path="app/calendar" element={<CalendarPage />} />
            <Route path="app/email" element={<EmailPage />} />
            <Route path="app/tasks" element={<TodoPage />} />
            <Route path="app/files" element={<FilesPage />} />
            <Route path="app/profile" element={<ProfilePage />} />
            
            {/* HR routes */}
            <Route path="hr/employees" element={<EmployeesPage />} />
            <Route path="hr/workload" element={<WorkloadPage />} />
            <Route path="hr/kpi" element={<KpiPage />} />
            <Route path="hr/vacation" element={<VacationPage />} />
            <Route path="hr/fake-positions" element={<FakePositionsPage />} />
            
            {/* Finance routes */}
            <Route path="finance/payments" element={<PaymentsPage />} />
            <Route path="finance/reports" element={<ReportsPage />} />
            <Route path="finance/budget" element={<BudgetPage />} />
            <Route path="finance/payroll" element={<PayrollPage />} />
            <Route path="finance/salaries" element={<SalariesPage />} />
            <Route path="finance/antifraud" element={<AntiFraudPage />} />
            
            {/* Settings routes */}
            <Route path="settings/users" element={<SettingsPage />} />
            <Route path="settings/permissions" element={<SettingsPage />} />
            <Route path="settings/integrations" element={<SettingsPage />} />
            <Route path="settings/branding" element={<SettingsPage />} />
            <Route path="settings/system" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App; 