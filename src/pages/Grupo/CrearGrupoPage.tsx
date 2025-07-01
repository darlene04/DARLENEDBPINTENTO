import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../service/authService";
import {
  Users,
  FileText,
  Globe,
  Lock,
  ArrowLeft,
  Check,
  AlertCircle,
  Menu,
  Plus
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const CrearGrupoPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esPublico, setEsPublico] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar información del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserInfo();
        setUser(data);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
        setError("Error al cargar la información del usuario.");
      } finally {
        setLoadingUser(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    setLoading(true);

    if (!user?.id) {
      setError("Usuario no autenticado.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/grupos/crear?adminId=${user.id}`,
        { nombre: nombre.trim(), descripcion: descripcion.trim(), esPublico },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("¡Grupo creado exitosamente!");
      
      // Limpiar formulario
      setNombre("");
      setDescripcion("");
      setEsPublico(true);

      // Navegar después de un breve delay
      setTimeout(() => navigate("/grupos/misgrupos"), 2000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Ya existe un grupo con ese nombre. Elige un nombre diferente.");
      } else if (err.response?.status === 401) {
        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else if (err.response?.status === 400) {
        setError("Datos inválidos. Verifica la información ingresada.");
      } else {
        setError("Error inesperado al crear el grupo. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const avatar = user?.avatar || 
    user?.name?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "?";

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de autenticación</h2>
            <p className="text-gray-600 mb-4">No se pudo cargar tu información. Inicia sesión nuevamente.</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Ir al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />
      
      {/* Header con menú */}
      <div className="flex items-center px-4 py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 p-2 ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Grupo</h1>
                  <p className="text-gray-600">Configura tu grupo y comienza a construir tu comunidad</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre del grupo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Runners de Lima, Yoga Matutino..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    required
                    maxLength={100}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {nombre.length}/100 caracteres
                  </p>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe de qué trata tu grupo, qué actividades realizarán, quién puede unirse..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-colors"
                    required
                    maxLength={500}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {descripcion.length}/500 caracteres
                  </p>
                </div>

                {/* Configuración de privacidad */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Configuración de Privacidad
                  </label>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="privacidad"
                        checked={esPublico}
                        onChange={() => setEsPublico(true)}
                        className="mt-1 h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        disabled={loading}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900">Grupo Público</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Cualquier persona puede encontrar y unirse a tu grupo. Ideal para comunidades abiertas.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="privacidad"
                        checked={!esPublico}
                        onChange={() => setEsPublico(false)}
                        className="mt-1 h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        disabled={loading}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-gray-900">Grupo Privado</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Solo las personas invitadas pueden unirse. Perfecto para grupos más exclusivos.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {mensaje && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-700 text-sm">{mensaje}</p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || !nombre.trim() || !descripcion.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Crear Grupo
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/grupos/misgrupos")}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar con info del usuario y consejos */}
          <div className="space-y-6">
            {/* Info del usuario */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full">
                  <span className="text-lg font-bold text-white">{avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">Administrador del grupo</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Como creador del grupo, tendrás permisos completos para administrar miembros, 
                moderar contenido y configurar las reglas.
              </p>
            </div>

            {/* Consejos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">💡 Consejos para tu grupo</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Elige un nombre claro y descriptivo que refleje el propósito del grupo.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Una descripción detallada atrae a los miembros ideales.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Los grupos públicos crecen más rápido, pero los privados son más selectivos.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Puedes cambiar la configuración después de crear el grupo.</p>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tu actividad</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Grupos creados</span>
                  <span className="font-medium text-gray-900">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Miembro de</span>
                  <span className="font-medium text-gray-900">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Publicaciones</span>
                  <span className="font-medium text-gray-900">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearGrupoPage;