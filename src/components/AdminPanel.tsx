import React, { useEffect, useState } from 'react';
import { api } from '../Api';
import { useAuth } from '../AuthContext';
//import CalendarView from './CalendarView';

interface User { id: number; username: string; role: string; created_by: number | null; }
interface Paciente { id: number; nombre: string; edad: number; genero: string; direccion?: string; telefono?: string; email?: string; }
/* interface Inventario { id: number; nombre: string; cantidad: number; }
interface Empleado { id: number; nombre: string; puesto: string; }
interface Habitacion { id: number; numero: string; tipo: string; }
interface Historial { id: number; pacienteId: number; fecha: string; diagnostico: string; tratamiento: string; notas: string; } */
interface Cita { id: number; paciente: string; fecha: string; hora: string; motivo: string; }

const ROLES: Array<'admin' | 'recepcionista' | 'medico' | 'enfermero'> = ['admin','recepcionista','medico','enfermero'];
type View = 'usuarios'|'pacientes'|'inventario'|'empleados'|'habitaciones'|'historial'|'citas'|'calendar';

const AdminPanel: React.FC = () => {
  const { token, logout } = useAuth();
  const [view, setView] = useState<View>('usuarios');
  const [error, setError] = useState('');

  // --- Estados CRUD ---
  const [users, setUsers] = useState<User[]>([]);
  const [nuser, setNuser] = useState(''); 
  const [npass, setNpass] = useState(''); 
  const [nrole, setNrole] = useState<typeof ROLES[number]>('recepcionista');

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pDpi, setPDpi] = useState('');
  const [pNombre, setPNombre] = useState('');
  const [pApellidos, setPApellidos] = useState('');
  const [pFechaNac, setPFechaNac] = useState('');
  const [pGenero, setPGenero] = useState('M');
  const [pDireccion, setPDireccion] = useState('');
  const [pTelefono, setPTelefono] = useState('');
  const [pEmail, setPEmail] = useState('');

  /* const [inventario, setInventario] = useState<Inventario[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [historial, setHistorial] = useState<Historial[]>([]); */
  const [citas, setCitas] = useState<Cita[]>([]);

  // ------------------ FETCH ------------------
  useEffect(() => {
    if(token){
      fetchUsers(); 
      fetchPacientes(); 
      fetchCitas();
      /* fetchInventario();
      fetchEmpleados();
      fetchHabitaciones();
      fetchHistorial(); */
    }
  }, [token]);

  const fetchUsers = async()=>{ try{ const r = await api.get('/api/users',{headers:{Authorization:`Bearer ${token}`}}); setUsers(r.data);}catch(e){setError('Error usuarios');}};
  
  const fetchPacientes = async()=>{ 
    try{
      const r = await api.get('/api/pacientes',{headers:{Authorization:`Bearer ${token}`}}); 
      const data = r.data.map((p:any)=>({
        id: p.ID_PACIENTE,
        nombre: `${p.NOMBRES} ${p.APELLIDOS}`,
        edad: calcularEdad(p.FECHA_NAC),
        genero: p.SEXO,
        direccion: p.DIRECCION,
        telefono: p.TELEFONO,
        email: p.EMAIL
      }));
      setPacientes(data);
    }catch(e){setError('Error pacientes');}
  };

  const fetchCitas = async()=>{
    try{
      const r = await api.get('/api/citas',{headers:{Authorization:`Bearer ${token}`}});
      const data = r.data.map((c:any)=>({
        id: c.ID_CITA,
        paciente: c.PACIENTE,
        fecha: c.FECHA,
        hora: c.HORA,
        motivo: c.MOTIVO
      }));
      setCitas(data);
    }catch(e){setError('Error citas');}
  };

