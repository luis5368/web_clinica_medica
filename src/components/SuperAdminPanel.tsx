// src/components/SuperAdminPanel.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

interface User {
  id: number;
  username: string;
  role: string;
  created_by_username?: string;
}

const ROLES = ['superadmin', 'admin', 'recepcionista', 'medico', 'enfermero'] as const;

const SuperAdminPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<typeof ROLES[number]>('recepcionista');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al obtener usuarios');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('No se pudieron cargar los usuarios.');
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al crear usuario');

      setMessage('Usuario creado correctamente');
      setUsername('');
      setPassword('');
      setRole('recepcionista');

      fetchUsers();
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel de SuperAdmin</h1>

      <button
        onClick={logout}
        className="mb-4 bg-red-500 text-white px-4 py-1 rounded"
      >
        Cerrar sesión
      </button>

      <form onSubmit={handleCreateUser} className="space-y-4 bg-white shadow p-6 rounded mb-8">
        <h2 className="text-lg font-semibold mb-2">Crear nuevo usuario</h2>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div>
          <label className="block font-medium">Nombre de usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof ROLES[number])}
            className="w-full border px-3 py-2 rounded"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear usuario
        </button>
      </form>

      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-lg font-semibold mb-4">Usuarios registrados</h2>

        {users.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados aún</p>
        ) : (
          <table className="w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Usuario</th>
                <th className="border px-4 py-2">Rol</th>
                <th className="border px-4 py-2">Creado por</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2 capitalize">{user.role}</td>
                  <td className="border px-4 py-2">{user.created_by_username || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPanel;
