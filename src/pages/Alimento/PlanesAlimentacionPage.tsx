import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Menu, Utensils, Plus, Target, Zap, Shield, ChefHat } from "lucide-react";
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

  // Función para obtener el color según el tipo de dieta
  const getDietTypeColor = (tipoDieta: string) => {
    switch (tipoDieta.toLowerCase()) {
      case 'vegetariana':
      case 'vegana':
        return 'bg-green-500';
      case 'keto':
      case 'cetogénica':
        return 'bg-purple-500';
      case 'mediterránea':
        return 'bg-blue-500';
      case 'paleo':
        return 'bg-orange-500';
      case 'alta en proteínas':
      case 'proteica':
        return 'bg-red-500';
      default:
        return 'bg-emerald-500';
    }
  };

  // Función para obtener el color según las calorías
  const getCaloriesColor = (calorias: number) => {
    if (calorias < 1500) return 'text-blue-600';
    if (calorias < 2000) return 'text-green-600';
    if (calorias < 2500) return 'text-orange-600';
    return 'text-red-600';
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

      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Utensils className="w-8 h-8 text-lime-600" />
            Planes de Alimentación
          </h1>
          <Link
            to="/planes-alimentacion/crear"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nuevo plan
          </Link>
        </div>

        {planes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay planes disponibles</h3>
            <p className="text-gray-500 mb-6">Crea tu primer plan de alimentación para comenzar</p>
            <Link
              to="/planes-alimentacion/crear"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              Crear primer plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {planes.map((plan) => (
              <div
                key={plan.id_publicacion}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getDietTypeColor(plan.tipoDieta)}`}>
                      {plan.tipoDieta}
                    </span>
                    <div className="flex items-center gap-1">
                      <Zap className={`w-4 h-4 ${getCaloriesColor(plan.calorias)}`} />
                      <span className={`text-sm font-semibold ${getCaloriesColor(plan.calorias)}`}>
                        {plan.calorias} kcal
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {plan.titulo}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {plan.contenido}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Target className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-medium">Objetivo:</span>
                      <span className="truncate">{plan.objetivos}</span>
                    </div>

                    {plan.restricciones && plan.restricciones !== "Ninguna" && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="font-medium">Restricciones:</span>
                        <span className="truncate">{plan.restricciones}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Plan #{plan.id_publicacion}</span>
                    <span className="text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanesAlimentacionPage;