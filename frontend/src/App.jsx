import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ComponentsPage } from './pages/ComponentsPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { QuotationsPage } from './pages/QuotationsPage';
import { QuotationDetail } from './pages/QuotationDetail';
import { LoginPage } from './pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/builder" element={<ProtectedRoute><ConfiguratorPage /></ProtectedRoute>} />
                <Route path="/components" element={<ProtectedRoute><ComponentsPage /></ProtectedRoute>} />
                <Route path="/quotations" element={<ProtectedRoute><QuotationsPage /></ProtectedRoute>} />
                <Route path="/quotations/:id" element={<ProtectedRoute><QuotationDetail /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
