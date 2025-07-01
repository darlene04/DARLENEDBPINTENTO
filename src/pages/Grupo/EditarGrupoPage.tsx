import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.API_URL;

interface GrupoData {
  nombre: string;
  descripcion: string;
  tipo: "PUBLICO" | "PRIVADO";
}

const EditarGrupoPage: React.FC = () => {
  const { grupoId } = useParams<{ grupoId: string }>();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState<GrupoData>({
    nombre: "",
    descripcion: "",
    tipo: "PUBLICO",
  });

  const fetchGrupo = async () => {
    try {
      const response = await axios.get(`${API_URL}/grupos`);
      const grupoEncontrado = response.data.find((g: any) => g.id === parseInt(grupoId!));
      if (grupoEncontrado) {
        setGrupo({
          nombre: grupoEncontrado.nombre,
          descripcion: grupoEncontrado.descripcion,
          tipo: grupoEncontrado.tipo,
        });
      } else {
        alert("Grupo no encontrado.");
        navigate("/grupos");
      }
    } catch (error) {
      alert("Error al cargar el grupo.");
    }
  };

  useEffect(() => {
    fetchGrupo();
  }, [grupoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGrupo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/grupos/${grupoId}/editar`, grupo);
      alert("Grupo actualizado correctamente.");
      navigate("/grupos");
    } catch (error) {
      alert("Error al actualizar el grupo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Editar Grupo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Nombre del Grupo</label>
            <input
              type="text"
              name="nombre"
              value={grupo.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={grupo.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Tipo</label>
            <select
              name="tipo"
              value={grupo.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="PUBLICO">Público</option>
              <option value="PRIVADO">Privado</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarGrupoPage;
