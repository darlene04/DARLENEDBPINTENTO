import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { ArrowLeft, Calendar, User, Dumbbell, Clock, Weight, RotateCcw, AlertCircle, Plus } from "lucide-react";
import { getUserInfo } from "../../service/authService";
import { useAuth } from "../../context/AuthContext";

// Interfaces para mejor tipado
interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string;
  series: number;
  repeticiones: number;
  pesoKg: number;
  descansoSegundos: number;
  imagenUrl?: string;
}

interface Publicacion {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  ejercicios: Ejercicio[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const MisPublicaciones: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  // Estados
  const [user, setUser] = useState<User | null>(null);
  const [publications, setPublications] = useState<Publicacion[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState({
    user: true,
    publications: true
  });
  const [errors, setErrors] = useState({
    user: null as string | null,
    publications: null as string | null
  });

  // Función para obtener información del usuario
  const fetchUser = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(prev => ({ ...prev, user: true }));
      setErrors(prev => ({ ...prev, user: null }));
      
      const { data } = await getUserInfo();
      setUser(data);
    } catch (err) {
      console.error("Error al obtener el usuario:", err);
      setErrors(prev => ({ 
        ...prev, 
        user: "No se pudo cargar la información del usuario" 
      }));
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  }, [token]);

  // Función para obtener publicaciones del usuario
  const fetchPublications = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(prev => ({ ...prev, publications: true }));
      setErrors(prev => ({ ...prev, publications: null }));

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/publicaciones/autor`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // Timeout de 10 segundos
        }
      );

      const basePublications = response.data;
      
      // Cargar detalles de publicaciones en paralelo con límite
      const publicationsWithDetails = await Promise.allSettled(
        basePublications.map(async (pub: any): Promise<Publicacion> => {
          try {
            const detailResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/publicaciones/${pub.id}`,
              { timeout: 5000 }
            );
            
            return {
              id: pub.id,
              title: pub.titulo || "Sin título",
              content: detailResponse.data.contenido || "Sin contenido",
              author: pub.autor || "Autor desconocido",
              createdAt: pub.fechaCreacion || new Date().toISOString(),
              ejercicios: detailResponse.data.ejercicios || [],
            };
          } catch (error) {
            console.warn(`Error cargando detalles de publicación ${pub.id}:`, error);
            // Retornar publicación básica si falla la carga de detalles
            return {
              id: pub.id,
              title: pub.titulo || "Sin título",
              content: "Error al cargar contenido",
              author: pub.autor || "Autor desconocido",
              createdAt: pub.fechaCreacion || new Date().toISOString(),
              ejercicios: [],
            };
          }
        })
      );

      // Filtrar publicaciones exitosas
      const successfulPublications = publicationsWithDetails
        .filter((result): result is PromiseFulfilledResult<Publicacion> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      setPublications(successfulPublications);
      
      // Mostrar advertencia si algunas publicaciones fallaron
      const failedCount = publicationsWithDetails.length - successfulPublications.length;
      if (failedCount > 0) {
        console.warn(`${failedCount} publicaciones no se pudieron cargar completamente`);
      }

    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
      setErrors(prev => ({ 
        ...prev, 
        publications: "No se pudieron cargar las publicaciones" 
      }));
    } finally {
      setLoading(prev => ({ ...prev, publications: false }));
    }
  }, [token]);

  // Effects
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Memoized values
  const userAvatar = useMemo(() => {
    if (user?.avatar) return user.avatar;
    if (user?.name) {
      return user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "??";
  }, [user]);

  // Función para formatear fecha
  const formatDate = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  }, []);

  // Función para formatear duración
  const formatDuration = useCallback((seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }, []);

  // Handlers
  const handleRetryUser = () => fetchUser();
  const handleRetryPublications = () => fetchPublications();
  const handleNavigateToCreate = () => navigate("/crear-publicacion");
  const handleNavigateToDashboard = () => navigate("/dashboard");

  // Loading state
  if (loading.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />
      
      {/* Header con navegación */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors"
                aria-label="Abrir menú"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Mis Publicaciones</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleNavigateToCreate}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nueva Publicación
              </button>
              <button
                onClick={handleNavigateToDashboard}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Error del usuario */}
        {errors.user && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errors.user}</span>
            </div>
            <button
              onClick={handleRetryUser}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Publicaciones</p>
                <p className="text-2xl font-bold text-gray-900">{publications.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ejercicios</p>
                <p className="text-2xl font-bold text-gray-900">
                  {publications.reduce((acc, pub) => acc + pub.ejercicios.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Dumbbell className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Última Publicación</p>
                <p className="text-sm font-medium text-gray-900">
                  {publications.length > 0 
                    ? formatDate(publications[0].createdAt)
                    : "Sin publicaciones"
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error de publicaciones */}
        {errors.publications && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errors.publications}</span>
            </div>
            <button
              onClick={handleRetryPublications}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading de publicaciones */}
        {loading.publications && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando publicaciones...</p>
          </div>
        )}

        {/* Lista de publicaciones */}
        {!loading.publications && publications.length === 0 && !errors.publications ? (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes publicaciones aún</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primera publicación de rutina de ejercicios</p>
            <button
              onClick={handleNavigateToCreate}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Publicación
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {publications.map((pub) => (
              <article
                key={pub.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header de la publicación */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{pub.title}</h2>
                    <p className="text-gray-700 text-sm leading-relaxed">{pub.content}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(pub.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Info del autor */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <span className="text-sm font-semibold text-green-700">
                      {userAvatar}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">Por {pub.author}</span>
                </div>

                {/* Ejercicios */}
                {pub.ejercicios.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Dumbbell className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Ejercicios ({pub.ejercicios.length})
                      </h3>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {pub.ejercicios.map((ejercicio) => (
                        <div
                          key={ejercicio.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{ejercicio.nombre}</h4>
                            {ejercicio.imagenUrl && (
                              <img
                                src={`${import.meta.env.VITE_API_URL}${ejercicio.imagenUrl}`}
                                alt={ejercicio.nombre}
                                className="w-16 h-16 object-cover rounded-lg ml-3"
                                loading="lazy"
                              />
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{ejercicio.descripcion}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <RotateCcw className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-700">{ejercicio.series} series</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">R</span>
                              <span className="text-gray-700">{ejercicio.repeticiones} reps</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Weight className="w-4 h-4 text-purple-500" />
                              <span className="text-gray-700">{ejercicio.pesoKg}kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-orange-500" />
                              <span className="text-gray-700">{formatDuration(ejercicio.descansoSegundos)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPublicaciones;