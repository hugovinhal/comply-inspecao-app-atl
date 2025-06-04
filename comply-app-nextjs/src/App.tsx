import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Equipments from './pages/Equipments';
import ServiceOrders from './pages/ServiceOrders';
import Inspection from './pages/Inspection';
import Reports from './pages/Reports';
import Sync from './pages/Sync';

// Componentes
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Rota protegida que verifica autenticação
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();
  
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/clients" element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          } />
          
          <Route path="/equipments" element={
            <ProtectedRoute>
              <Equipments />
            </ProtectedRoute>
          } />
          
          <Route path="/service-orders" element={
            <ProtectedRoute>
              <ServiceOrders />
            </ProtectedRoute>
          } />
          
          <Route path="/inspection/:id" element={
            <ProtectedRoute>
              <Inspection />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/sync" element={
            <ProtectedRoute>
              <Sync />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
