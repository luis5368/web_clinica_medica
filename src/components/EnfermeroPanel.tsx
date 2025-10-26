// src/components/EnfermeroPanel.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';

interface Paciente {
  id: number;
  nombre: string;
  edad: number;
  genero: string;
}

interface Historial {
  id: number;
  pacienteId: number;
  fecha: string;
  signosVitales: string;
  notas: string;
}

type View = 'pacientes' | 'historial' | 'citas';

const EnfermeroPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [view, setView] = useState<View>('pacientes');

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [citas, setCitas] = useState<any[]>([]);

  // --- Fetch ---
  const fetchPacientes = async () => {
    try {
      const res = await api.get('/api/pacientes', { headers: { Authorization: `Bearer ${token}` } });
      setPacientes(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistorial = async () => {
    try {
      const res = await api.get('/api/historial', { headers: { Authorization: `Bearer ${token}` } });
      setHistorial(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCitas = async () => {
    try {
      const res = await api.get('/api/citas', { headers: { Authorization: `Bearer ${token}` } });
      setCitas(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) {
      fetchPacientes();
      fetchHistorial();
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
            <button className="text-left w-full" onClick={() => setView('pacientes')}>Pacientes</button>
            <button className="text-left w-full" onClick={() => setView('historial')}>Historial Clínico</button>
            <button className="text-left w-full" onClick={() => setView('citas')}>Citas</button>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Enfermería</h2>

        {view === 'pacientes' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Nombre</th>
                  <th className="p-2 border">Edad</th>
                  <th className="p-2 border">Género</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(p => (
                  <tr key={p.id}>
                    <td className="p-2 border">{p.id}</td>
                    <td className="p-2 border">{p.nombre}</td>
                    <td className="p-2 border">{p.edad}</td>
                    <td className="p-2 border">{p.genero}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'historial' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Historial Clínico</h3>
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Paciente</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Signos Vitales</th>
                  <th className="p-2 border">Notas</th>
                </tr>
              </thead>
              <tbody>
                {historial.map(h => {
                  const paciente = pacientes.find(p => p.id === h.pacienteId);
                  return (
                    <tr key={h.id}>
                      <td className="p-2 border">{paciente?.nombre}</td>
                      <td className="p-2 border">{h.fecha}</td>
                      <td className="p-2 border">{h.signosVitales}</td>
                      <td className="p-2 border">{h.notas}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {view === 'citas' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Citas Asignadas</h3>
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Paciente</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Hora</th>
                  <th className="p-2 border">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {citas.map(c => (
                  <tr key={c.id}>
                    <td className="p-2 border">{c.paciente}</td>
                    <td className="p-2 border">{c.fecha}</td>
                    <td className="p-2 border">{c.hora}</td>
                    <td className="p-2 border">{c.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
};

export default EnfermeroPanel;
