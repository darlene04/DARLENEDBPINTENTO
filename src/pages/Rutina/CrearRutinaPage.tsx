import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Save, Dumbbell } from "lucide-react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Menu } from "lucide-react";

interface Ejercicio {
  nombre: string;
  descripcion: string;
  series: number;
  repeticiones: number;
  descansoSegundos: number;
  pesoKg: number;
}

const CrearRutinaPage: React.FC = () => {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [nombreRutina, setNombreRutina] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [frecuencia, setFrecuencia] = useState("3 veces por semana");
  const [nivel, setNivel] = useState("principiante");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [nuevoEjercicio, setNuevoEjercicio] = useState<Ejercicio>({
    nombre: "",
    descripcion: "",
    series: 0,
    repeticiones: 0,
    descansoSegundos: 60,
    pesoKg: 0,
  });

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);

  const handleAgregarEjercicio = () => {
    if (!nuevoEjercicio.nombre || !nuevoEjercicio.descripcion) return;
    setEjercicios([...ejercicios, nuevoEjercicio]);
    setNuevoEjercicio({
      nombre: "",
      descripcion: "",
      series: 0,
      repeticiones: 0,
      descansoSegundos: 60,
      pesoKg: 0,
    });
  };

  const handleGuardarRutina = async () => {
    try {
      // Paso 1: Crear ejercicios
      const ejercicioResponses = await Promise.all(
        ejercicios.map((ej) =>
          axios.post(`${import.meta.env.VITE_API_URL}/api/ejercicios`, ej)
        )
      );
      const ejercicioIds = ejercicioResponses.map((res) => res.data.id);

      // Paso 2: Crear rutina
      await axios.post(`${import.meta.env.VITE_API_URL}/api/publicaciones/rutinas`, {
        titulo,
        contenido,
        nombreRutina,
        duracion,
        frecuencia,
        nivel: nivel.toUpperCase(),
        ejercicioIds,
      },
      {
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );

      navigate("/rutinas");
    } catch (err:any) {
      console.error("Error al guardar rutina:", err);
      console.log("Respuesta del servidor:", err.response?.data);
      alert("Ocurrió un error al guardar la rutina.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-start px-4 py-4">
            <button
                onClick={() => setIsSidebarOpen(true)}
                  className="text-gray-700 hover:text-violet-600 focus:outline-none p-2"
                >
                <Menu className="w-5 h-5" />
            </button>
        </div>
        
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md mt-8 border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Dumbbell className="w-6 h-6 text-violet-600" />
        Crear nueva rutina
      </h1>

      {/* Datos de rutina */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          className="border px-4 py-2 rounded-lg"
        />
        <input
          value={nombreRutina}
          onChange={(e) => setNombreRutina(e.target.value)}
          placeholder="Nombre de rutina"
          className="border px-4 py-2 rounded-lg"
        />
        <input
          type="number"
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
          placeholder="Duración (min)"
          className="border px-4 py-2 rounded-lg"
        />
        <input
          value={frecuencia}
          onChange={(e) => setFrecuencia(e.target.value)}
          placeholder="Frecuencia (ej. 4 veces por semana)"
          className="border px-4 py-2 rounded-lg"
        />
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Descripción general de la rutina"
          className="border px-4 py-2 rounded-lg col-span-1 md:col-span-2"
        />
      </div>

      {/* Crear ejercicios */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar ejercicio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={nuevoEjercicio.nombre}
            onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, nombre: e.target.value })}
            placeholder="Nombre"
            className="border px-3 py-2 rounded-lg"
          />
          <input
            value={nuevoEjercicio.descripcion}
            onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, descripcion: e.target.value })}
            placeholder="Descripción"
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            value={nuevoEjercicio.series}
            onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, series: Number(e.target.value) })}
            placeholder="Series"
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            value={nuevoEjercicio.repeticiones}
            onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, repeticiones: Number(e.target.value) })}
            placeholder="Repeticiones"
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            value={nuevoEjercicio.descansoSegundos}
            onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, descansoSegundos: Number(e.target.value) })}
            placeholder="Descanso (s)"
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            value={nuevoEjercicio.pesoKg}
            onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, pesoKg: Number(e.target.value) })}
            placeholder="Peso (kg)"
            className="border px-3 py-2 rounded-lg"
          />
        </div>
        <button
          onClick={handleAgregarEjercicio}
          className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar ejercicio
        </button>
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-4 mb-6">
        {ejercicios.map((ej, i) => (
          <div key={i} className="bg-white p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">{ej.nombre}</h3>
            <p className="text-sm text-gray-600">{ej.descripcion}</p>
            <div className="text-sm text-gray-700 mt-2">
              <span>Series: {ej.series}, </span>
              <span>Reps: {ej.repeticiones}, </span>
              <span>Descanso: {ej.descansoSegundos}s, </span>
              <span>Peso: {ej.pesoKg}kg</span>
            </div>
          </div>
        ))}
      </div>

      {/* Guardar rutina */}
      <button
        onClick={handleGuardarRutina}
        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Guardar rutina
      </button>
    </div>
    </div>
  );
};

export default CrearRutinaPage;
