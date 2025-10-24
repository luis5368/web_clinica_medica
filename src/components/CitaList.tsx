// src/components/CitaList.tsx
import React from 'react';

interface Cita { id: number; paciente: string; fecha: string; motivo: string; }

const CitaList: React.FC<{ citas: Cita[]; onDelete: (id: number) => void }> = ({ citas, onDelete }) => (
  <ul>
    {citas.map(c => (
      <li key={c.id}>
        {c.paciente} — {c.fecha} — {c.motivo}
        <button onClick={() => onDelete(c.id)}>Eliminar</button>
      </li>
    ))}
  </ul>
);

export default CitaList;
