import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { 
  Menu, 
  Utensils, 
  Plus, 
  Target, 
  Zap, 
  Shield, 
  ChefHat, 
  Search, 
  Filter,
  Clock,
  Users,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface PlanAlimentacion {
  id_publicacion: number;
  titulo: string;
  contenido: string;
  tipoDieta: string;
  calorias: number;
  objetivos: string;
  restricciones: string;
  fecha_creacion?: string;
  autor?: string;
}

interface FilterState {
  searchTerm: string;
  selectedDiet: string;
  selectedObjective: string;
  calorieRange: string;
  sortBy: string;
}

const INITIAL_FILTER_STATE: FilterState = {
  searchTerm: "",
  selectedDiet: "todos",
  selectedObjective: "todos",
  calorieRange: "todos",
  sortBy: "recientes"
};

const CALORIE_RANGES = {
  bajo: { min: 0, max: 1500, label: "< 1500 kcal" },
  medio: { min: 1500, max: 2200, label: "1500 - 2200 kcal" },
  alto: { min: 2200, max: Infinity, label: "> 2200 kcal" }
} as const;

const DIET_COLORS: Record<string, string> = {
  'vegetariana': 'bg-green-500',
  'vegana': 'bg-green-600',
  'keto': 'bg-purple-500',
  'cetogénica': 'bg-purple-600',
  'mediterránea': 'bg-blue-500',
  'paleo': 'bg-orange-500',
  'alta en proteínas': 'bg-red-500',
  'proteica': 'bg-red-600',
  'baja en carbohidratos': 'bg-indigo-500',
  'sin gluten': 'bg-yellow-500',
  'dash': 'bg-cyan-500'
};

const PlanesAlimentacionPage: React.FC = () => {
  const [planes, setPlanes] = useState<PlanAlimentacion[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  const fetchPlanes = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/publicaciones/planes`,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (Array.isArray(response.data)) {
        setPlanes(response.data);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (err) {
      console.error("Error al obtener planes:", err);
      
      if (retryCount < 2) {
        setTimeout(() => fetchPlanes(retryCount + 1), Math.pow(2, retryCount) * 1000);
        return;
      }
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError("Conexión muy lenta. Verifica tu conexión a internet.");
        } else if (err.response?.status === 404) {
          setError("No se encontró el servicio de planes de alimentación.");
        } else if ((err.response?.status ?? 0) >= 500) {
          setError("Error del servidor. Intenta nuevamente en unos minutos.");
        } else {
          setError("Error de conexión. Verifica tu conexión a internet.");
        }
      } else {
        setError("No se pudieron cargar los planes de alimentación.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K, 
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
  }, []);

  const filterFunctions = useMemo(() => ({
    searchMatch: (plan: PlanAlimentacion, term: string) => {
      const searchLower = term.toLowerCase();
      return (
        plan.titulo.toLowerCase().includes(searchLower) ||
        plan.contenido.toLowerCase().includes(searchLower) ||
        plan.objetivos.toLowerCase().includes(searchLower) ||
        plan.tipoDieta.toLowerCase().includes(searchLower)
      );
    },
    dietMatch: (plan: PlanAlimentacion, diet: string) => 
      diet === "todos" || plan.tipoDieta.toLowerCase() === diet.toLowerCase(),
    objectiveMatch: (plan: PlanAlimentacion, objective: string) => 
      objective === "todos" || plan.objetivos.toLowerCase().includes(objective.toLowerCase()),
    caloriesMatch: (plan: PlanAlimentacion, range: string) => {
      if (range === "todos") return true;
      const rangeConfig = CALORIE_RANGES[range as keyof typeof CALORIE_RANGES];
      return rangeConfig && plan.calorias >= rangeConfig.min && plan.calorias < rangeConfig.max;
    }
  }), []);

  const filteredPlanes = useMemo(() => {
    const { searchTerm, selectedDiet, selectedObjective, calorieRange, sortBy } = filters;
    
    let filtered = planes.filter(plan => 
      filterFunctions.searchMatch(plan, searchTerm) &&
      filterFunctions.dietMatch(plan, selectedDiet) &&
      filterFunctions.objectiveMatch(plan, selectedObjective) &&
      filterFunctions.caloriesMatch(plan, calorieRange)
    );

    const sortFunctions: Record<string, (a: PlanAlimentacion, b: PlanAlimentacion) => number> = {
      calorias: (a, b) => a.calorias - b.calorias,
      titulo: (a, b) => a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }),
      recientes: (a, b) => b.id_publicacion - a.id_publicacion
    };

    return filtered.sort(sortFunctions[sortBy] || sortFunctions.recientes);
  }, [planes, filters, filterFunctions]);

  const uniqueValues = useMemo(() => ({
    diets: [...new Set(planes.map(plan => plan.tipoDieta))].sort(),
    objectives: [...new Set(planes.map(plan => plan.objetivos))].sort()
  }), [planes]);

  const getDietTypeColor = useCallback((tipoDieta: string): string => {
    return DIET_COLORS[tipoDieta.toLowerCase()] || 'bg-emerald-500';
  }, []);

  const getCaloriesColor = useCallback((calorias: number): string => {
    if (calorias < 1500) return 'text-blue-600';
    if (calorias < 2000) return 'text-green-600';
    if (calorias < 2500) return 'text-orange-600';
    return 'text-red-600';
  }, []);

  const truncateText = useCallback((text: string, maxLength: number = 120): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando planes de alimentación...</p>
            <p className="text-gray-500 text-sm mt-2">Esto puede tomar unos segundos</p>
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
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={() => fetchPlanes()}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Intentar nuevamente
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasActiveFilters = filters.searchTerm || 
                          filters.selectedDiet !== "todos" || 
                          filters.selectedObjective !== "todos" || 
                          filters.calorieRange !== "todos";

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50">
      <Navbar />

      {/* Mobile menu button */}
      <div className="flex items-center justify-start px-4 py-4 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 hover:text-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 p-2 rounded-lg transition-colors"
          aria-label="Abrir menú lateral"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
              <Utensils className="w-8 h-8 text-lime-600" />
              Planes de Alimentación
            </h1>
            <p className="text-gray-600">
              Descubre y crea planes nutricionales personalizados
            </p>
          </div>
          <Link
            to="/planes-alimentacion/crear"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nuevo plan
          </Link>
        </header>

        {planes.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar planes..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  aria-label="Buscar planes de alimentación"
                />
              </div>

              {/* Diet Type Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={filters.selectedDiet}
                  onChange={(e) => updateFilter('selectedDiet', e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white transition-colors"
                  aria-label="Filtrar por tipo de dieta"
                >
                  <option value="todos">Todos los tipos</option>
                  {uniqueValues.diets.map(diet => (
                    <option key={diet} value={diet}>{diet}</option>
                  ))}
                </select>
              </div>

              {/* Objective Filter */}
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={filters.selectedObjective}
                  onChange={(e) => updateFilter('selectedObjective', e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white transition-colors"
                  aria-label="Filtrar por objetivo"
                >
                  <option value="todos">Todos los objetivos</option>
                  {uniqueValues.objectives.map(objective => (
                    <option key={objective} value={objective}>{objective}</option>
                  ))}
                </select>
              </div>

              {/* Calorie Range Filter */}
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={filters.calorieRange}
                  onChange={(e) => updateFilter('calorieRange', e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white transition-colors"
                  aria-label="Filtrar por rango de calorías"
                >
                  <option value="todos">Todas las calorías</option>
                  {Object.entries(CALORIE_RANGES).map(([key, range]) => (
                    <option key={key} value={key}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white transition-colors"
                  aria-label="Ordenar planes"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="calorias">Por calorías</option>
                  <option value="titulo">Por nombre</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {filteredPlanes.length} {filteredPlanes.length === 1 ? 'plan encontrado' : 'planes encontrados'}
                  {planes.length !== filteredPlanes.length && ` de ${planes.length} total`}
                </span>
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Limpiar filtros
                </button>
              )}
            </div>
          </section>
        )}

        {/* Results */}
        {filteredPlanes.length === 0 && planes.length > 0 ? (
          // No results found
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron planes</h3>
            <p className="text-gray-500 mb-6">
              Intenta ajustar los filtros de búsqueda o crear un nuevo plan
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <Filter className="w-5 h-5" />
                Limpiar filtros
              </button>
              <Link
                to="/planes-alimentacion/crear"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                Crear nuevo plan
              </Link>
            </div>
          </div>
        ) : filteredPlanes.length === 0 ? (
          // No plans at all
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
          // Plans grid
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlanes.map((plan) => (
              <article
                key={plan.id_publicacion}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
              >
                <div className="p-6">
                  {/* Header with diet type and calories */}
                  <div className="flex items-start justify-between mb-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getDietTypeColor(plan.tipoDieta)}`}
                      title={`Tipo de dieta: ${plan.tipoDieta}`}
                    >
                      {plan.tipoDieta}
                    </span>
                    <div className="flex items-center gap-1" title={`${plan.calorias} calorías diarias`}>
                      <Zap className={`w-4 h-4 ${getCaloriesColor(plan.calorias)}`} />
                      <span className={`text-sm font-semibold ${getCaloriesColor(plan.calorias)}`}>
                        {plan.calorias.toLocaleString()} kcal
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {plan.titulo}
                  </h2>
                  
                  {/* Content preview */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3" title={plan.contenido}>
                    {truncateText(plan.contenido)}
                  </p>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Target className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Objetivo:</span>
                        <span className="ml-1 block sm:inline">{plan.objetivos}</span>
                      </div>
                    </div>

                    {plan.restricciones && plan.restricciones !== "Ninguna" && (
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Restricciones:</span>
                          <span className="ml-1 block sm:inline" title={plan.restricciones}>
                            {truncateText(plan.restricciones, 50)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <footer className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Plan #{plan.id_publicacion}</span>
                    <Link
                      to={`/planes-alimentacion/${plan.id_publicacion}`}
                      className="text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded px-1"
                      aria-label={`Ver detalles del plan ${plan.titulo}`}
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlanesAlimentacionPage;