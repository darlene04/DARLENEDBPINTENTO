import { useEffect, useState } from "react";
import axios from "axios";
import { Target, Plus, Calendar, CheckCircle, Clock, ArrowLeft, Scale } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function obtenerUserIdDesdeToken(token: string | null): string | null {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));
      return decoded.userId?.toString() || decoded.id?.toString() || null;
    } catch (error) {
      return null;
    }
}

export default function MetaPage() {
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [pesoMeta, setPesoMeta] = useState(""); // Nuevo campo para peso meta
  const [metas, setMetas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState<"success" | "error" | "">("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesoActual, setPesoActual] = useState(""); // Nuevo campo

  // Token real desde localStorage
  const token = localStorage.getItem("token");
  const userId = obtenerUserIdDesdeToken(token);

  const fetchMetas = () => {
    if (!userId || !token) {
      setMensaje("Token o userId no encontrado");
      setMensajeTipo("error");
      return;
    }

    setLoading(true);
    axios
      .get(`${API_URL}/api/metas/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMetas(res.data);
        setMensaje("");
        setMensajeTipo("");
      })
      .catch(() => {
        setMensaje("Error al cargar metas");
        setMensajeTipo("error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const handleCrearMeta = () => {
    if (!descripcion.trim() || !fechaInicio || !fechaFin) {
      setMensaje("Por favor, completa todos los campos obligatorios");
      setMensajeTipo("error");
      return;
    }

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setMensaje("La fecha de fin debe ser posterior a la fecha de inicio");
      setMensajeTipo("error");
      return;
    }

    // Validación opcional para peso meta
    if (pesoMeta && (isNaN(Number(pesoMeta)) || Number(pesoMeta) <= 0)) {
      setMensaje("El peso meta debe ser un número positivo");
      setMensajeTipo("error");
      return;
    }

    if (!userId || !token) {
      setMensaje("Token o userId no encontrado");
      setMensajeTipo("error");
      return;
    }

    const meta = {
        descripcion,
        fechaInicio,
        fechaFin,
        pesoMeta: pesoMeta ? Number(pesoMeta) : null,
        pesoActual: pesoActual ? Number(pesoActual) : null,
        cumplida: false,
      };
      

    if (pesoActual && (isNaN(Number(pesoActual)) || Number(pesoActual) <= 0)) {
        setMensaje("El peso actual debe ser un número positivo");
        setMensajeTipo("error");
        return;
      }
      
    setLoading(true);
    axios
      .post(`${API_URL}/api/metas/crear?userId=${userId}`, meta, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setDescripcion("");
        setFechaInicio("");
        setFechaFin("");
        setPesoMeta("");
        setMensaje("¡Meta creada correctamente! 🎯");
        setMensajeTipo("success");
        setShowForm(false);
        fetchMetas();
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje("");
          setMensajeTipo("");
        }, 3000);
      })
      .catch(() => {
        setMensaje("Error al crear meta");
        setMensajeTipo("error");
      })
      .finally(() => setLoading(false));
  };

  const marcarComoCumplida = (metaId: number) => {
    setLoading(true);
    axios
      .put(`${API_URL}/api/metas/${metaId}/cumplida`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setMensaje("¡Felicitaciones! Meta marcada como cumplida 🎉");
        setMensajeTipo("success");
        fetchMetas();
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje("");
          setMensajeTipo("");
        }, 3000);
      })
      .catch(() => {
        setMensaje("Error al marcar como cumplida");
        setMensajeTipo("error");
      })
      .finally(() => setLoading(false));
  };

  const metasCumplidas = metas.filter(meta => meta.cumplida);
  const metasPendientes = metas.filter(meta => !meta.cumplida);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="w-8 h-8 text-green-600" />
                Gestión de Metas
              </h1>
              <p className="text-gray-600 mt-2">
                Define y alcanza tus objetivos fitness
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nueva Meta
            </button>
          </div>
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <div className={`mb-6 p-4 rounded-lg border ${
            mensajeTipo === "success" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {mensaje}
          </div>
        )}

        {/* Formulario de creación */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Crear Nueva Meta
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de la meta *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Perder 5 kg en 3 meses"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Nuevo campo para peso meta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso Meta (kg) - Opcional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="70"
                    value={pesoMeta}
                    onChange={(e) => setPesoMeta(e.target.value)}
                    min="0"
                    step="0.1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Especifica tu peso objetivo si es relevante para tu meta
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso Actual (kg) - Opcional
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="number"
                    placeholder="80"
                    value={pesoActual}
                    onChange={(e) => setPesoActual(e.target.value)}
                    min="0"
                    step="0.1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Registra tu peso actual si quieres hacer seguimiento desde el inicio
                </p>
                </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio *
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de finalización *
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCrearMeta}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creando..." : "Crear Meta"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Metas</p>
                <p className="text-2xl font-bold text-gray-900">{metas.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{metasCumplidas.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{metasPendientes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de metas */}
        <div className="space-y-6">
          {/* Metas en progreso */}
          {metasPendientes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-600" />
                Metas en Progreso ({metasPendientes.length})
              </h2>
              
              <div className="space-y-4">
                {metasPendientes.map((meta) => (
                  <div
                    key={meta.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{meta.descripcion}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Inicio: {new Date(meta.fechaInicio).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Fin: {new Date(meta.fechaFin).toLocaleDateString()}</span>
                          </div>
                          {meta.pesoMeta && (
                            <div className="flex items-center gap-1">
                              <Scale className="w-4 h-4" />
                              <span>Peso objetivo: {meta.pesoMeta} kg</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Progreso de tiempo */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso de tiempo</span>
                            <span>
                              {Math.round(
                                ((new Date().getTime() - new Date(meta.fechaInicio).getTime()) /
                                (new Date(meta.fechaFin).getTime() - new Date(meta.fechaInicio).getTime())) * 100
                              )}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(100, Math.max(0,
                                  ((new Date().getTime() - new Date(meta.fechaInicio).getTime()) /
                                  (new Date(meta.fechaFin).getTime() - new Date(meta.fechaInicio).getTime())) * 100
                                ))}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => marcarComoCumplida(meta.id)}
                        disabled={loading}
                        className="ml-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Completar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metas completadas */}
          {metasCumplidas.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Metas Completadas ({metasCumplidas.length})
              </h2>
              
              <div className="space-y-4">
                {metasCumplidas.map((meta) => (
                  <div
                    key={meta.id}
                    className="border border-green-200 rounded-lg p-4 bg-green-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{meta.descripcion}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Inicio: {new Date(meta.fechaInicio).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Fin: {new Date(meta.fechaFin).toLocaleDateString()}</span>
                          </div>
                          {meta.pesoMeta && (
                            <div className="flex items-center gap-1">
                              <Scale className="w-4 h-4" />
                              <span>Peso objetivo: {meta.pesoMeta} kg</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Completada
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {metas.length === 0 && !loading && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes metas registradas
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza creando tu primera meta fitness
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Crear Mi Primera Meta
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando metas...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}