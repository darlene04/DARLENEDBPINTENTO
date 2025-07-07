import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../service/authService";
import { Scale, TrendingUp, Calendar, Target, Search, Plus, Activity } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProgresoPage() {
  const { token } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  const [peso, setPeso] = useState<number>(0);
  const [porcentajeGrasa, setPorcentajeGrasa] = useState<number>(0);
  const [notas, setNotas] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");

  const [inicio, setInicio] = useState<string>("");
  const [fin, setFin] = useState<string>("");
  const [progresos, setProgresos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState<string>("");

  const [metas, setMetas] = useState<any[]>([]);
  const [metaSeleccionada, setMetaSeleccionada] = useState<string>("");

  // 🔹 Obtener info del usuario (userId) al montar
  useEffect(() => {
    if (!token) return;

    getUserInfo()
      .then((res) => {
        const id = res.data?.id;
        if (id) {
          setUserId(id);
        } else {
          setMensaje("No se pudo obtener el ID del usuario.");
        }
      })
      .catch((err) => {
        console.error("Error al obtener información del usuario:", err);
        setMensaje("Error al obtener información del usuario.");
      });
  }, [token]);

  // 🔹 Cargar metas una vez que se tenga el userId
  useEffect(() => {
    if (!token || !userId) return;

    axios
      .get(`${API_URL}/api/metas/usuario/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMetas(res.data))
      .catch((err) => {
        console.error("Error al cargar metas:", err);
        setMensaje("Error al cargar metas.");
      });
  }, [token, userId]);

  const handleRegistrarProgreso = () => {
    if (!token || !userId) {
      setMensaje("Falta autenticación. Por favor inicia sesión.");
      return;
    }

    if (!metaSeleccionada) {
      setMensaje("Por favor selecciona una meta.");
      return;
    }

    axios
      .post(
        `${API_URL}/api/progresos`,
        {
          peso,
          porcentajeGrasa,
          notas,
          fecha,
          metaId: parseInt(metaSeleccionada),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMensaje("¡Progreso registrado correctamente! 🎉");
        setPeso(0);
        setPorcentajeGrasa(0);
        setNotas("");
        setFecha("");
        setMetaSeleccionada("");
      })
      .catch(() => setMensaje("Error al registrar progreso."));
  };

  const handleBuscarProgresos = () => {
    if (!token) {
      setMensaje("Falta autenticación. Por favor inicia sesión.");
      return;
    }

    axios
      .get(`${API_URL}/api/progresos/publicaciones/progreso?inicio=${inicio}&fin=${fin}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProgresos(res.data);
        setMensaje("");
      })
      .catch(() => setMensaje("Error al cargar progresos."));
  };

  if (!token || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-600">Acceso Restringido</h2>
          </div>
          <p className="text-gray-700">Falta token o userId. Por favor inicia sesión nuevamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Registrar Progreso
          </h1>
          <p className="text-lg text-gray-600">
            Mantén un seguimiento diario de tu evolución
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Registro */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Nuevo Registro
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Scale className="w-4 h-4 mr-2 text-green-600" />
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 70.5"
                    value={peso}
                    onChange={(e) => setPeso(parseFloat(e.target.value))}
                    className="w-full border-2 border-green-100 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Activity className="w-4 h-4 mr-2 text-green-600" />
                    % Grasa Corporal
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 15.2"
                    value={porcentajeGrasa}
                    onChange={(e) => setPorcentajeGrasa(parseFloat(e.target.value))}
                    className="w-full border-2 border-green-100 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full border-2 border-green-100 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 mr-2 text-green-600" />
                    Meta
                  </label>
                  <select
                    value={metaSeleccionada}
                    onChange={(e) => setMetaSeleccionada(e.target.value)}
                    className="w-full border-2 border-green-100 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  >
                    <option value="">Selecciona una meta</option>
                    {metas.map((meta) => (
                      <option key={meta.id} value={meta.id}>
                        {meta.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Notas adicionales
                </label>
                <textarea
                  placeholder="Añade comentarios sobre tu progreso..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-green-100 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
                />
              </div>

              <button
                onClick={handleRegistrarProgreso}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Registrar Progreso
              </button>
            </div>
          </div>

          {/* Panel de Búsqueda */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-cyan-100">
              <div className="flex items-center mb-4">
                <div className="bg-cyan-100 rounded-full p-3 mr-3">
                  <Search className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Buscar Progresos
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    className="w-full border-2 border-cyan-100 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
                    className="w-full border-2 border-cyan-100 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                  />
                </div>
                <button
                  onClick={handleBuscarProgresos}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Mensaje de estado */}
            {mensaje && (
              <div className={`p-4 rounded-xl border-l-4 ${
                mensaje.includes("correctamente") 
                  ? "bg-green-50 border-green-500 text-green-800" 
                  : "bg-red-50 border-red-500 text-red-800"
              }`}>
                <p className="font-medium">{mensaje}</p>
              </div>
            )}
          </div>
        </div>

        {/* Resultados de Búsqueda */}
        {progresos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
              Historial de Progreso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progresos.map((p, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 rounded-full p-2">
                      <Scale className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(p.fecha).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Peso:</span>
                      <span className="font-semibold text-green-600">{p.peso} kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Grasa:</span>
                      <span className="font-semibold text-cyan-600">
                        {p.porcentajeGrasa ?? "-"} %
                      </span>
                    </div>
                    
                    {p.notas && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{p.notas}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}