// src/components/AdminPanel.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';
import CalendarView from './CalendarView';

interface User { id: number; username: string; role: string; created_by: number | null; }
interface Paciente { id: number; nombre: string; edad: number; genero: string; }
interface Inventario { id: number; nombre: string; cantidad: number; }
interface Empleado { id: number; nombre: string; puesto: string; }
interface Habitacion { id: number; numero: string; tipo: string; }
interface Historial { id: number; pacienteId: number; fecha: string; diagnostico: string; tratamiento: string; notas: string; }
interface Cita { id: number; paciente: string; fecha: string; hora: string; motivo: string; }

const ROLES: Array<'admin' | 'recepcionista' | 'medico' | 'enfermero'> = ['admin','recepcionista','medico','enfermero'];

type View = 'usuarios'|'pacientes'|'inventario'|'empleados'|'habitaciones'|'historial'|'citas'|'calendar';

const AdminPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [view, setView] = useState<View>('usuarios');
  const [error, setError] = useState('');

  // --- Estados CRUD ---
  const [users, setUsers] = useState<User[]>([]);
  const [nuser, setNuser] = useState(''); const [npass, setNpass] = useState(''); const [nrole, setNrole] = useState<typeof ROLES[number]>('recepcionista');

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pNombre, setPNombre] = useState(''); const [pEdad, setPEdad] = useState(''); const [pGenero, setPGenero] = useState('M');

  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [iNombre, setINombre] = useState(''); const [iCantidad, setICantidad] = useState('');

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [eNombre, setENombre] = useState(''); const [ePuesto, setEPuesto] = useState('');

  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hNumero, setHNumero] = useState(''); const [hTipo, setHTipo] = useState('');

  const [historial, setHistorial] = useState<Historial[]>([]);
  const [hPacienteId, setHPacienteId] = useState<number | null>(null);
  const [hFecha, setHFecha] = useState(''); const [hDiagnostico, setHDiagnostico] = useState('');
  const [hTratamiento, setHTratamiento] = useState(''); const [hNotas, setHNotas] = useState('');

  const [citas, setCitas] = useState<Cita[]>([]);
  const [cPaciente, setCPaciente] = useState(''); const [cFecha, setCFecha] = useState('');
  const [cHora, setCHora] = useState(''); const [cMotivo, setCMotivo] = useState('');

  // ------------------ FETCH ------------------
  useEffect(() => {
    if(token){
      fetchUsers(); fetchPacientes(); fetchInventario();
      fetchEmpleados(); fetchHabitaciones(); fetchHistorial(); fetchCitas();
    }
  }, [token]);

  const fetchUsers = async()=>{try{const res=await api.get('/api/users',{headers:{Authorization:`Bearer ${token}`}}); setUsers(res.data);}catch(err){console.error(err); setError('Error al obtener usuarios');}};
  const fetchPacientes = async()=>{try{const res=await api.get('/api/pacientes',{headers:{Authorization:`Bearer ${token}`}}); setPacientes(res.data);}catch(err){console.error(err);}};
  const fetchInventario = async()=>{try{const res=await api.get('/api/inventario',{headers:{Authorization:`Bearer ${token}`}}); setInventario(res.data);}catch(err){console.error(err);}};
  const fetchEmpleados = async()=>{try{const res=await api.get('/api/empleados',{headers:{Authorization:`Bearer ${token}`}}); setEmpleados(res.data);}catch(err){console.error(err);}};
  const fetchHabitaciones = async()=>{try{const res=await api.get('/api/habitaciones',{headers:{Authorization:`Bearer ${token}`}}); setHabitaciones(res.data);}catch(err){console.error(err);}};
  const fetchHistorial = async()=>{try{const res=await api.get('/api/historial',{headers:{Authorization:`Bearer ${token}`}}); setHistorial(res.data);}catch(err){console.error(err);}};
  const fetchCitas = async()=>{try{const res=await api.get('/api/citas',{headers:{Authorization:`Bearer ${token}`}}); setCitas(res.data);}catch(err){console.error(err);}};

  // ------------------ CREATE ------------------
  const createUser = async()=>{try{await api.post('/api/users',{username:nuser,password:npass,role:nrole},{headers:{Authorization:`Bearer ${token}`}}); setNuser(''); setNpass(''); fetchUsers();}catch(err){console.error(err); setError('Error al crear usuario');}};
  const createPaciente = async()=>{if(!pNombre||!pEdad)return; try{const res=await api.post('/api/pacientes',{nombre:pNombre,edad:pEdad,genero:pGenero},{headers:{Authorization:`Bearer ${token}`}}); setPacientes(prev=>[...prev,res.data]); setPNombre(''); setPEdad(''); setPGenero('M');}catch(err){console.error(err);}};
  const createInventario = async()=>{if(!iNombre||!iCantidad)return; try{const res=await api.post('/api/inventario',{nombre:iNombre,cantidad:Number(iCantidad)},{headers:{Authorization:`Bearer ${token}`}}); setInventario(prev=>[...prev,res.data]); setINombre(''); setICantidad('');}catch(err){console.error(err);}};
  const createEmpleado = async()=>{if(!eNombre||!ePuesto)return; try{const res=await api.post('/api/empleados',{nombre:eNombre,puesto:ePuesto},{headers:{Authorization:`Bearer ${token}`}}); setEmpleados(prev=>[...prev,res.data]); setENombre(''); setEPuesto('');}catch(err){console.error(err);}};
  const createHabitacion = async()=>{if(!hNumero||!hTipo)return; try{const res=await api.post('/api/habitaciones',{numero:hNumero,tipo:hTipo},{headers:{Authorization:`Bearer ${token}`}}); setHabitaciones(prev=>[...prev,res.data]); setHNumero(''); setHTipo('');}catch(err){console.error(err);}};
  const createHistorial = async()=>{if(!hPacienteId||!hFecha||!hDiagnostico)return; try{const res=await api.post('/api/historial',{pacienteId:hPacienteId,fecha:hFecha,diagnostico:hDiagnostico,tratamiento:hTratamiento,notas:hNotas},{headers:{Authorization:`Bearer ${token}`}}); setHistorial(prev=>[...prev,res.data]); setHPacienteId(null); setHFecha(''); setHDiagnostico(''); setHTratamiento(''); setHNotas('');}catch(err){console.error(err);}};
  const createCita = async()=>{if(!cPaciente||!cFecha||!cHora||!cMotivo)return; try{const res=await api.post('/api/citas',{paciente:cPaciente,fecha:cFecha,hora:cHora,motivo:cMotivo},{headers:{Authorization:`Bearer ${token}`}}); setCitas(prev=>[...prev,res.data]); setCPaciente(''); setCFecha(''); setCHora(''); setCMotivo('');}catch(err){console.error(err);}};

  // ------------------ DELETE ------------------
  const deleteItem = async(endpoint:string,id:number,setter:Function)=>{try{await api.delete(`${endpoint}/${id}`,{headers:{Authorization:`Bearer ${token}`}}); setter((prev:any)=>prev.filter((i:any)=>i.id!==id));}catch(err){console.error(err);}};

  // ------------------ RENDER ------------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">MENÚ</h1>
          <nav className="space-y-4">
            {['usuarios','pacientes','inventario','empleados','habitaciones','historial','citas','calendar'].map(v=>
              <button key={v} className="text-left w-full" onClick={()=>setView(v as View)}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
            )}
          </nav>
        </div>
        <button onClick={logout} className="bg-red-500 text-white mt-6 px-4 py-2 rounded hover:bg-red-600">Cerrar sesión</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administrador</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* --- Usuarios --- */}
        {view==='usuarios' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Usuarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input value={nuser} onChange={e=>setNuser(e.target.value)} placeholder="Usuario" className="p-2 border rounded"/>
              <input type="password" value={npass} onChange={e=>setNpass(e.target.value)} placeholder="Contraseña" className="p-2 border rounded"/>
              <select value={nrole} onChange={e=>setNrole(e.target.value as typeof ROLES[number])} className="p-2 border rounded">{ROLES.map(r=><option key={r} value={r}>{r}</option>)}</select>
              <button onClick={createUser} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Crear</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Usuario</th><th>Rol</th><th>Creado por</th><th>Acciones</th></tr></thead>
              <tbody>{users.map(u=><tr key={u.id}><td className="p-2 border">{u.id}</td><td className="p-2 border">{u.username}</td><td className="p-2 border">{u.role}</td><td className="p-2 border">{u.created_by??'N/A'}</td><td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/users',u.id,setUsers)}>Eliminar</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {/* --- Pacientes --- */}
        {view==='pacientes' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input value={pNombre} onChange={e=>setPNombre(e.target.value)} placeholder="Nombre" className="p-2 border rounded"/>
              <input value={pEdad} onChange={e=>setPEdad(e.target.value)} placeholder="Edad" className="p-2 border rounded"/>
              <select value={pGenero} onChange={e=>setPGenero(e.target.value)} className="p-2 border rounded"><option value="M">Masculino</option><option value="F">Femenino</option></select>
              <button onClick={createPaciente} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Crear</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Nombre</th><th>Edad</th><th>Género</th><th>Acciones</th></tr></thead>
              <tbody>{pacientes.map(p=><tr key={p.id}><td className="p-2 border">{p.id}</td><td className="p-2 border">{p.nombre}</td><td className="p-2 border">{p.edad}</td><td className="p-2 border">{p.genero}</td><td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/pacientes',p.id,setPacientes)}>Eliminar</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {/* --- Inventario --- */}
        {view==='inventario' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Inventario</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={iNombre} onChange={e=>setINombre(e.target.value)} placeholder="Nombre" className="p-2 border rounded"/>
              <input value={iCantidad} onChange={e=>setICantidad(e.target.value)} placeholder="Cantidad" className="p-2 border rounded"/>
              <button onClick={createInventario} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Nombre</th><th>Cantidad</th><th>Acciones</th></tr></thead>
              <tbody>{inventario.map(i=><tr key={i.id}><td className="p-2 border">{i.id}</td><td className="p-2 border">{i.nombre}</td><td className="p-2 border">{i.cantidad}</td><td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/inventario',i.id,setInventario)}>Eliminar</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {/* --- Empleados --- */}
        {view==='empleados' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Empleados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={eNombre} onChange={e=>setENombre(e.target.value)} placeholder="Nombre" className="p-2 border rounded"/>
              <input value={ePuesto} onChange={e=>setEPuesto(e.target.value)} placeholder="Puesto" className="p-2 border rounded"/>
              <button onClick={createEmpleado} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Nombre</th><th>Puesto</th><th>Acciones</th></tr></thead>
              <tbody>{empleados.map(e=><tr key={e.id}><td className="p-2 border">{e.id}</td><td className="p-2 border">{e.nombre}</td><td className="p-2 border">{e.puesto}</td><td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/empleados',e.id,setEmpleados)}>Eliminar</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {/* --- Habitaciones --- */}
        {view==='habitaciones' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Habitaciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={hNumero} onChange={e=>setHNumero(e.target.value)} placeholder="Número" className="p-2 border rounded"/>
              <input value={hTipo} onChange={e=>setHTipo(e.target.value)} placeholder="Tipo" className="p-2 border rounded"/>
              <button onClick={createHabitacion} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Número</th><th>Tipo</th><th>Acciones</th></tr></thead>
              <tbody>{habitaciones.map(h=><tr key={h.id}><td className="p-2 border">{h.id}</td><td className="p-2 border">{h.numero}</td><td className="p-2 border">{h.tipo}</td><td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/habitaciones',h.id,setHabitaciones)}>Eliminar</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {/* --- Historial --- */}
        {view==='historial' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Historial Clínico</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <select value={hPacienteId??''} onChange={e=>setHPacienteId(Number(e.target.value)||null)} className="p-2 border rounded">
                <option value="">Seleccionar paciente</option>
                {pacientes.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              <input type="date" value={hFecha} onChange={e=>setHFecha(e.target.value)} className="p-2 border rounded"/>
              <input value={hDiagnostico} onChange={e=>setHDiagnostico(e.target.value)} placeholder="Diagnóstico" className="p-2 border rounded"/>
              <input value={hTratamiento} onChange={e=>setHTratamiento(e.target.value)} placeholder="Tratamiento" className="p-2 border rounded"/>
              <input value={hNotas} onChange={e=>setHNotas(e.target.value)} placeholder="Notas" className="p-2 border rounded"/>
              <button onClick={createHistorial} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Paciente ID</th><th>Fecha</th><th>Diagnóstico</th><th>Tratamiento</th><th>Notas</th><th>Acciones</th></tr></thead>
              <tbody>{historial.map(h=><tr key={h.id}><td className="p-2 border">{h.id}</td><td className="p-2 border">{h.pacienteId}</td><td className="p-2 border">{h.fecha}</td><td className="p-2 border">{h.diagnostico}</td><td className="p-2 border">{h.tratamiento}</td><td className="p-2 border">{h.notas}</td><td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/historial',h.id,setHistorial)}>Eliminar</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {/* --- Citas --- */}
        {view==='citas' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Citas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input value={cPaciente} onChange={e=>setCPaciente(e.target.value)} placeholder="Paciente" className="p-2 border rounded"/>
              <input type="date" value={cFecha} onChange={e=>setCFecha(e.target.value)} className="p-2 border rounded"/>
              <input type="time" value={cHora} onChange={e=>setCHora(e.target.value)} className="p-2 border rounded"/>
              <input value={cMotivo} onChange={e=>setCMotivo(e.target.value)} placeholder="Motivo" className="p-2 border rounded"/>
            </div>
            <button onClick={createCita} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">Crear Cita</button>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Motivo</th><th>Acciones</th></tr></thead>
              <tbody>{citas.map(c=><tr key={c.id}><td className="p-2 border">{c.paciente}</td><td className="p-2 border">{c.fecha}</td><td className="p-2 border">{c.hora}</td><td className="p-2 border">{c.motivo}</td><td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/citas',c.id,setCitas)}>Eliminar</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {/* --- Calendario --- */}
        {view==='calendar' && <CalendarView citas={citas}/>}
      </main>
    </div>
  );
};

export default AdminPanel;
