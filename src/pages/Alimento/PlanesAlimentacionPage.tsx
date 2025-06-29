import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Menu, Utensils, Plus, Target, Zap, Shield, ChefHat, Search, Filter, Users, Clock, Heart } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiet, setSelectedDiet] = useState<string>("todos");
  const [selectedObjective, setSelectedObjective] = useState<string>("todos");
  const [calorieRange, setCalorieRange] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<string>("recientes");

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/publicaciones/planes`)
      .then((res) => {
        setPlanes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener planes:", err);
        setError("No se pudieron cargar los planes de alimentación.");
        setLoading(false);
      });
  }, []);

  // Filtros y búsqueda
  const filteredPlanes = useMemo(() => {
    let filtered = planes.filter(plan => {
      const matchesSearch = plan.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.objetivos.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDiet = selectedDiet === "todos" || plan.tipoDieta.toLowerCase() === selectedDiet.toLowerCase();
      
      const matchesObjective = selectedObjective === "todos" || plan.objetivos.toLowerCase().includes(selectedObjective.toLowerCase());
      
      const matchesCalories = calorieRange === "todos" || (() => {
        switch (calorieRange) {
          case "bajo": return plan.calorias < 1500;
          case "medio": return plan.calorias >= 1500 && plan.calorias < 2200;
          case "alto": return plan.calorias >= 2200;
          default: return true;
        }
      })();

      return matchesSearch && matchesDiet && matchesObjective && matchesCalories;
    });

    
    switch (sortBy) {
      case "calorias":
        return filtered.sort((a, b) => a.calorias - b.calorias);
      case "titulo":
        return filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
      default:
        return filtered.sort((a, b) => b.id_publicacion - a.id_publicacion);
    }
  }, [planes, searchTerm, selectedDiet, selectedObjective, calorieRange, sortBy]);

  const uniqueDiets = useMemo(() => {
    return [...new Set(planes.map(plan => plan.tipoDieta))];
  }, [planes]);

  const uniqueObjectives = useMemo(() => {
    return [...new Set(planes.map(plan => plan.objetivos))];
  }, [planes]);

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

  const getCaloriesColor = (calorias: number) => {
    if (calorias < 1500) return 'text-blue-600';
    if (calorias < 2000) return 'text-green-600';
    if (calorias < 2500) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando planes de alimentación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
            <div className="text-red-500 mb-4">
              <Shield className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Filtros y búsqueda */}
        {planes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar planes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                >
                  <option value="todos">Todos los tipos</option>
                  {uniqueDiets.map(diet => (
                    <option key={diet} value={diet}>{diet}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedObjective}
                  onChange={(e) => setSelectedObjective(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                >
                  <option value="todos">Todos los objetivos</option>
                  {uniqueObjectives.map(objective => (
                    <option key={objective} value={objective}>{objective}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={calorieRange}
                  onChange={(e) => setCalorieRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="todos">Todas las calorías</option>
                  <option value="bajo">&lt; 1500 kcal</option>
                  <option value="medio">1500 - 2200 kcal</option>
                  <option value="alto">&gt; 2200 kcal</option>
                </select>
              </div>

              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="calorias">Por calorías</option>
                  <option value="titulo">Por nombre</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                {filteredPlanes.length} {filteredPlanes.length === 1 ? 'plan encontrado' : 'planes encontrados'}
              </span>
              {(searchTerm || selectedDiet !== "todos" || selectedObjective !== "todos" || calorieRange !== "todos") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDiet("todos");
                    setSelectedObjective("todos");
                    setCalorieRange("todos");
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {filteredPlanes.length === 0 && planes.length > 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron planes</h3>
            <p className="text-gray-500 mb-6">Intenta ajustar los filtros de búsqueda</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDiet("todos");
                setSelectedObjective("todos");
                setCalorieRange("todos");
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Filter className="w-5 h-5" />
              Limpiar filtros
            </button>
          </div>
        ) : filteredPlanes.length === 0 ? (
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
            {filteredPlanes.map((plan) => (
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
                    <Link
                      to={`/planes-alimentacion/${plan.id_publicacion}`}
                      className="text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors"
                    >
                      Ver detalles →
                    </Link>
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