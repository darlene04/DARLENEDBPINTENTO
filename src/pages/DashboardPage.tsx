import React, { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Plus,
  Edit3,
  Calendar,
  Weight,
} from "lucide-react";
import Navbar from "../components/Navbar";

import { getUserInfo } from "../service/authService";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

// localStorage.removeItem("token");

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
  {
    id: 2,
    title: "Receta saludable: Ensalada mediterránea",
    content:
      "Quiero compartir mi receta favorita que me ha ayudado mucho en mi proceso. Es súper fácil y deliciosa.",
    author: "Ana García",
    createdAt: "2024-06-20",
  },
];

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [progress, setProgress] = useState(mockProgress);
  const [publications, setPublications] = useState(mockPublications);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const progressPercentage = Math.min(
    100,
    (progress.currentWeight / progress.goalWeight) * 100
  );
  const weightToLose = Math.max(0, progress.currentWeight - progress.goalWeight);

  const { token } = useAuth();

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
    if (newTitle.trim() && newContent.trim()) {
      const newPublication = {
        id: publications.length + 1,
        title: newTitle.trim(),
        content: newContent.trim(),
        author: user?.name ?? "Yo",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPublications([newPublication, ...publications]);
      setNewTitle("");
      setNewContent("");
      setShowPublicationForm(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        Cargando datos del usuario...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  const avatar =
    user.avatar ||
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50">
      


      <Navbar />

      <div className="flex items-center justify-start px-4 py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 hover:text-violet-600 focus:outline-none p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* ------------ PROGRESO ------------- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-500" />
                  Tu Progreso
                </h2>
                <button
                  onClick={() => setShowProgressForm(!showProgressForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  Actualizar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-5 h-5" />
                    <span className="text-sm opacity-90">Peso Actual</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.currentWeight} kg</p>
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5" />
                    <span className="text-sm opacity-90">Meta</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.goalWeight} kg</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm opacity-90">Por Perder</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {weightToLose.toFixed(1)} kg
                  </p>
                </div>
              </div>

              {/*Barra de progreso */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso hacia tu meta</span>
                  <span>{(100 - progressPercentage).toFixed(1)} % restante</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${100 - progressPercentage}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Última actualización:{" "}
                {new Date(progress.lastUpdated).toLocaleDateString()}
              </p>

              {/*Formulario de progreso */}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleProgressSubmit}
                      className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors duration-200"
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Mis Publicaciones
                </h2>
                <button
                  onClick={() => setShowPublicationForm(!showPublicationForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Nueva
                </button>
              </div>

              {showPublicationForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Nueva Publicación
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Título de tu publicación"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido
                      </label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Comparte tu experiencia, consejos o logros..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handlePublicationSubmit}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200"
                    >
                      Publicar
                    </button>
                    <button
                      onClick={() => setShowPublicationForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de publicaciones */}
              <div className="space-y-4">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {pub.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(pub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{pub.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center justify-center w-6 h-6 bg-violet-100 rounded-full">
                        <span className="text-xs font-semibold text-violet-700">
                          {avatar}
                        </span>
                      </div>
                      <span>Por {pub.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ------------ SIDEBAR ------------- */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full">
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
                  <span className="font-semibold text-green-600">
                    {(100 - progressPercentage).toFixed(0)} %
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
