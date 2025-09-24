import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout
import DashboardLayout from './layouts/dashboard/DashboardLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import AttendancePage from './pages/AttendancePage';
import TimetablePage from './pages/TimetablePage';
import ExamsResultsPage from './pages/ExamsResultsPage';
import FeesPaymentsPage from './pages/FeesPaymentsPage';
import LibraryPage from './pages/LibraryPage';
import HostelPage from './pages/HostelPage';
import NotificationsPage from './pages/NotificationsPage';
import TransportPage from './pages/TransportPage';
import SupportPage from './pages/SupportPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/sih-erp-prototype'}>
      <Toaster position='top-right' />
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route 
            path='/dashboard' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/students' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StudentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/attendance' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AttendancePage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/timetable' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TimetablePage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/exams-results' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ExamsResultsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/fees-payments' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FeesPaymentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/library' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LibraryPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/hostel' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <HostelPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/notifications' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NotificationsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/transport' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TransportPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/support' 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SupportPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
