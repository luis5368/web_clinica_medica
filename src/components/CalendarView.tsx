// src/components/CalendarView.tsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from '../Api';
import { useAuth } from '../AuthContext';

interface Cita {
  id: number;
  paciente: string;
  fecha: string;
  motivo: string;
}

const CalendarView: React.FC = () => {
  const { token } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);

  const fetchCitas = async () => {
    const res = await api.get('/api/citas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCitas(res.data);
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Agenda médica</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={citas.map((cita) => ({
          id: String(cita.id),
          title: `${cita.paciente} - ${cita.motivo}`,
          start: cita.fecha,
          end: cita.fecha, // puedes extender duración si la agregas
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          textColor: '#fff',
        }))}
        height="auto"
      />
    </div>
  );
};

export default CalendarView;
