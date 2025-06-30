import React, { useState } from "react";
import MisGruposPage from "./MisGruposPage";
import GruposPublicosPage from "./GruposPublicosPage";
import CrearGrupoForm from "../../components/CrearGrupoForm";

const GrupoPage: React.FC = () => {
  const [tab, setTab] = useState("mis");

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-white to-gray-100">
      <h1 className="text-3xl font-bold text-center text-black mb-6">Gestión de Grupos</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setTab("mis")}
          className={`py-2 px-4 rounded font-semibold ${tab === "mis" ? "bg-black text-white" : "bg-white text-black border"}`}
        >
          Mis Grupos
        </button>
        <button
          onClick={() => setTab("publicos")}
          className={`py-2 px-4 rounded font-semibold ${tab === "publicos" ? "bg-black text-white" : "bg-white text-black border"}`}
        >
          Grupos Públicos
        </button>
        <button
          onClick={() => setTab("crear")}
          className={`py-2 px-4 rounded font-semibold ${tab === "crear" ? "bg-black text-white" : "bg-white text-black border"}`}
        >
          Crear Grupo
        </button>
      </div>

      {tab === "mis" && <MisGruposPage />}
      {tab === "publicos" && <GruposPublicosPage />}
      {tab === "crear" && <CrearGrupoForm />}
    </div>
  );
};

export default GrupoPage;
