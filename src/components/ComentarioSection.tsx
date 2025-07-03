import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface Comentario {
  id: number;
  contenido: string;
  autor: {
    firstName: string;
    lastName: string;
  };
}

interface Props {
  publicacionId: number;
}

export default function ComentarioSection({ publicacionId }: Props) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComentarios = () => {
    axios
      .get(`${API_URL}/api/comentarios/publicacion/${publicacionId}`)
      .then((res) => {
        console.log("Comentarios:", res.data);
        setComentarios(res.data);
      })
      .catch(() => setError("Error al cargar los comentarios"));
  };

  useEffect(() => {
    fetchComentarios();
  }, [publicacionId]);

  const handleAgregarComentario = () => {
    if (!nuevoComentario.trim()) return;
  
    setLoading(true);
  
    axios.post(
      `${API_URL}/api/comentarios`,
      {
        contenido: nuevoComentario,
        publicacionId: publicacionId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )    
      .then(() => {
        setNuevoComentario("");
        fetchComentarios();
      })
      .catch((err) => {
        console.error("Error al agregar comentario:", err);
        setError("No se pudo enviar el comentario.");
      })
      .finally(() => setLoading(false));
  };
  

  return (
    <div className="mt-6 p-4 rounded-lg border border-blue-500 bg-white shadow-md">
      <h3 className="text-lg font-bold text-blue-600 mb-3">Comentarios</h3>

      {comentarios.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Aún no hay comentarios.</p>
      ) : (
        <div className="space-y-2">
          {comentarios.map((comentario) => (
            <div
              key={comentario.id}
              className="bg-blue-50 p-3 rounded shadow-sm border border-green-400"
            >
              <p className="text-sm text-gray-800">
                <span className="text-green-600 font-medium">
                  {comentario.autor?.firstName} {comentario.autor?.lastName}
                </span>
                : {comentario.contenido}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border-2 border-green-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />
        <button
          className={`px-4 py-2 rounded text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={handleAgregarComentario}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}



