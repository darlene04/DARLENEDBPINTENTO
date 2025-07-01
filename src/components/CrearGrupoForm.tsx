import React, { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.API_URL;

interface CrearGrupoFormProps {
  onSuccess?: () => void;
}

const CrearGrupoForm: React.FC<CrearGrupoFormProps> = ({ onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<"PUBLICO" | "PRIVADO">("PUBLICO");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminId = localStorage.getItem("userId");
    if (!adminId) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      await axios.post(`${API_URL}/grupos/crear?adminId=${adminId}`, {
        nombre,
        descripcion,
        tipo,
      });
      alert("Grupo creado exitosamente.");
      setNombre("");
      setDescripcion("");
      setTipo("PUBLICO");
      onSuccess?.();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert("Ya existe un grupo con ese nombre.");
      } else {
        alert("Error al crear el grupo.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-md w-full mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-black text-center">Crear Grupo</h2>

      <div className="mb-4">
        <label className="block text-black font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 border rounded text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block text-black font-medium mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="w-full p-2 border rounded text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block text-black font-medium mb-1">Tipo de Grupo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "PUBLICO" | "PRIVADO")}
          className="w-full p-2 border rounded text-black"
        >
          <option value="PUBLICO">Público</option>
          <option value="PRIVADO">Privado</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded w-full"
      >
        Crear Grupo
      </button>
    </form>
  );
};

export default CrearGrupoForm;
