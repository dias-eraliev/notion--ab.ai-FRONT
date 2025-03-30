import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';

const App: React.FC = () => {
  // Здесь позже добавим проверку аутентификации
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/*" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 