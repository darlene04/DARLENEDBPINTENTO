import React, { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Plus,
  Edit3,
  Calendar,
  Weight,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { getUserInfo } from "../service/authService";
import { useAuth } from "../context/AuthContext";

const mockProgress = {
  currentWeight: 68,
  goalWeight: 65,
  lastUpdated: "2024-06-28",
};
const mockPublications = [
  {
    id: 1,
    title: "Mi primer mes de progreso",
    content:
      "He logrado perder 2kg este mes siguiendo una rutina constante de ejercicio y alimentación saludable.",
    author: "Ana García",
    createdAt: "2024-06-25",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [progress, setProgress] = useState(mockProgress);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const [publications, setPublications] = useState<
    {
      id: number;
      title: string;
      content: string;
      author: string;
      createdAt: string;
      ejercicios?: {
        id: number;
        nombre: string;
        descripcion: string;
        series: number;
        repeticiones: number;
        pesoKg: number;
        descansoSegundos: number;
        imagenUrl?: string;
      }[];
    }[]
  >(mockPublications);

  const [otrasPublicaciones, setOtrasPublicaciones] = useState<any[]>([]);
  const [misGrupos, setMisGrupos] = useState<{ id: number; nombre: string }[]>(
    []
  );

  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [publicationType, setPublicationType] =
    useState<"rutina" | "plan" | "normal" | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const progressPercentage = Math.min(
    100,
    (progress.currentWeight / progress.goalWeight) * 100
  );
  const weightToLose = Math.max(0, progress.currentWeight - progress.goalWeight);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserInfo();
        setUser(data);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [token]);

  // Mis publicaciones
  useEffect(() => {
    const fetchMisPublicaciones = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/publicaciones/autor`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const base = res.data;
        const completas = await Promise.all(
          base.map(async (pub: any) => {
            const det = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/publicaciones/${pub.id}`
            );
            return {
              id: pub.id,
              title: pub.titulo,
              content: det.data.contenido ?? "Sin contenido",
              author: pub.autor,
              createdAt: pub.fechaCreacion ?? new Date().toISOString(),
              ejercicios: det.data.ejercicios ?? [],
            };
          })
        );
        setPublications(completas);
      } catch (err) {
        console.error("Error al cargar publicaciones del autor:", err);
      }
    };
    if (token) fetchMisPublicaciones();
  }, [token]);

  // Publicaciones de la comunidad
  useEffect(() => {
    const fetchComunidad = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/publicaciones/rutinas`
        );
        const todas = res.data;
        const filtradas = todas.filter((p: any) => p.userId !== user?.id);
        setOtrasPublicaciones(filtradas);
      } catch (err) {
        console.error("Error al cargar otras publicaciones:", err);
      }
    };
    if (user) fetchComunidad();
  }, [user]);

  // Grupos del usuario
  // Grupos del usuario
useEffect(() => {
  const fetchMisGrupos = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/grupos/mis`,
        {
          params: { userId: user.id },               // ← envía su id
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMisGrupos(data);                            // [{ id, nombre }, …]
    } catch (err) {
      console.error("Error al cargar grupos:", err);
    }
  };
  if (token && user) fetchMisGrupos();               // espera a tener user.id
}, [token, user]);


  const handleProgressSubmit = () => {
    if (newWeight && newGoal) {
      setProgress({
        currentWeight: parseFloat(newWeight),
        goalWeight: parseFloat(newGoal),
        lastUpdated: new Date().toISOString().split("T")[0],
      });
      setNewWeight("");
      setNewGoal("");
      setShowProgressForm(false);
    }
  };

  const handlePublicationSubmit = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const nueva = {
      id: publications.length + 1,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: user?.name ?? "Yo",
      createdAt: new Date().toISOString(),
      ejercicios: [],
    };
    setPublications([nueva, ...publications]);
    setNewTitle("");
    setNewContent("");
    setShowPublicationForm(false);
    setPublicationType(null);
  };

  // Compartir publicación en grupo
  const compartirEnGrupo = async (publicacionId: number, grupoId: number) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/publicacionescompartidas/${publicacionId}/compartir`,
        null,
        {
          params: { grupoId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("¡Publicación compartida correctamente! 🎉");
    } catch (err) {
      console.error("Error al compartir:", err);
      alert("Ocurrió un error al compartir la publicación.");
    }
  };

  const avatar =
    user?.avatar ||
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();

  if (loadingUser)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando…
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        No se pudo cargar la información del usuario.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />

      {/* Botón hamburguesa */}
      <div className="flex items-center px-4 py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ======= COLUMNA IZQUIERDA (2/3) ======= */}
          <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Tu Progreso
                </h2>
                <button
                  onClick={() => setShowProgressForm(!showProgressForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  Actualizar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-5 h-5" />
                    <span className="text-sm opacity-90">Peso Actual</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.currentWeight} kg</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5" />
                    <span className="text-sm opacity-90">Meta</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.goalWeight} kg</p>
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm opacity-90">Por Perder</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {weightToLose.toFixed(1)} kg
                  </p>
                </div>
              </div>

              {/*Barra de progreso */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso hacia tu meta</span>
                  <span>{(100 - progressPercentage).toFixed(1)} % restante</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${100 - progressPercentage}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Última actualización:{" "}
                {new Date(progress.lastUpdated).toLocaleDateString()}
              </p>

              
              {showProgressForm && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Actualizar Progreso
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Peso Actual (kg)
                      </label>
                      <input
                        type="number"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        placeholder="70"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta (kg)
                      </label>
                      <input
                        type="number"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="65"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleProgressSubmit}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setShowProgressForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* -------- PUBLICACIONES DE LA COMUNIDAD -------- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Publicaciones de la comunidad
              </h2>

              {otrasPublicaciones.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No hay publicaciones disponibles.
                </p>
              ) : (
                <div className="space-y-4">
                  {otrasPublicaciones.map((pub) => (
                    <div
                      key={pub.id_publicacion}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {pub.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Rutina: {pub.nombreRutina} – Duración: {pub.duracion}{" "}
                        día(s)
                      </p>

                      {/* EJERCICIOS */}
                      {pub.ejercicios && pub.ejercicios.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <h4 className="text-sm font-semibold text-gray-800">
                            Ejercicios:
                          </h4>
                          {(pub.ejercicios ?? []).map((ej: any) => (
                            <div
                              key={ej.id}
                              className="text-sm border rounded p-2 bg-gray-50"
                            >
                              <p className="font-semibold">{ej.nombre}</p>
                              <p className="text-gray-600">{ej.descripcion}</p>
                              <p className="text-gray-700">
                                {ej.series} series, {ej.repeticiones} reps,{" "}
                                {ej.pesoKg}kg, descanso {ej.descansoSegundos}s
                              </p>
                              {ej.imagenUrl && (
                                <img
                                  src={`${import.meta.env.VITE_API_URL}${ej.imagenUrl}`}
                                  alt={ej.nombre}
                                  className="w-32 mt-2 rounded"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* -------- COMPARTIR EN GRUPO -------- */}
                      <div className="mt-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          defaultValue=""
                          id={`grupo-select-${pub.id_publicacion}`}
                        >
                          <option value="" disabled>
                            Selecciona grupo
                          </option>
                          {misGrupos.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.nombre}
                            </option>
                          ))}
                        </select>

                        <button
                          className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-sm"
                          onClick={() => {
                            const select = document.getElementById(
                              `grupo-select-${pub.id_publicacion}`
                            ) as HTMLSelectElement;
                            const grupoId = Number(select.value);
                            if (!grupoId) {
                              alert("Elige un grupo primero.");
                              return;
                            }
                            compartirEnGrupo(pub.id_publicacion, grupoId);
                          }}
                        >
                          Compartir en grupo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">     
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Mis Publicaciones</h2>
                <button
                  onClick={() => {
                    setShowPublicationForm((prev) => !prev);
                    setPublicationType(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  <Plus className="w-4 h-4" />
                  Nueva
                </button>
              </div>

              
              {showPublicationForm && publicationType === null && (
                <div className="mb-6 flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => navigate("/rutinas/crear")}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Publicar Rutina
                  </button>
                  <button
                    onClick={() => navigate("/planes-alimentacion/crear")}
                    className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                  >
                    Plan Alimenticio
                  </button>
                  <button
                    onClick={() => setPublicationType("normal")}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Publicación Normal
                  </button>
                </div>
              )}

              {showPublicationForm && publicationType === "normal" && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold mb-4">Nueva Publicación</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Título</label>
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Contenido</label>
                      <textarea
                        rows={4}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handlePublicationSubmit}
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                    >
                      Publicar
                    </button>
                    <button
                      onClick={() => {
                        setShowPublicationForm(false);
                        setPublicationType(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
              {publications.slice(0, 4).map((pub) => (
                  <div
                    key={pub.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(pub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{pub.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                        <span className="text-xs font-semibold text-green-700">
                          {avatar}
                        </span>
                      </div>
                      <span>Por {pub.author}</span>
                    </div>

                    {(pub.ejercicios ?? []).length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-800">Ejercicios:</h4>
                        {pub.ejercicios?.map((ej: any) => (
                          <div key={ej.id} className="text-sm border rounded p-2 bg-gray-50">
                            <p className="font-semibold">{ej.nombre}</p>
                            <p className="text-gray-600">{ej.descripcion}</p>
                            <p className="text-gray-700">
                              {ej.series} series, {ej.repeticiones} reps, {ej.pesoKg}kg, descanso {ej.descansoSegundos}s
                            </p>
                            {ej.imagenUrl && (
                              <img
                                src={`${import.meta.env.VITE_API_URL}${ej.imagenUrl}`}
                                alt={ej.nombre}
                                className="w-32 mt-2 rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {publications.length > 4 && (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => navigate("/mis-publicaciones")}
      className="text-cyan-600 font-semibold hover:underline"
    >
      Ver más publicaciones
    </button>
  </div>
)}

              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full">
                  <span className="text-lg font-bold text-white">{avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" />
                Editar Perfil
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Estadísticas Rápidas
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicaciones</span>
                  <span className="font-semibold text-gray-900">
                    {publications.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Días activo</span>
                  <span className="font-semibold text-gray-900">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meta alcanzada</span>
                  <span className="font-semibold text-teal-600">
                    {(100 - progressPercentage).toFixed(0)} %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;