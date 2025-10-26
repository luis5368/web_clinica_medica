// src/components/AdminPanel.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';
import CalendarView from './CalendarView'; // Si quieres mostrar calendario de citas

interface User {
  id: number;
  username: string;
  role: string;
  created_by: number | null;
}

interface Cita {
  id: number;
  paciente: string;
  fecha: string;
  hora: string;
  motivo: string;
}

const ROLES: Array<'admin' | 'recepcionista' | 'medico' | 'enfermero'> = [
  'admin',
  'recepcionista',
  'medico',
  'enfermero',
];

type View =
  | 'usuarios'
  | 'pacientes'
  | 'inventario'
  | 'empleados'
  | 'habitaciones'
  | 'historial'
  | 'citas'
  | 'calendar';

const AdminPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [view, setView] = useState<View>('usuarios');

  // --- Usuarios ---
  const [users, setUsers] = useState<User[]>([]);
  const [nuser, setNuser] = useState('');
  const [npass, setNpass] = useState('');
  const [nrole, setNrole] = useState<typeof ROLES[number]>('recepcionista');

  // --- Citas ejemplo para calendario ---
  const [citas, setCitas] = useState<Cita[]>([]);
  const [paciente, setPaciente] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');

  const [error, setError] = useState('');

  // --- Fetch Usuarios ---
  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al obtener usuarios');
    }
  };

  const createUser = async () => {
    try {
      await api.post(
        '/api/users',
        { username: nuser, password: npass, role: nrole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNuser('');
      setNpass('');
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Error al crear usuario');
    }
  };

  // --- Fetch Citas ---
  const fetchCitas = async () => {
    try {
      const res = await api.get('/api/citas', { headers: { Authorization: `Bearer ${token}` } });
      setCitas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createCita = async () => {
    if (!paciente || !fecha || !hora || !motivo) return;
    try {
      const res = await api.post(
        '/api/citas',
        { paciente, fecha, hora, motivo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCitas(prev => [...prev, res.data]);
      setPaciente('');
      setFecha('');
      setHora('');
      setMotivo('');
    } catch (err) {
      console.error(err);
    }
  };

  const removeCita = async (id: number) => {
    try {
      await api.delete(`/api/citas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setCitas(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCitas();
    }
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">MENÚ</h1>
          <nav className="space-y-4">
            <button className="text-left w-full" onClick={() => setView('usuarios')}>
              Gestión de Usuarios
            </button>
            <button className="text-left w-full" onClick={() => setView('pacientes')}>
              Pacientes
            </button>
            <button className="text-left w-full" onClick={() => setView('inventario')}>
              Inventario de Medicamentos
            </button>
            <button className="text-left w-full" onClick={() => setView('empleados')}>
              Empleados
            </button>
            <button className="text-left w-full" onClick={() => setView('habitaciones')}>
              Habitaciones
            </button>
            <button className="text-left w-full" onClick={() => setView('historial')}>
              Historial Clínico
            </button>
            <button className="text-left w-full" onClick={() => setView('citas')}>
              Citas
            </button>
            <button className="text-left w-full" onClick={() => setView('calendar')}>
              Calendario
            </button>
          </nav>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white mt-6 px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administrador</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {view === 'usuarios' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Crear Usuario</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                value={nuser}
                onChange={e => setNuser(e.target.value)}
                placeholder="Nombre de usuario"
                className="p-2 border rounded"
              />
              <input
                type="password"
                value={npass}
                onChange={e => setNpass(e.target.value)}
                placeholder="Contraseña"
                className="p-2 border rounded"
              />
              <select
                value={nrole}
                onChange={e => setNrole(e.target.value as typeof ROLES[number])}
                className="p-2 border rounded"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={createUser}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Crear
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-2">Usuarios Registrados</h3>
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Usuario</th>
                  <th className="p-2 border">Rol</th>
                  <th className="p-2 border">Creado por</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="p-2 border">{u.id}</td>
                    <td className="p-2 border">{u.username}</td>
                    <td className="p-2 border">{u.role}</td>
                    <td className="p-2 border">{u.created_by ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'citas' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Citas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                value={paciente}
                onChange={e => setPaciente(e.target.value)}
                placeholder="Paciente"
                className="p-2 border rounded"
              />
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="time"
                value={hora}
                onChange={e => setHora(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Motivo"
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={createCita}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Crear Cita
            </button>

            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Paciente</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Hora</th>
                  <th className="p-2 border">Motivo</th>
                  <th className="p-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map(c => (
                  <tr key={c.id}>
                    <td className="p-2 border">{c.paciente}</td>
                    <td className="p-2 border">{c.fecha}</td>
                    <td className="p-2 border">{c.hora}</td>
                    <td className="p-2 border">{c.motivo}</td>
                    <td className="p-2 border">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeCita(c.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'calendar' && (
          <CalendarView citas={citas} />
        )}

        {/* Aquí puedes agregar componentes de Pacientes, Inventario, Empleados, Habitaciones, Historial Clínico */}
        {view === 'pacientes' && <div>Modulo Pacientes (CRUD)</div>}
        {view === 'inventario' && <div>Modulo Inventario (CRUD)</div>}
        {view === 'empleados' && <div>Modulo Empleados (CRUD)</div>}
        {view === 'habitaciones' && <div>Modulo Habitaciones (CRUD)</div>}
        {view === 'historial' && <div>Modulo Historial Clínico (CRUD)</div>}
      </main>
    </div>
  );
};

export default AdminPanel;
