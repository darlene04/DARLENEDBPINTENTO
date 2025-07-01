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
  imagen?: File | null;
}

const CrearRutinaPage: React.FC = () => {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [nombreRutina, setNombreRutina] = useState("");
  const [duracion, setDuracion] = useState<number | undefined>(undefined);
  const [frecuencia, setFrecuencia] = useState("");
  const [nivel, setNivel] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [nuevoEjercicio, setNuevoEjercicio] = useState<Ejercicio>({
    nombre: "",
    descripcion: "",
    series: 0,
    repeticiones: 0,
    descansoSegundos: 60,
    pesoKg: 0,
    imagen: null,
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
      imagen: null,
    });
  };

  const handleGuardarRutina = async () => {
    try {
      const ejercicioResponses = await Promise.all(
        ejercicios.map(async (ej) => {
          const form = new FormData();

          form.append(
            "datos",
            new Blob([
              JSON.stringify({
                nombre: ej.nombre,
                descripcion: ej.descripcion,
                series: ej.series,
                repeticiones: ej.repeticiones,
                descansoSegundos: ej.descansoSegundos,
                pesoKg: ej.pesoKg,
              }),
            ], { type: "application/json" })
          );

          if (ej.imagen) {
            form.append("imagen", ej.imagen);
          }

          return axios.post(
            `${import.meta.env.VITE_API_URL}/api/ejercicios`,
            form,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        })
      );

      const ejercicioIds = ejercicioResponses.map((res) => res.data.id);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/publicaciones/rutinas`,
        {
          titulo,
          descripcion: contenido,
          nombreRutina,
          duracion,
          frecuencia,
          dificultad: nivel.toLowerCase(),
          objetivo,   
          ejercicioIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/rutinas");
    } catch (err: any) {
      console.error("Error al guardar rutina:", err);
      alert(err.response?.data?.message || "Ocurrió un error al guardar la rutina.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />

      {/* Hamburguesa */}
      <div className="flex items-center justify-start px-4 py-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md mt-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Dumbbell className="w-6 h-6 text-green-600" />
          Crear nueva rutina
        </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Título</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Nombre de rutina</label>
          <input
            value={nombreRutina}
            onChange={(e) => setNombreRutina(e.target.value)}
            placeholder="Nombre de rutina"
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Duración (min)</label>
          <input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
            placeholder="Duración (min)"
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Frecuencia</label>
          <input
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
            placeholder="Frecuencia (ej. 4 veces por semana)"
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col">
  <label className="text-sm text-gray-600 mb-1">Objetivo</label>
  <select
    value={objetivo}
    onChange={(e) => setObjetivo(e.target.value)}
    className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="" disabled>-- Selecciona un objetivo --</option>
    <option value="Pérdida de grasa corporal">Pérdida de grasa corporal</option>
    <option value="Subir masa muscular">Subir masa muscular</option>
    <option value="Mantener peso">Mantener peso</option>
    <option value="Salud general">Salud general</option>
  </select>
</div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Nivel</label>
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>-- Selecciona un nivel --</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm text-gray-600 mb-1">Descripción general</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Descripción general de la rutina"
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

        {/* Crear ejercicios */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar ejercicio</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nombre */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Nombre</label>
              <input
                value={nuevoEjercicio.nombre}
                onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, nombre: e.target.value })}
                placeholder="Nombre"
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Descripción</label>
              <input
                value={nuevoEjercicio.descripcion}
                onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, descripcion: e.target.value })}
                placeholder="Descripción"
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Series</label>
              <input
                type="number"
                value={nuevoEjercicio.series}
                onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, series: Number(e.target.value) })}
                placeholder="Series"
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Repeticiones</label>
              <input
                type="number"
                value={nuevoEjercicio.repeticiones}
                onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, repeticiones: Number(e.target.value) })}
                placeholder="Repeticiones"
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Descanso (s)</label>
              <input
                type="number"
                value={nuevoEjercicio.descansoSegundos}
                onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, descansoSegundos: Number(e.target.value) })}
                placeholder="Descanso (s)"
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Peso (kg)</label>
              <input
                type="number"
                value={nuevoEjercicio.pesoKg}
                onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, pesoKg: Number(e.target.value) })}
                placeholder="Peso (kg)"
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col md:col-span-3">
              <label className="text-sm text-gray-600 mb-1">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, imagen: e.target.files?.[0] || null })}
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            onClick={handleAgregarEjercicio}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Agregar ejercicio
          </button>
        </div>

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
      
        <button
          onClick={handleGuardarRutina}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
        >
          <Save className="w-4 h-4" />
          Guardar rutina
        </button>
      </div>
    </div>
  );
};

export default CrearRutinaPage;