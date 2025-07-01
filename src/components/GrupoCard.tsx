import React from "react";
import axios from "axios";
const API_URL = import.meta.env.API_URL;

interface GrupoCardProps {
  id: number;
  nombre: string;
  descripcion: string;
  esPublico: boolean;
  onSuccess?: () => void;
}

const GrupoCard: React.FC<GrupoCardProps> = ({ id, nombre, descripcion, esPublico, onSuccess }) => {
  const handleUnirse = async () => {
    const userId = localStorage.getItem("userId"); // Suponiendo que ya lo tienes guardado

    if (!userId) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      await axios.post(`${API_URL}/grupos/${id}/unirse?userId=${userId}`);
      alert("Te has unido al grupo exitosamente.");
      onSuccess?.();
    } catch (error) {
      alert("Error al unirse al grupo.");
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold text-black">{nombre}</h2>
      <p className="text-gray-600 mb-2">{descripcion}</p>
      {esPublico && (
        <button
          onClick={handleUnirse}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded"
        >
          Unirse
        </button>
      )}
    </div>
  );
};

export default GrupoCard;
