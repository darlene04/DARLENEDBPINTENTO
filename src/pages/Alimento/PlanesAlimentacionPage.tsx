import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Menu, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

interface PlanAlimentacion {
  id_publicacion: number;
  titulo: string;
  contenido: string;
  tipoDieta: string;
  calorias: number;
  objetivos: string;
  restricciones: string;
}

const PlanesAlimentacionPage: React.FC = () => {
  const [planes, setPlanes] = useState<PlanAlimentacion[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/publicaciones/planes`)
      .then((res) => setPlanes(res.data))
      .catch((err) => {
        console.error("Error al obtener planes:", err);
        alert("No se pudieron cargar los planes de alimentación.");
      });
  }, []);

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

      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow border">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-lime-600" />
            Planes de Alimentación
            </h1>
            <Link
            to="/planes-alimentacion/crear"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg font-medium"
            >
                + Nuevo plan
            </Link>
            </div>


        {planes.length === 0 ? (
          <p className="text-gray-600">No hay planes de alimentación aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {planes.map((plan) => (
              <div
                key={plan.id_publicacion}
                className="bg-white p-6 rounded-xl shadow border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-emerald-700">{plan.titulo}</h2>
                <p className="text-gray-600 text-sm mt-1">{plan.contenido}</p>

                <div className="mt-4 text-sm text-gray-700 space-y-1">
                  <p><strong>Tipo de dieta:</strong> {plan.tipoDieta}</p>
                  <p><strong>Calorías:</strong> {plan.calorias} kcal</p>
                  <p><strong>Objetivo:</strong> {plan.objetivos}</p>
                  <p><strong>Restricciones:</strong> {plan.restricciones || "Ninguna"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
};

export default PlanesAlimentacionPage;
