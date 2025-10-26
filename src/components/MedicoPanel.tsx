// src/components/MedicoPanel.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';
import CalendarView from './CalendarView';

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
  diagnostico: string;
  tratamiento: string;
  notas: string;
}

interface Cita {
  id: number;
  paciente: string;
  fecha: string;
  hora: string;
  motivo: string;
}

type View = 'pacientes' | 'historial' | 'calendar';

const MedicoPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [view, setView] = useState<View>('pacientes');

  // Datos pacientes
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  // Historial clínico
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [fecha, setFecha] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [notas, setNotas] = useState('');

  // Citas
  const [citas, setCitas] = useState<Cita[]>([]);

  const fetchPacientes = async () => {
    try {
      const res = await api.get('/api/pacientes', { headers: { Authorization: `Bearer ${token}` } });
      setPacientes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistorial = async () => {
    try {
      const res = await api.get('/api/historial', { headers: { Authorization: `Bearer ${token}` } });
      setHistorial(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCitas = async () => {
    try {
      const res = await api.get('/api/citas', { headers: { Authorization: `Bearer ${token}` } });
      setCitas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createHistorial = async () => {
    if (!pacienteId || !fecha || !diagnostico) return;
    try {
      const res = await api.post(
        '/api/historial',
        { pacienteId, fecha, diagnostico, tratamiento, notas },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistorial(prev => [...prev, res.data]);
      setPacienteId(null); setFecha(''); setDiagnostico(''); setTratamiento(''); setNotas('');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPacientes();
      fetchHistorial();
      fetchCitas();
    }
  }, [token]);

  const totalCitas = citas.length;
  const proximas = citas.filter(c => new Date(c.fecha) > new Date()).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">MENÚ</h1>
          <nav className="space-y-4">
            <button className="text-left w-full" onClick={() => setView('pacientes')}>Pacientes</button>
            <button className="text-left w-full" onClick={() => setView('historial')}>Historial Clínico</button>
            <button className="text-left w-full" onClick={() => setView('calendar')}>Calendario</button>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Médico</h2>

        {/* Tarjetas resumen citas */}
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <select onChange={e => setPacienteId(Number(e.target.value))} className="p-2 border rounded" value={pacienteId ?? ''}>
                <option value="">Seleccione paciente</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="p-2 border rounded" />
              <input value={diagnostico} onChange={e => setDiagnostico(e.target.value)} placeholder="Diagnóstico" className="p-2 border rounded" />
              <input value={tratamiento} onChange={e => setTratamiento(e.target.value)} placeholder="Tratamiento" className="p-2 border rounded" />
              <input value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas" className="p-2 border rounded" />
              <button onClick={createHistorial} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Crear</button>
            </div>

            <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Paciente</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Diagnóstico</th>
                  <th className="p-2 border">Tratamiento</th>
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
                      <td className="p-2 border">{h.diagnostico}</td>
                      <td className="p-2 border">{h.tratamiento}</td>
                      <td className="p-2 border">{h.notas}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

export default MedicoPanel;
