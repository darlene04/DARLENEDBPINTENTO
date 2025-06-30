import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrearGrupoPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esPublico, setEsPublico] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminId = localStorage.getItem("userId");

    if (!adminId) {
      setError("Usuario no autenticado.");
      return;
    }

    try {
      await axios.post(`http://localhost:8090/grupos/crear?adminId=${adminId}`, {
        nombre,
        descripcion,
        esPublico,
      });

      setMensaje("Grupo creado correctamente.");
      setTimeout(() => {
        navigate("/grupos/publicos");
      }, 1500);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Ya existe un grupo con ese nombre.");
      } else {
        setError("Error al crear el grupo.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">Crear Nuevo Grupo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Grupo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          ></textarea>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={esPublico}
            onChange={(e) => setEsPublico(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Grupo Público</label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Crear Grupo
        </button>
      </form>
    </div>
  );
};

export default CrearGrupoPage;
