import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  esPublico: boolean;
  miembros: number[];
  administradorId: number;
}

const MisGruposPage: React.FC = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axios.get("http://localhost:8090/grupos");
        const allGrupos: Grupo[] = response.data;
        const misGrupos = allGrupos.filter((grupo) =>
          grupo.miembros.includes(userId)
        );
        setGrupos(misGrupos);
      } catch (error) {
        console.error("Error al obtener grupos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrupos();
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">Mis Grupos</h1>
      {loading ? (
        <p className="text-center">Cargando grupos...</p>
      ) : grupos.length === 0 ? (
        <p className="text-center">No perteneces a ningún grupo aún.</p>
      ) : (
        <ul className="space-y-4">
          {grupos.map((grupo) => (
            <li key={grupo.id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-semibold text-gray-800">{grupo.nombre}</h2>
              <p className="text-gray-600">{grupo.descripcion}</p>
              <p className="text-sm mt-2 text-blue-500">
                {grupo.esPublico ? "Grupo Público" : "Grupo Privado"}
              </p>

              {/* Mostrar botón Editar solo si el usuario es el administrador */}
              {grupo.administradorId === userId && (
                <Link
                  to={`/grupos/${grupo.id}/editar`}
                  className="mt-2 inline-block text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
                >
                  Editar
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisGruposPage;
