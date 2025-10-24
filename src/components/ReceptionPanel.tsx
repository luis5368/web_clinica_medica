// src/components/ReceptionPanel.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import CalendarView from './CalendarView';

interface Cita {
  id: number;
  paciente: string;
  fecha: string;
  hora: string;
  motivo: string;
}

const ReceptionPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [paciente, setPaciente] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [view, setView] = useState<'citas' | 'calendar'>('citas');

  const fetchCitas = async () => {
    try {
      const res = await api.get('/api/citas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(res.data);
    } catch (error) {
      console.error('Error al obtener citas', error);
    }
  };

  const create = async () => {
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
    } catch (error) {
      console.error('Error al crear cita', error);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/api/citas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar cita', error);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalCitas = citas.length;
  const proximas = citas.filter(c => new Date(c.fecha) > new Date()).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">MENÚ</h1>
          <nav className="space-y-4">
            <button className="text-left w-full" onClick={() => setView('citas')}>Citas</button>
            <p className="text-gray-700">Tipo Consulta</p>
            <p className="text-gray-700">Clientes</p>
            <p className="text-gray-700">Doctores</p>
            <button className="text-left w-full" onClick={() => setView('calendar')}>Calendario</button>
            <p className="text-gray-700">Reportes</p>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white mt-6 px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Recepcionista</h2>

        {/* Tarjetas */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-gray-500">Total de citas</p>
            <p className="text-3xl font-bold text-blue-600">{totalCitas}</p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-gray-500">Próximas citas</p>
            <p className="text-3xl font-bold text-green-600">{proximas}</p>
          </div>
        </div>

        {view === 'citas' && (
          <>
            {/* Crear cita */}
            <div className="bg-white p-6 rounded shadow-md mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Crear nueva cita</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  value={paciente}
                  onChange={e => setPaciente(e.target.value)}
                  placeholder="Nombre del paciente"
                  className="p-3 border rounded"
                />
                <input
                  type="date"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  className="p-3 border rounded"
                />
                <input
                  type="time"
                  value={hora}
                  onChange={e => setHora(e.target.value)}
                  className="p-3 border rounded"
                />
                <input
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  placeholder="Motivo"
                  className="p-3 border rounded"
                />
              </div>
              <button
                onClick={create}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Agendar cita
              </button>
            </div>

            {/* Lista de citas */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Citas agendadas</h3>
            {citas.length === 0 ? (
              <p className="text-gray-500">No hay citas aún.</p>
            ) : (
              <table className="w-full bg-white rounded shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Hora</th>
                    <th className="p-3">Paciente</th>
                    <th className="p-3">Motivo</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map(cita => (
                    <tr key={cita.id} className="border-t">
                      <td className="p-3">{new Date(cita.fecha).toLocaleDateString('es-ES')}</td>
                      <td className="p-3">{cita.hora}</td>
                      <td className="p-3">{cita.paciente}</td>
                      <td className="p-3">{cita.motivo}</td>
                      <td className="p-3">
                        <button
                          onClick={() => remove(cita.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {view === 'calendar' && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Vista de calendario</h3>
            <CalendarView citas={citas} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ReceptionPanel;