/*   const fetchInventario = async()=>{
    try{
      const r = await api.get('/api/inventario',{headers:{Authorization:`Bearer ${token}`}});
      setInventario(r.data);
    }catch(e){setError('Error inventario');}
  };

  const fetchEmpleados = async()=>{
    try{
      const r = await api.get('/api/empleados',{headers:{Authorization:`Bearer ${token}`}});
      setEmpleados(r.data);
    }catch(e){setError('Error empleados');}
  };

  const fetchHabitaciones = async()=>{
    try{
      const r = await api.get('/api/habitaciones',{headers:{Authorization:`Bearer ${token}`}});
      setHabitaciones(r.data);
    }catch(e){setError('Error habitaciones');}
  };

  const fetchHistorial = async()=>{
    try{
      const r = await api.get('/api/historial',{headers:{Authorization:`Bearer ${token}`}});
      setHistorial(r.data);
    }catch(e){setError('Error historial');}
  }; */

  // ------------------ HELPERS ------------------
  const calcularEdad = (fecha: string) => {
    if(!fecha) return 0;
    const nac = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  };

  // ------------------ CREATE ------------------
  const createUser = async()=>{
    try{
      await api.post('/api/users',{username:nuser,password:npass,role:nrole},{headers:{Authorization:`Bearer ${token}`}}); 
      setNuser(''); setNpass(''); fetchUsers();
    }catch(e){setError('Error crear usuario');}
  };

  const createPaciente = async()=>{
    if(!pDpi || !pNombre || !pApellidos || !pFechaNac) return alert("Completa los campos requeridos");
    try{
      await api.post('/api/pacientes',{
        DPI:pDpi, NOMBRES:pNombre, APELLIDOS:pApellidos, FECHA_NAC:pFechaNac, SEXO:pGenero, DIRECCION:pDireccion, TELEFONO:pTelefono, EMAIL:pEmail, ID_SUCURSAL:1
      },{headers:{Authorization:`Bearer ${token}`}});
      alert('Paciente creado correctamente');
      setPDpi(''); setPNombre(''); setPApellidos(''); setPFechaNac('');
      setPGenero('M'); setPDireccion(''); setPTelefono(''); setPEmail('');
      fetchPacientes();
    }catch(e){alert('Error creando paciente');}
  };

  // ------------------ DELETE ------------------
  const deleteItem = async(endpoint:string,id:number,setter:Function)=>{
    try{
      await api.delete(`${endpoint}/${id}`,{headers:{Authorization:`Bearer ${token}`}});
      setter((prev:any)=>prev.filter((i:any)=>i.id!==id));
    }catch(err){console.error(err);}
  };

  // ------------------ RENDER ------------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6">MENÚ</h1>
          <nav className="space-y-3">
            {[
              {v:'usuarios',t:'Usuarios'},
              {v:'pacientes',t:'Pacientes'},
              {v:'inventario',t:'Inventario'},
              {v:'empleados',t:'Empleados'},
              {v:'habitaciones',t:'Habitaciones'},
              {v:'historial',t:'Historial Clínico'},
              {v:'citas',t:'Citas Agendadas'},
              {v:'calendar',t:'Calendario'}
            ].map(({v,t})=>(
              <button key={v} className={`text-left w-full p-2 rounded hover:bg-blue-100 ${view===v?'bg-blue-50':''}`} onClick={()=>setView(v as View)}>
                {t}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={logout} className="bg-red-500 text-white mt-6 px-4 py-2 rounded hover:bg-red-600">
          Cerrar sesión
        </button>
      </aside>

      {/* Main */}
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
              <select value={nrole} onChange={e=>setNrole(e.target.value as typeof ROLES[number])} className="p-2 border rounded">
                {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
              <button onClick={createUser} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Crear</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Usuario</th><th>Rol</th><th>Creado por</th><th>Acciones</th></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.id}>
                    <td className="p-2 border">{u.id}</td>
                    <td className="p-2 border">{u.username}</td>
                    <td className="p-2 border">{u.role}</td>
                    <td className="p-2 border">{u.created_by ?? 'N/A'}</td>
                    <td className="p-2 border">
                      <button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/users',u.id,setUsers)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Pacientes --- */}
        {view==='pacientes' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input value={pDpi} onChange={e=>setPDpi(e.target.value)} placeholder="DPI" className="p-2 border rounded"/>
              <input value={pNombre} onChange={e=>setPNombre(e.target.value)} placeholder="Nombres" className="p-2 border rounded"/>
              <input value={pApellidos} onChange={e=>setPApellidos(e.target.value)} placeholder="Apellidos" className="p-2 border rounded"/>
              <input type="date" value={pFechaNac} onChange={e=>setPFechaNac(e.target.value)} className="p-2 border rounded"/>
              <select value={pGenero} onChange={e=>setPGenero(e.target.value)} className="p-2 border rounded">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
              <input value={pDireccion} onChange={e=>setPDireccion(e.target.value)} placeholder="Dirección" className="p-2 border rounded"/>
              <input value={pTelefono} onChange={e=>setPTelefono(e.target.value)} placeholder="Teléfono" className="p-2 border rounded"/>
              <input value={pEmail} onChange={e=>setPEmail(e.target.value)} placeholder="Correo" className="p-2 border rounded"/>
              <button onClick={createPaciente} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 col-span-full">Crear</button>
            </div>
            <table className="w-full border text-left">
              <thead><tr className="bg-gray-200"><th>ID</th><th>Nombre</th><th>Edad</th><th>Género</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr></thead>
              <tbody>
                {pacientes.map(p=>(
                  <tr key={p.id}>
                    <td className="p-2 border">{p.id}</td>
                    <td className="p-2 border">{p.nombre}</td>
                    <td className="p-2 border">{p.edad}</td>
                    <td className="p-2 border">{p.genero}</td>
                    <td className="p-2 border">{p.telefono}</td>
                    <td className="p-2 border">{p.email}</td>
                    <td className="p-2 border">
                      <button className="text-red-500 hover:text-red-700" onClick={()=>deleteItem('/api/pacientes',p.id,setPacientes)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Citas --- */}
        {view==='citas' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Citas Agendadas</h3>
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

        {/* --- Calendario --- */}
        {view==='calendar' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            {/* <CalendarView citas={citas}/> */}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
