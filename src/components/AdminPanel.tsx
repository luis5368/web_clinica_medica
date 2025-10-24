// src/components/AdminPanel.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';

interface User {
  id: number;
  username: string;
  role: string;
  created_by: number | null;
}

const AdminPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [nuser, setNuser] = useState('');
  const [npass, setNpass] = useState('');
  const [nrole, setNrole] = useState< 'admin' | 'recepcionista'>('recepcionista');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('Error al obtener usuarios');
    }
  };

  const create = async () => {
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
      console.error('Error al crear usuario:', err);
      setError('Error al crear usuario');
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Panel de Admin</h2>

      <button onClick={logout} className="mb-4 bg-red-500 text-white px-4 py-1 rounded">
        Cerrar sesión
      </button>

      <h3 className="font-semibold mb-2">Crear Usuario</h3>
      <div className="mb-4 space-y-2">
        <input
          className="w-full p-2 border rounded"
          value={nuser}
          onChange={(e) => setNuser(e.target.value)}
          placeholder="Nombre de usuario"
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          value={npass}
          onChange={(e) => setNpass(e.target.value)}
          placeholder="Contraseña"
        />
        <select
          className="w-full p-2 border rounded"
          value={nrole}
          onChange={(e) => setNrole(e.target.value as any)}
        >
          <option value="recepcionista">Recepcionista</option>
        </select>
        <button
          onClick={create}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Crear usuario
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <h3 className="font-semibold mb-2">Usuarios registrados</h3>
      {users.length === 0 ? (
        <p>No hay usuarios registrados aún.</p>
      ) : (
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
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.username}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border">{u.created_by ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;

//Este componente AdminPanel permite a los administradores ver una lista de usuarios registrados y crear nuevos usuarios con roles específicos. Utiliza el contexto de autenticación para manejar tokens y cerrar sesión.