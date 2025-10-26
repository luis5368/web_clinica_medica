//import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/login';
import Register from './components/register';
import AdminPanel from './components/AdminPanel';
import ReceptionPanel from './components/ReceptionPanel';
import SuperAdminPanel from './components/SuperAdminPanel';
import MedicoPanel from './components/MedicoPanel';
import EnfermeroPanel from './components/EnfermeroPanel';

function ProtectedRoutes() {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  switch (role) {
    case 'superadmin':
      return <SuperAdminPanel />;
    case 'admin':
      return <AdminPanel />;
    case 'recepcionista':
      return <ReceptionPanel />;
    case 'medico':
      return <MedicoPanel />;
    case 'enfermero':
      return <EnfermeroPanel />;
    default:
      return <div className="text-center p-4">Rol no reconocido</div>;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/panel" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
