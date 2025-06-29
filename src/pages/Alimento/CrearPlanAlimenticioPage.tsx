import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Utensils, Menu } from "lucide-react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const CrearPlanAlimentacionPage: React.FC = () => {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tipoDieta, setTipoDieta] = useState("");
  const [calorias, setCalorias] = useState<number | undefined>(undefined);
  const [objetivos, setObjetivos] = useState("");
  const [restricciones, setRestricciones] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGuardarPlan = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/publicaciones/planes`,
        {
          titulo,
          contenido,
          tipoDieta,
          calorias,
          objetivos,
          restricciones,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/planes-alimentacion");
    } catch (err: any) {
      console.error("Error al guardar plan:", err);
      alert("Ocurrió un error al guardar el plan de alimentación.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50">
      <Navbar />
      <div className="flex items-center justify-start px-4 py-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 hover:text-lime-600 focus:outline-none p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md mt-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Utensils className="w-6 h-6 text-lime-600" />
          Crear plan de alimentación
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            className="border px-4 py-2 rounded-lg"
          />
          <input
            value={tipoDieta}
            onChange={(e) => setTipoDieta(e.target.value)}
            placeholder="Tipo de dieta (ej. Keto, Vegetariana)"
            className="border px-4 py-2 rounded-lg"
          />
          <input
            type="number"
            value={calorias}
            onChange={(e) => setCalorias(Number(e.target.value))}
            placeholder="Calorías estimadas"
            className="border px-4 py-2 rounded-lg"
          />
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Objetivo</label>
            <select
              value={objetivos}
              onChange={(e) => setObjetivos(e.target.value)}
              className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="" disabled>-- Selecciona un objetivo --</option>
              <option value="Pérdida de grasa corporal">Pérdida de grasa corporal</option>
              <option value="Subir masa muscular">Subir masa muscular</option>
              <option value="Mantener peso">Mantener peso</option>
              <option value="Salud general">Salud general</option>
            </select>
          </div>

          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Descripción general del plan"
            className="border px-4 py-2 rounded-lg col-span-1 md:col-span-2"
          />
          <input
            value={restricciones}
            onChange={(e) => setRestricciones(e.target.value)}
            placeholder="Restricciones (ej. sin gluten, sin lactosa)"
            className="border px-4 py-2 rounded-lg col-span-1 md:col-span-2"
          />
        </div>

        <button
          onClick={handleGuardarPlan}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar plan
        </button>
      </div>
    </div>
  );
};

export default CrearPlanAlimentacionPage;
