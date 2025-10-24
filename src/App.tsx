// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/login';
import Register from './components/register';
import AdminPanel from './components/AdminPanel';
import ReceptionPanel from './components/ReceptionPanel';
import SuperAdminPanel from './components/SuperAdminPanel';

// Componente que protege la ruta /panel y muestra el panel según el rol
function ProtectedRoutes() {
  const { token, role } = useAuth();

  // Si no hay token, redirige al login
  if (!token) return <Navigate to="/login" replace />;

  // Redirige al panel correspondiente según el rol
  if (role === 'superadmin') return <SuperAdminPanel />;
  if (role === 'admin') return <AdminPanel />;
  if (role === 'recepcionista') return <ReceptionPanel />;

  // Si el rol no es válido
  return <div className="text-center p-4">Rol no reconocido</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redireccionar '/' a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta protegida por token y rol */}
          <Route path="/panel" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
