import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { AdminLayout } from '../components/layout/AdminLayout';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { EmployeesPage } from '../pages/Employees/EmployeesPage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetails/EmployeeDetailsPage';
import { EditEmployeePage } from '../pages/EditEmployee/EditEmployeePage';
import { EmployersPage } from '../pages/Employers/EmployersPage';
import { EmployerDetailsPage } from '../pages/EmployerDetails/EmployerDetailsPage';
import { WorkHistoryPage } from '../pages/WorkHistory/WorkHistoryPage';
import { CorrectionsPage } from '../pages/Corrections/CorrectionsPage';
import { SearchPage } from '../pages/Search/SearchPage';
import { AnalyticsPage } from '../pages/Analytics/AnalyticsPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Protected Route Guard Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="employees/:id/edit" element={<EditEmployeePage />} />
        <Route path="employers" element={<EmployersPage />} />
        <Route path="employers/:id" element={<EmployerDetailsPage />} />
        <Route path="work-history" element={<WorkHistoryPage />} />
        <Route path="corrections" element={<CorrectionsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
