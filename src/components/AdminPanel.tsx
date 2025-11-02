import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';

interface User { id: number; username: string; role: string; created_by: number | null; }
interface Paciente { id: number; dpi?: string; nombres: string; apellidos: string; fechaNacimiento: string; genero: string; direccion?: string; telefono?: string; email?: string; }
interface Inventario { id: number; nombre: string; cantidad: number; }
interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  puesto: string;         // CARGO
  especialidad?: string;
  telefono?: string;
  email?: string;
}

interface Habitacion { id: number; numero: string; tipo: string; estado: string; }
interface Historial { id: number; pacienteId: number; fecha: string; diagnostico: string; tratamiento: string; notas: string; }
interface Cita { id: number; paciente: string; fecha: string; hora: string; motivo: string; }

type View = 'usuarios'|'pacientes'|'inventario'|'empleados'|'habitaciones'|'historial'|'citas'|'calendar';

const AdminPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [view, setView] = useState<View>('usuarios');
  const [error, setError] = useState('');

  // --- STATES ---
  const [users, setUsers] = useState<User[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pId, setPId] = useState<number | null>(null);
  const [pDpi, setPDpi] = useState('');
  const [pNombre, setPNombre] = useState('');
  const [pApellidos, setPApellidos] = useState('');
  const [pFechaNac, setPFechaNac] = useState('');
  const [pGenero, setPGenero] = useState('M');
  const [pDireccion, setPDireccion] = useState('');
  const [pTelefono, setPTelefono] = useState('');
  const [pEmail, setPEmail] = useState('');

  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [iId, setIId] = useState<number | null>(null);
  const [iNombre, setINombre] = useState('');
  const [iCantidad, setICantidad] = useState('');

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
const [eId, setEId] = useState<number | null>(null);
const [eNombre, setENombre] = useState('');
const [eApellidos, setEApellidos] = useState('');
const [ePuesto, setEPuesto] = useState('');
const [eEspecialidad, setEEspecialidad] = useState('');
const [eTelefono, setETelefono] = useState('');
const [eEmail, setEEmail] = useState('');


  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [hId, setHId] = useState<number | null>(null);
  const [hNumero, setHNumero] = useState('');
  const [hTipo, setHTipo] = useState('');
  const [hEstado, setHEstado] = useState('');

  const [historial, setHistorial] = useState<Historial[]>([]);
  const [hisId, setHisId] = useState<number | null>(null);
  const [hisPacienteId, setHisPacienteId] = useState('');
  const [hisFecha, setHisFecha] = useState('');
  const [hisDiagnostico, setHisDiagnostico] = useState('');
  const [hisTratamiento, setHisTratamiento] = useState('');
  const [hisNotas, setHisNotas] = useState('');

  const [citas, setCitas] = useState<Cita[]>([]);

  // --- FETCH DATA ---
  useEffect(() => {
    if(token){
      fetchUsers();
      fetchPacientes();
      fetchInventario();
      fetchEmpleados();
      fetchHabitaciones();
      fetchHistorial();
      fetchCitas();
    }
  }, [token]);

  const fetchUsers = async()=>{ 
    try{ const r = await api.get('/api/users',{headers:{Authorization:`Bearer ${token}`}}); setUsers(r.data);}
    catch{setError('Error cargando usuarios');}
  };

  // --- HELPERS ---
const calcularEdad = (fecha: string) => {
  if (!fecha) return 0;
  const nac = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
};

