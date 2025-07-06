import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../service/authService";

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
        setMensaje("Progreso registrado correctamente.");
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
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded text-center border border-red-400">
        <h2 className="text-xl font-bold text-red-600 mb-2">Acceso restringido</h2>
        <p className="text-gray-700">Falta token o userId. Por favor inicia sesión nuevamente.</p>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 border border-gray-300">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Registrar Progreso Diario</h1>

      <div className="space-y-4 mb-6">
        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(parseFloat(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="% de Grasa Corporal"
          value={porcentajeGrasa}
          onChange={(e) => setPorcentajeGrasa(parseFloat(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <select
          value={metaSeleccionada}
          onChange={(e) => setMetaSeleccionada(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Selecciona una meta</option>
          {metas.map((meta) => (
            <option key={meta.id} value={meta.id}>
              {meta.descripcion}
            </option>
          ))}
        </select>

        <button
          onClick={handleRegistrarProgreso}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Registrar Progreso
        </button>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold text-cyan-700 mb-2">Buscar Progresos</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <input
          type="date"
          value={fin}
          onChange={(e) => setFin(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleBuscarProgresos}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {mensaje && <p className="text-sm text-red-600">{mensaje}</p>}

      {progresos.length > 0 && (
        <div className="mt-4 space-y-3">
          {progresos.map((p, index) => (
            <div key={index} className="p-3 border border-gray-300 rounded bg-gray-50">
              <p><strong>Fecha:</strong> {p.fecha}</p>
              <p><strong>Peso:</strong> {p.peso} kg</p>
              <p><strong>Grasa Corporal:</strong> {p.porcentajeGrasa ?? "-"} %</p>
              <p><strong>Notas:</strong> {p.notas ?? "-"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
