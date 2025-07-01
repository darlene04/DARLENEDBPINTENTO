import React, { useEffect, useState } from "react";
import axios from "axios";
import GrupoCard from "../../components/GrupoCard";
const API_URL = import.meta.env.API_URL;

interface GrupoDTO {
  id: number;
  nombre: string;
  descripcion: string;
  esPublico: boolean;
  administradorId: number;
}

const GruposPublicosPage: React.FC = () => {
  const [grupos, setGrupos] = useState<GrupoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrupos = async () => {
    try {
      const response = await axios.get(`${API_URL}/grupos/publicos`);
      setGrupos(response.data);
    } catch (err) {
      setError("Error al obtener los grupos públicos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Grupos Públicos</h1>
      {loading && <p>Cargando grupos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grupos.map((grupo) => (
          <GrupoCard
            key={grupo.id}
            id={grupo.id}
            nombre={grupo.nombre}
            descripcion={grupo.descripcion}
            esPublico={grupo.esPublico}
            onSuccess={fetchGrupos}
          />
        ))}
      </div>
    </div>
  );
};

export default GruposPublicosPage;
