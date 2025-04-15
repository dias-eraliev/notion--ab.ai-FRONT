import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Dashboard from './Dashboard';
import AcademicJournalPage from './academic/AcademicJournalPage';
import SchedulePage from './academic/SchedulePage';
import ClassroomsPage from './academic/ClassroomsPage';
import BookingRequestsPage from './academic/BookingRequestsPage';
import StudyPlansPage from './academic/StudyPlansPage';
import StudyPlanDetailPage from './academic/StudyPlanDetailPage';
import LessonDetailPage from './academic/LessonDetailPage';
import { LanguageProvider } from '../providers/LanguageProvider';
import StudentsPage from './students/StudentsPage';
import StudentDetailPage from './students/StudentDetailPage';
import ChatPage from './app/ChatPage';
import AIChatPage from './app/AIChatPage';
import CalendarPage from './app/CalendarPage';
import EmailPage from './app/EmailPage';
import TodoPage from './app/TodoPage';
import FilesPage from './app/FilesPage';
import SettingsPage from './app/SettingsPage';
import ProfilePage from './app/ProfilePage';
import PerformancePage from './students/PerformancePage';
import EmployeesPage from './hr/EmployeesPage';
import WorkloadPage from './hr/WorkloadPage';
import KpiPage from './hr/KpiPage';
import VacationPage from './hr/VacationPage';
import FakePositionsPage from './hr/FakePositionsPage';
import PaymentsPage from './finance/PaymentsPage';
import ReportsPage from './finance/ReportsPage';
import BudgetPage from './finance/BudgetPage';
import PayrollPage from './finance/PayrollPage';
import SalariesPage from './finance/SalariesPage';
import AntiFraudPage from './finance/AntiFraudPage';
import Login from './Login';
import { AuthProvider, ProtectedRoute } from '../providers/AuthProvider';
import FileManagerPage from './app/FileManagerPage';
import InventoryPage from './erp/InventoryPage';
import SupplyPage from './erp/SupplyPage';
import SecurityPage from './erp/SecurityPage';
import UsersPage from './settings/UsersPage';
import PermissionsPage from './settings/PermissionsPage';
import IntegrationsPage from './settings/IntegrationsPage';
import BrandingPage from './settings/BrandingPage';
import SystemPage from './settings/SystemPage';
import HomeworkPage from './academic/HomeworkPage';

const App: React.FC = () => {
  return (

    <LanguageProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />

              {/* Academic routes */}
              <Route path="academic/academic-journal" element={<AcademicJournalPage />} />
              <Route path="academic/schedule" element={<SchedulePage />} />
              <Route path="academic/classrooms" element={<ClassroomsPage />} />
              <Route path="academic/requests" element={<BookingRequestsPage />} />
              <Route path="academic/requests/new" element={<BookingRequestsPage />} />
              <Route path="academic/study-plans" element={<StudyPlansPage />} />
              <Route path="academic/study-plans/:id" element={<StudyPlanDetailPage />} />
              <Route path="academic/study-plans/:id/lessons/:lessonId" element={<LessonDetailPage />} />
              <Route path="academic/homework" element={<HomeworkPage />} />

              {/* Students routes */}
              <Route path="students" element={<StudentsPage />} />
              <Route path="students/:id" element={<StudentDetailPage />} />
              <Route path="performance" element={<PerformancePage />} />

              {/* Applications routes */}
              <Route path="app/chat" element={<ChatPage />} />
              <Route path="app/ai-chat" element={<AIChatPage />} />
              <Route path="app/calendar" element={<CalendarPage />} />
              <Route path="app/email" element={<EmailPage />} />
              <Route path="app/tasks" element={<TodoPage />} />
              <Route path="app/files" element={<FileManagerPage />} />
              <Route path="app/profile" element={<ProfilePage />} />
              <Route path="app/erp/inventory" element={<InventoryPage />} />
              <Route path="app/erp/supply" element={<SupplyPage />} />
              <Route path="app/erp/security" element={<SecurityPage />} />

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
              <Route path="settings/users" element={<UsersPage />} />
              <Route path="settings/permissions" element={<PermissionsPage />} />
              <Route path="settings/integrations" element={<IntegrationsPage />} />
              <Route path="settings/branding" element={<BrandingPage />} />
              <Route path="settings/system" element={<SystemPage />} />

              {/* Study Plans routes */}
              <Route path="study-plans" element={<StudyPlansPage />} />
              <Route path="study-plans/:id" element={<StudyPlanDetailPage />} />
              <Route path="study-plans/:id/lessons/:lessonId" element={<LessonDetailPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
};

export default App;