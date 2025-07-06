// components/ProgressCard.tsx
import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Edit3, Calendar, Weight, CheckCircle, Trophy, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../service/authService";

const API_URL = import.meta.env.VITE_API_URL;

interface Meta {
    id: number;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    cumplida: boolean;
    userId: number;
    pesoMeta: number | null;
    pesoActual: number | null; // 👈 añadir esto
  }
  
interface Progreso {
  id: number;
  peso: number;
  fecha: string;
  metaId: number;
}

interface ProgressCardProps {
  progress: {
    currentWeight: number;
    goalWeight: number;
    lastUpdated: string;
  };
  onProgressUpdate: (newProgress: any) => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress, onProgressUpdate }) => {
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [activeMeta, setActiveMeta] = useState<Meta | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Obtener el token del contexto de autenticación
  const { token } = useAuth();

  // Función para redirigir a la página de metas
  const redirectToMetas = () => {
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/metas`;
  };
  
  // Función para obtener la información del usuario
  const fetchUserInfo = async () => {
    try {
      const { data } = await getUserInfo();
      setUserId(data.id);
      return data.id;
    } catch (err) {
      console.error("Error al obtener información del usuario:", err);
      throw err;
    }
  };

  // Función para obtener los progresos de una meta específica
  const fetchProgresos = async (metaId: number) => {
    try {
      console.log('Fetching progresos for meta ID:', metaId);
      
      // Configurar headers de la petición
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Agregar Authorization si está disponible
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/progresos`, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from progresos:', response.status, errorText);
        throw new Error(`Error al obtener los progresos: ${response.status}`);
      }
      
      const progresos: Progreso[] = await response.json();
      console.log('Progresos received:', progresos);
      
      // Filtrar progresos por metaId y ordenar por fecha descendente y después por ID descendente
      const progresosDeMetaActiva = progresos
        .filter(progreso => progreso.metaId === metaId)
        .sort((a, b) => {
          // Primero ordenar por fecha descendente
          const fechaA = new Date(a.fecha).getTime();
          const fechaB = new Date(b.fecha).getTime();
          if (fechaB !== fechaA) {
            return fechaB - fechaA;
          }
          // Si las fechas son iguales, ordenar por ID descendente (el más reciente)
          return b.id - a.id;
        });
      
      console.log('Progresos filtered and sorted for meta:', progresosDeMetaActiva);
      
      if (progresosDeMetaActiva.length > 0) {
        const ultimoProgreso = progresosDeMetaActiva[0];
        setCurrentWeight(ultimoProgreso.peso);
        setLastUpdated(ultimoProgreso.fecha);
      } else if (activeMeta) {
        if (activeMeta.pesoActual !== null && activeMeta.pesoActual !== undefined) {
          setCurrentWeight(activeMeta.pesoActual);
          setLastUpdated(activeMeta.fechaInicio);
        } else {
          setCurrentWeight(0);
          setLastUpdated(new Date().toISOString());
        }
      }
      
      return progresosDeMetaActiva;
    } catch (err) {
      console.error('Error fetching progresos:', err);
      throw err;
    }
  };

  // Función para obtener las metas del usuario
  const fetchUserMetas = async (userIdParam?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching user metas...');
      
      // Si no tenemos userId, intentar obtenerlo
      let currentUserId = userIdParam || userId;
      if (!currentUserId) {
        currentUserId = await fetchUserInfo();
      }
      
      // Configurar headers de la petición
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Agregar Authorization si está disponible
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/metas/usuario/${currentUserId}`, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from metas:', response.status, errorText);
        throw new Error(`Error al obtener las metas: ${response.status}`);
      }
      
      const metas: Meta[] = await response.json();
      console.log('Metas received:', metas);
      
      // Buscar la meta activa (no cumplida y con pesoMeta)
      const metaActiva = metas.find(meta => 
        !meta.cumplida && 
        meta.pesoMeta !== null && 
        meta.pesoMeta !== undefined
      );
      
      console.log('Active meta found:', metaActiva);
      setActiveMeta(metaActiva || null);
      
      // Si hay meta activa, obtener los progresos
      if (metaActiva) {
        try {
          await fetchProgresos(metaActiva.id);
        } catch (progresosError) {
          console.error('Error fetching progresos, but continuing with meta data:', progresosError);
          // Continuar sin progresos si falla, pero mantener la meta
        }
      } else {
        console.log('No active meta found');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Error al cargar los datos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para marcar la meta como completada
  const marcarMetaComoCumplida = async () => {
    if (!activeMeta || !token) return;
    
    try {
      setIsCompleting(true);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      
      const response = await fetch(`${API_URL}/api/metas/${activeMeta.id}/cumplida`, {
        method: 'PUT',
        headers: headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error marking meta as completed:', response.status, errorText);
        throw new Error(`Error al marcar la meta como cumplida: ${response.status}`);
      }
      
      // Actualizar el estado local
      setActiveMeta(prev => prev ? { ...prev, cumplida: true } : null);
      setShowCompletionModal(true);
      
      // Recargar las metas para obtener la siguiente meta activa
      setTimeout(() => {
        fetchUserMetas();
        setShowCompletionModal(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error completing meta:', err);
      setError('Error al completar la meta');
    } finally {
      setIsCompleting(false);
    }
  };

  // Cargar metas al montar el componente
  useEffect(() => {
    if (token) {
      fetchUserMetas();
    }
  }, [token]);

  // Usar los datos de la API en lugar de las props
  const displayCurrentWeight = currentWeight || progress.currentWeight;
  const displayGoalWeight = activeMeta?.pesoMeta || progress.goalWeight;
  const displayLastUpdated = lastUpdated || progress.lastUpdated;
  const weightDifference = displayGoalWeight - displayCurrentWeight;
  const isGainingWeight = weightDifference > 0;
  const weightToChange = Math.abs(weightDifference);

  
  const progressPercentage = isGainingWeight 
  ? Math.min(100, (displayCurrentWeight / displayGoalWeight) * 100)
  : Math.max(0, 100 - ((displayCurrentWeight - displayGoalWeight) / displayCurrentWeight) * 100);

  // Verificar si la meta está completada (100%)
  const isMetaCompleted = Math.abs(progressPercentage - 100) < 0.1; // Tolerancia para errores de punto flotante

  const handleProgressSubmit = async () => {
    if (newWeight && activeMeta && token) {
      try {
        // Aquí podrías hacer un POST al endpoint de progresos
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const progressData = {
          peso: parseFloat(newWeight),
          fecha: new Date().toISOString(),
          metaId: activeMeta.id
        };

        const response = await fetch(`${API_URL}/api/progresos`, {
            method: 'POST',
          headers: headers,
          body: JSON.stringify(progressData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error creating progress:', response.status, errorText);
          throw new Error(`Error al crear el progreso: ${response.status}`);
        }

        // Actualizar el estado local
        setCurrentWeight(parseFloat(newWeight));
        setLastUpdated(new Date().toISOString());
        
        const newProgress = {
          currentWeight: parseFloat(newWeight),
          goalWeight: activeMeta.pesoMeta || parseFloat(newGoal),
          lastUpdated: new Date().toISOString().split("T")[0],
        };
        onProgressUpdate(newProgress);
        
        setNewWeight("");
        setNewGoal("");
        setShowProgressForm(false);
        
        // Recargar los datos para asegurar consistencia
        if (activeMeta) {
          await fetchProgresos(activeMeta.id);
        }
      } catch (err) {
        console.error('Error updating progress:', err);
        setError('Error al actualizar el progreso');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-2 text-gray-600">Cargando progreso...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500 text-center">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => fetchUserMetas()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Reintentar
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Revisa la consola del navegador para más detalles
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay meta activa, mostrar la vista para crear una nueva meta
  if (!activeMeta) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="mb-6">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes metas activas
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Para comenzar a hacer seguimiento de tu progreso, necesitas crear una nueva meta de peso.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Plus className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">¿Listo para empezar?</span>
            </div>
            <p className="text-sm text-green-700 mb-4">
              Crea tu primera meta y comienza a alcanzar tus objetivos de peso de forma organizada.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={redirectToMetas}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-lg hover:from-green-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Crear Nueva Meta
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => fetchUserMetas()}
              className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Actualizar metas
            </button>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>💡 Tip: Puedes crear múltiples metas y hacer seguimiento de cada una por separado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Modal de completación */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Felicidades!</h3>
              <p className="text-gray-600">Has completado tu meta exitosamente</p>
            </div>
            <div className="animate-pulse">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-3 rounded-full w-full"></div>
              </div>
              <p className="text-sm text-gray-500">Buscando tu próxima meta...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Tu Progreso
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProgressForm(!showProgressForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
            Actualizar
          </button>
          
          {/* Botón de completar meta - solo visible cuando está al 100% */}
          {activeMeta && isMetaCompleted && (
            <button
              onClick={marcarMetaComoCumplida}
              disabled={isCompleting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isCompleting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 animate-pulse'
              }`}
            >
              {isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Completando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ¡Completar Meta!
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Alerta de meta completada */}
      {activeMeta && isMetaCompleted && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-green-800">¡Meta Alcanzada!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            ¡Felicidades! Has alcanzado tu meta de peso. Haz clic en "Completar Meta" para marcarla como cumplida.
          </p>
        </div>
      )}

      {/* Debug info - puedes remover esto cuando esté funcionando bien
      {process.env.NODE_ENV === 'development' && activeMeta && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600">
            <p><strong>Debug Info:</strong></p>
            <p>Meta ID: {activeMeta.id}</p>
            <p>Peso actual obtenido: {currentWeight} kg</p>
            <p>Última actualización: {lastUpdated}</p>
            <p>Progreso: {progressPercentage.toFixed(1)}%</p>
            <p>Meta completada: {isMetaCompleted ? 'SÍ' : 'NO'}</p>
          </div>
        </div>
      )} */}

      {/* Mostrar información de la meta activa */}
      {activeMeta && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Meta Activa</span>
          </div>
          <p className="text-sm text-blue-700">{activeMeta.descripcion}</p>
          <p className="text-xs text-blue-600 mt-1">
            {new Date(activeMeta.fechaInicio).toLocaleDateString()} - {new Date(activeMeta.fechaFin).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Weight className="w-5 h-5" />
            <span className="text-sm opacity-90">Peso Actual</span>
          </div>
          <p className="text-2xl font-bold">{displayCurrentWeight} kg</p>
        </div>
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm opacity-90">Meta</span>
          </div>
          <p className="text-2xl font-bold">{displayGoalWeight} kg</p>
          {activeMeta && (
            <p className="text-xs opacity-75 mt-1">De la meta activa</p>
          )}
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm opacity-90">
              {isGainingWeight ? 'Por Ganar' : 'Por Perder'}
            </span>
          </div>
          <p className="text-2xl font-bold">{weightToChange.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progreso hacia tu meta</span>
        <span className={isMetaCompleted ? 'text-green-600 font-bold' : ''}>
          {isGainingWeight 
            ? `${(progressPercentage).toFixed(1)}% completado` 
            : `${(100 - progressPercentage).toFixed(1)}% restante`
          }
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            isMetaCompleted 
              ? 'bg-gradient-to-r from-green-500 to-yellow-500' 
              : 'bg-gradient-to-r from-green-500 to-cyan-500'
          }`}
          style={{ 
              width: `${progressPercentage}%`
          }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Última actualización: {new Date(displayLastUpdated).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchUserMetas()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Actualizar metas
          </button>
          <button
            onClick={redirectToMetas}
            className="text-green-600 hover:text-green-800 underline"
          >
            Ver todas las metas
          </button>
        </div>
      </div>

      {/* Formulario de actualización */}
      {showProgressForm && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Actualizar Progreso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso Actual (kg)
              </label>
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder={displayCurrentWeight.toString()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta (kg) - {activeMeta ? 'Fijada por meta activa' : 'Personalizada'}
              </label>
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder={displayGoalWeight.toString()}
                disabled={!!activeMeta}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  activeMeta ? 'bg-gray-100 text-gray-500' : ''
                }`}
              />
              {activeMeta && (
                <p className="text-xs text-gray-500 mt-1">
                  La meta se toma automáticamente de tu meta activa
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleProgressSubmit}
              disabled={!newWeight}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                !newWeight 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Guardar
            </button>
            <button
              onClick={() => setShowProgressForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;