// --- FORMATEAR FECHA PARA <input type="date"> ---
const formatDateForInput = (fecha: string) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const fetchCitas = async () => {
    try {
      const r = await api.get<{ ID_CITA: number; PACIENTE: string; FECHA: string; HORA: string; MOTIVO: string }[]>('/api/citas', { headers: { Authorization: `Bearer ${token}` } });
      const data: Cita[] = r.data.map(c => ({
        id: c.ID_CITA,
        paciente: c.PACIENTE,
        fecha: c.FECHA,
        hora: c.HORA,
        motivo: c.MOTIVO
      }));
      setCitas(data);
    } catch { setError('Error cargando citas'); }
  };

  const fetchHistorial = async () => {
    try {
      const r = await api.get<{ ID_HISTORIAL: number; ID_PACIENTE: number; FECHA: string; DIAGNOSTICO: string; TRATAMIENTO: string; NOTAS: string }[]>('/api/historial', { headers: { Authorization: `Bearer ${token}` } });
      const data: Historial[] = r.data.map(h => ({
        id: h.ID_HISTORIAL,
        pacienteId: h.ID_PACIENTE,
        fecha: h.FECHA,
        diagnostico: h.DIAGNOSTICO,
        tratamiento: h.TRATAMIENTO,
        notas: h.NOTAS
      }));
      setHistorial(data);
    } catch { setError('Error cargando historial clínico'); }
  };

  const fetchPacientes = async () => {
    try {
      const r = await api.get<{ ID_PACIENTE: number; DPI?: string; NOMBRES: string; APELLIDOS: string; FECHA_NAC: string; SEXO: string; DIRECCION?: string; TELEFONO?: string; EMAIL?: string }[]>('/api/pacientes', { headers: { Authorization: `Bearer ${token}` } });
      const data: Paciente[] = r.data.map(p => ({
        id: p.ID_PACIENTE,
        dpi: p.DPI,
        nombres: p.NOMBRES,
        apellidos: p.APELLIDOS,
        fechaNacimiento: p.FECHA_NAC,
        genero: p.SEXO,
        direccion: p.DIRECCION,
        telefono: p.TELEFONO,
        email: p.EMAIL
      }));
      setPacientes(data);
    } catch { setError('Error cargando pacientes'); }
  };

 const fetchInventario = async () => {
  try {
    const r = await api.get<{ ID_PRODUCTO: number; NOMBRE: string; STOCK: number }[]>('/api/productos', { headers: { Authorization: `Bearer ${token}` } });
    const data: Inventario[] = r.data.map(p => ({
      id: p.ID_PRODUCTO,
      nombre: p.NOMBRE,
      cantidad: p.STOCK // ahora sí tomamos STOCK
    }));
    setInventario(data);
  } catch {
    setError('Error cargando inventario');
  }
};

  /*fetch empleados*/
  const fetchEmpleados = async () => { 
  try {
    const r = await api.get<{ ID_PERSONAL: number; NOMBRES: string; APELLIDOS: string; CARGO: string; ESPECIALIDAD?: string; TELEFONO?: string; EMAIL?: string }[]>('/api/empleados', { headers: { Authorization: `Bearer ${token}` } });
    const data: Empleado[] = r.data.map(e => ({
      id: e.ID_PERSONAL,
      nombre: e.NOMBRES,
      puesto: e.CARGO,
      apellidos: e.APELLIDOS,
      especialidad: e.ESPECIALIDAD || '',
      telefono: e.TELEFONO || '',
      email: e.EMAIL || ''
    }));
    setEmpleados(data);
  } catch {
    setError('Error cargando empleados');
  }
};

  /*fetch habitaciones */
  const fetchHabitaciones = async () => {
    try {
      const r = await api.get<{ ID_HABITACION: number; NUMERO: string; TIPO: string; ESTADO: string }[]>('/api/habitaciones', { headers: { Authorization: `Bearer ${token}` } });
      const data: Habitacion[] = r.data.map(h => ({ id: h.ID_HABITACION, numero: h.NUMERO, tipo: h.TIPO, estado: h.ESTADO }));
      setHabitaciones(data);
    } catch { setError('Error cargando habitaciones'); }
  };

  // --- HELPERS ---


  const deleteItem = async <T extends { id: number }>(endpoint: string, id: number, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    try { await api.delete(`${endpoint}/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setter(prev => prev.filter(item => item.id !== id)); }
    catch(err){ console.error(err); }
  };

  // --- CRUD PACIENTES ---
  const limpiarPaciente = ()=>{
    setPId(null); setPDpi(''); setPNombre(''); setPApellidos('');
    setPFechaNac(''); setPGenero('M'); setPDireccion(''); setPTelefono(''); setPEmail('');
  };
  const createOrUpdatePaciente = async()=>{
    if(!pNombre||!pApellidos||!pFechaNac) return alert("Completa los campos requeridos");
    try{
      const body = { DPI:pDpi,NOMBRES:pNombre,APELLIDOS:pApellidos,FECHA_NAC:pFechaNac,SEXO:pGenero,DIRECCION:pDireccion,TELEFONO:pTelefono,EMAIL:pEmail,ID_SUCURSAL:1 };
      if(pId){ await api.put(`/api/pacientes/${pId}`, body,{headers:{Authorization:`Bearer ${token}`}}); alert('Paciente actualizado'); }
      else { await api.post(`/api/pacientes`, body,{headers:{Authorization:`Bearer ${token}`}}); alert('Paciente creado'); }
      limpiarPaciente(); fetchPacientes();
    } catch { alert('Error al guardar paciente'); }
  };

  // --- CRUD INVENTARIO ---
  const limpiarInventario=()=>{setIId(null); setINombre(''); setICantidad('');};
 const createOrUpdateInventario = async () => {
  if(!iNombre || iCantidad === '') return alert("Completa todos los campos");
  try{
    const body = {
      NOMBRE: iNombre,
      STOCK: Number(iCantidad), // enviamos STOCK a la DB
    };
    if(iId){
      await api.put(`/api/productos/${iId}`, body, { headers: { Authorization: `Bearer ${token}` } });
      alert('Producto actualizado');
    } else {
      await api.post(`/api/productos`, body, { headers: { Authorization: `Bearer ${token}` } });
      alert('Producto creado');
    }
    limpiarInventario();
    fetchInventario();
  } catch {
    alert('Error al guardar producto');
  }
};


  // --- CRUD EMPLEADOS ---
  const limpiarEmpleado=()=>{setEId(null); setENombre(''); setEPuesto('');};
const createOrUpdateEmpleado = async () => {
  if (!eNombre || !ePuesto) return alert("Completa los campos");

  const body = {
    NOMBRES: eNombre,
    APELLIDOS: eApellidos,
    CARGO: ePuesto,
    ESPECIALIDAD: eEspecialidad,
    TELEFONO: eTelefono,
    EMAIL: eEmail,
    ID_SUCURSAL: 1
  };

  try {
    if (eId) {
      await api.put(`/api/empleados/${eId}`, body, { headers: { Authorization: `Bearer ${token}` } });
      alert('Empleado actualizado');
    } else {
      await api.post(`/api/empleados`, body, { headers: { Authorization: `Bearer ${token}` } });
      alert('Empleado creado');
    }
    limpiarEmpleado();
    fetchEmpleados();
  } catch {
    alert('Error al guardar empleado');
  }
};




 // Habitaciones predefinidas (quemadas)
const habitacionesDisponibles = [
  { id: 1, numero: '101' },
  { id: 2, numero: '102' },
  { id: 3, numero: '103' },
];

// Limpiar formulario
const limpiarHabitacion = () => {
  setHId(null);
  setHNumero('');
  setHEstado('');
};

// Crear o actualizar habitación
const createOrUpdateHabitacion = async () => {
  if (!hId || !hEstado) return alert("Selecciona habitación y estado");

  const estadoNormalizado = hEstado.charAt(0).toUpperCase() + hEstado.slice(1).toLowerCase();
  const body = { NUMERO: hNumero, ESTADO: estadoNormalizado, ID_SUCURSAL: 1 };

  try {
    const existe = habitaciones.find(h => h.id === hId);
    if (existe) {
      await api.put(`/api/habitaciones/${hId}`, body, { headers: { Authorization: `Bearer ${token}` } });
      alert('Habitación actualizada');
    } else {
      await api.post(`/api/habitaciones`, body, { headers: { Authorization: `Bearer ${token}` } });
      alert('Habitación creada');
    }

    limpiarHabitacion();
    fetchHabitaciones(); // refresca la tabla para todos los usuarios
  } catch {
    alert('Error al guardar habitación');
  }
};

// Fetch de habitaciones con refresco automático
useEffect(() => {
  fetchHabitaciones(); // carga inicial
  const interval = setInterval(fetchHabitaciones, 5000); // refresco cada 5s
  return () => clearInterval(interval);
}, []);



  // --- CRUD HISTORIAL ---
  const limpiarHistorial=()=>{setHisId(null); setHisPacienteId(''); setHisFecha(''); setHisDiagnostico(''); setHisTratamiento(''); setHisNotas('');};
  const createOrUpdateHistorial=async()=>{
    if(!hisPacienteId||!hisDiagnostico) return alert("Completa los campos requeridos");
    try{
      const body = {ID_PACIENTE:hisPacienteId,FECHA:hisFecha,DIAGNOSTICO:hisDiagnostico,TRATAMIENTO:hisTratamiento,NOTAS:hisNotas};
      if(hisId){ await api.put(`/api/historial/${hisId}`, body,{headers:{Authorization:`Bearer ${token}`}}); alert('Historial actualizado'); }
      else { await api.post(`/api/historial`, body,{headers:{Authorization:`Bearer ${token}`}}); alert('Historial creado'); }
      limpiarHistorial(); fetchHistorial();
    } catch { alert('Error al guardar historial'); }
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">MENÚ</h1>
          <nav className="space-y-3">
            {['usuarios','pacientes','inventario','empleados','habitaciones','historial','citas','calendar'].map(v=>(
              <button key={v} className={`text-left w-full p-2 rounded hover:bg-blue-100 ${view===v?'bg-blue-50':''}`} onClick={()=>setView(v as View)}>
                {v.charAt(0).toUpperCase()+v.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={logout} className="bg-red-500 text-white mt-6 px-4 py-2 rounded hover:bg-red-600">Cerrar sesión</button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administrador</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* USUARIOS */}
        {view==='usuarios' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Usuarios</h3>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Usuario</th><th>Rol</th><th>Creado por</th><th>Acciones</th></tr></thead>
              <tbody>
                {users.map(u=>(<tr key={u.id}>
                  <td className="p-2 border">{u.id}</td>
                  <td className="p-2 border">{u.username}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border">{u.created_by ?? 'N/A'}</td>
                  <td className="p-2 border"><button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/users',u.id,setUsers)}>Eliminar</button></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        )}

        {/* PACIENTES */}
        {view==='pacientes' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input value={pDpi} onChange={e=>setPDpi(e.target.value)} placeholder="DPI" className="p-2 border rounded"/>
              <input value={pNombre} onChange={e=>setPNombre(e.target.value)} placeholder="Nombres" className="p-2 border rounded"/>
              <input value={pApellidos} onChange={e=>setPApellidos(e.target.value)} placeholder="Apellidos" className="p-2 border rounded"/>
              <input type="date" value={pFechaNac} onChange={e=>setPFechaNac(e.target.value)} className="p-2 border rounded"/>
              <select value={pGenero} onChange={e=>setPGenero(e.target.value)} className="p-2 border rounded">
                <option value="M">Masculino</option><option value="F">Femenino</option>
              </select>
              <input value={pDireccion} onChange={e=>setPDireccion(e.target.value)} placeholder="Dirección" className="p-2 border rounded"/>
              <input value={pTelefono} onChange={e=>setPTelefono(e.target.value)} placeholder="Teléfono" className="p-2 border rounded"/>
              <input value={pEmail} onChange={e=>setPEmail(e.target.value)} placeholder="Correo" className="p-2 border rounded"/>
            </div>
            <div className="space-x-2 mb-4">
              <button onClick={createOrUpdatePaciente} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{pId?'Actualizar':'Crear'}</button>
              <button onClick={limpiarPaciente} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Limpiar</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>DPI</th><th>Nombre</th><th>Apellidos</th><th>Edad</th><th>Género</th><th>Acciones</th></tr></thead>
              <tbody>
                {pacientes.map(p=>(
                  <tr key={p.id}>
                    <td className="p-2 border">{p.id}</td>
                    <td className="p-2 border">{p.dpi}</td>
                    <td className="p-2 border">{p.nombres}</td>
                    <td className="p-2 border">{p.apellidos}</td>
                    <td className="p-2 border">{calcularEdad(p.fechaNacimiento)}</td>
                    <td className="p-2 border">{p.genero}</td>
                    <td className="p-2 border space-x-2">
                      <button onClick={()=>{
                        setPId(p.id); setPDpi(p.dpi||''); setPNombre(p.nombres); setPApellidos(p.apellidos);
                        setPFechaNac(formatDateForInput(p.fechaNacimiento));
                        setPGenero(p.genero); setPDireccion(p.direccion||'');
                        setPTelefono(p.telefono||''); setPEmail(p.email||'');
                      }} className="text-blue-500 hover:underline">Editar</button>
                      <button onClick={()=>deleteItem('/api/pacientes',p.id,setPacientes)} className="text-red-500 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inventario */}
{view==='inventario' && (
  <div className="bg-white p-6 rounded shadow-md mb-6">
    <h3 className="text-lg font-semibold mb-4">Inventario</h3>
    <div className="flex gap-2 mb-4">
      <input value={iNombre} onChange={e=>setINombre(e.target.value)} placeholder="Nombre" className="p-2 border rounded"/>
      <input
        type="number"
        value={iCantidad}
        onChange={e=>setICantidad(e.target.value)}
        placeholder="Cantidad"
        className="p-2 border rounded"
      />
      <button onClick={createOrUpdateInventario} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{iId?'Actualizar':'Crear'}</button>
      <button onClick={limpiarInventario} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Limpiar</button>
    </div>
    <table className="w-full border text-left">
      <thead>
        <tr className="bg-gray-200"><th>ID</th><th>Nombre</th><th>Cantidad</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        {inventario.map(i=>(
          <tr key={i.id}>
            <td className="p-2 border">{i.id}</td>
            <td className="p-2 border">{i.nombre}</td>
            <td className="p-2 border">{i.cantidad}</td>
            <td className="p-2 border space-x-2">
              <button
                onClick={()=>{
                  setIId(i.id);
                  setINombre(i.nombre);
                  setICantidad(i.cantidad.toString()); // Convertimos a string para el input
                }}
                className="text-blue-500 hover:underline"
              >Editar</button>
              <button onClick={()=>deleteItem('/api/productos',i.id,setInventario)} className="text-red-500 hover:underline">Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


       {/* EMPLEADOS */}
{view === 'empleados' && (
  <div className="bg-white p-6 rounded shadow-md mb-6">
    <h3 className="text-lg font-semibold mb-4">Empleados</h3>
    
    {/* Formulario */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
      <input
        value={eNombre}
        onChange={e => setENombre(e.target.value)}
        placeholder="Nombre"
        className="p-2 border rounded"
      />
      <input
        value={eApellidos}
        onChange={e => setEApellidos(e.target.value)}
        placeholder="Apellidos"
        className="p-2 border rounded"
      />
      <select
        value={ePuesto}
        onChange={e => setEPuesto(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Seleccione un puesto</option>
        <option value="Medico">Medico</option>
        <option value="Recepcionista">Recepcionista</option>
        <option value="Doctor">Doctor</option>
        <option value="Enfermero">Enfermero</option>
        <option value="Administrador">Administrador</option>
      </select>
      <input
        value={eEspecialidad}
        onChange={e => setEEspecialidad(e.target.value)}
        placeholder="Especialidad"
        className="p-2 border rounded"
      />
      <input
        value={eTelefono}
        onChange={e => setETelefono(e.target.value)}
        placeholder="Teléfono"
        className="p-2 border rounded"
      />
      <input
        value={eEmail}
        onChange={e => setEEmail(e.target.value)}
        placeholder="Correo"
        className="p-2 border rounded"
      />
    </div>

    <div className="space-x-2 mb-4">
      <button
        onClick={createOrUpdateEmpleado}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {eId ? 'Actualizar' : 'Crear'}
      </button>
      <button
        onClick={limpiarEmpleado}
        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Limpiar
      </button>
    </div>

    {/* Tabla */}
    <table className="w-full border text-left">
      <thead>
        <tr className="bg-gray-200">
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Puesto</th>
          <th>Especialidad</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {empleados.map(e => (
          <tr key={e.id}>
            <td className="p-2 border">{e.id}</td>
            <td className="p-2 border">{e.nombre}</td>
            <td className="p-2 border">{e.apellidos}</td>
            <td className="p-2 border">{e.puesto}</td>
            <td className="p-2 border">{e.especialidad}</td>
            <td className="p-2 border">{e.telefono}</td>
            <td className="p-2 border">{e.email}</td>
            <td className="p-2 border space-x-2">
              <button
                onClick={() => {
                  setEId(e.id);
                  setENombre(e.nombre);
                  setEApellidos(e.apellidos);
                  setEPuesto(e.puesto);
                  setEEspecialidad(e.especialidad || '');
                  setETelefono(e.telefono || '');
                  setEEmail(e.email || '');
                }}
                className="text-blue-500 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => deleteItem('/api/empleados', e.id, setEmpleados)}
                className="text-red-500 hover:underline"
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

{/* HABITACIONES */}
{view === 'habitaciones' && (
  <div className="bg-white p-6 rounded shadow-md mb-6">
    <h3 className="text-lg font-semibold mb-4">Habitaciones</h3>

    <div className="flex gap-2 mb-4">
      {/* Dropdown de habitaciones predefinidas */}
      <select
        value={hId || ''}
        onChange={e => {
          const selected = habitacionesDisponibles.find(h => h.id === Number(e.target.value));
          if (selected) {
            setHId(selected.id);
            setHNumero(selected.numero);
            const habitacionEstado = habitaciones.find(h => h.id === selected.id)?.estado || 'Libre';
            setHEstado(habitacionEstado);
          }
        }}
        className="p-2 border rounded"
      >
        <option value="">Selecciona una habitación</option>
        {habitacionesDisponibles.map(h => (
          <option key={h.id} value={h.id}>
            {h.numero}
          </option>
        ))}
      </select>

      {/* Dropdown de estado */}
      <select
        value={hEstado || ''}
        onChange={e => setHEstado(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Selecciona Estado</option>
        <option value="Libre">Libre</option>
        <option value="Ocupada">Ocupada</option>
      </select>

      <button
        onClick={createOrUpdateHabitacion}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {hId ? 'Actualizar' : 'Crear'}
      </button>

      <button
        onClick={limpiarHabitacion}
        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Limpiar
      </button>
    </div>

    {/* Tabla de habitaciones */}
    <table className="w-full border text-left">
      <thead>
        <tr className="bg-gray-200">
          <th>ID</th>
          <th>Número</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {habitaciones.map(h => (
          <tr key={h.id}>
            <td className="p-2 border">{h.id}</td>
            <td className="p-2 border">{h.numero}</td>
            <td className="p-2 border">
              {h.estado.charAt(0).toUpperCase() + h.estado.slice(1).toLowerCase()}
            </td>
            <td className="p-2 border space-x-2">
              <button
                onClick={() => { setHId(h.id); setHNumero(h.numero); setHEstado(h.estado); }}
                className="text-blue-500 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => deleteItem('/api/habitaciones', h.id, setHabitaciones)}
                className="text-red-500 hover:underline"
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


        {/* HISTORIAL */}
        {view==='historial' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Historial Clínico</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select value={hisPacienteId} onChange={e=>setHisPacienteId(e.target.value)} className="p-2 border rounded">
                <option value="">Selecciona paciente</option>
                {pacientes.map(p=><option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>)}
              </select>
              <input type="date" value={hisFecha} onChange={e=>setHisFecha(e.target.value)} className="p-2 border rounded"/>
              <input value={hisDiagnostico} onChange={e=>setHisDiagnostico(e.target.value)} placeholder="Diagnóstico" className="p-2 border rounded"/>
              <input value={hisTratamiento} onChange={e=>setHisTratamiento(e.target.value)} placeholder="Tratamiento" className="p-2 border rounded"/>
              <input value={hisNotas} onChange={e=>setHisNotas(e.target.value)} placeholder="Notas" className="p-2 border rounded"/>
            </div>
            <div className="space-x-2 mb-4">
              <button onClick={createOrUpdateHistorial} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{hisId?'Actualizar':'Crear'}</button>
              <button onClick={limpiarHistorial} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Limpiar</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Paciente</th><th>Fecha</th><th>Diagnóstico</th><th>Tratamiento</th><th>Notas</th><th>Acciones</th></tr></thead>
              <tbody>
                {historial.map(h=>(
                  <tr key={h.id}>
                    <td className="p-2 border">{h.id}</td>
                    <td className="p-2 border">{pacientes.find(p=>p.id===h.pacienteId)?.nombres ?? ''} {pacientes.find(p=>p.id===h.pacienteId)?.apellidos ?? ''}</td>
                    <td className="p-2 border">{h.fecha}</td>
                    <td className="p-2 border">{h.diagnostico}</td>
                    <td className="p-2 border">{h.tratamiento}</td>
                    <td className="p-2 border">{h.notas}</td>
                    <td className="p-2 border space-x-2">
                      <button onClick={()=>{
                        setHisId(h.id); setHisPacienteId(String(h.pacienteId)); setHisFecha(h.fecha); setHisDiagnostico(h.diagnostico); setHisTratamiento(h.tratamiento); setHisNotas(h.notas);
                      }} className="text-blue-500 hover:underline">Editar</button>
                      <button onClick={()=>deleteItem('/api/historial',h.id,setHistorial)} className="text-red-500 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Citas */}
        {view==='citas' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Citas</h3>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Motivo</th></tr></thead>
              <tbody>
                {citas.map(c=>(
                  <tr key={c.id}>
                    <td className="p-2 border">{c.id}</td>
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

        {/* Calendar placeholder */}
        {view==='calendar' && <div className="bg-white p-6 rounded shadow-md">Calendario (pendiente de implementación)</div>}

      </main>
    </div>
  );
};

export default AdminPanel;
