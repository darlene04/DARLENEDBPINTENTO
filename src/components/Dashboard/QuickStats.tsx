import React, { useState, useEffect } from "react";
import {
  Menu,
  Edit3,
  Target,
  TrendingUp,
} from "lucide-react";
import { getUserInfo } from "../../service/authService";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

// Define the props interface
interface QuickStatsProps {
  publications: any[];
  progress: {
    currentWeight: number;
    goalWeight: number;
    lastUpdated: string;
  } | null;
}

const QuickStats: React.FC<QuickStatsProps> = ({ publications, progress }) => {
  const { token } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [metas, setMetas] = useState<any[]>([]);
  const getMetaActiva = () => {
    const metasNoCumplidas = metas.filter(meta => !meta.cumplida);
    
    if (metasNoCumplidas.length === 0) {
      return null;
    }
    
    const metasOrdenadas = metasNoCumplidas.sort((a, b) => 
      new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    );
    
    return metasOrdenadas[0];
  };

  const getPesoInicial = () => {
    const metaActiva = getMetaActiva();
    
    if (!metaActiva) {
      return 70;
    }
    
    const pesoInicial = metaActiva.peso_inicial || 
                       metaActiva.pesoInicial || 
                       metaActiva.initialWeight ||
                       metaActiva.pesoActual;
    
    return pesoInicial || 70;
  };

  const initialWeight = getPesoInicial();
  const metaActiva = getMetaActiva();
  
  const progressPercentage = progress && metaActiva
    ? Math.min(
        100,
        Math.max(0, ((initialWeight - progress.currentWeight) /
          (initialWeight - metaActiva.pesoMeta)) *
          100)
      )
    : 0;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserInfo();
        setUser(data);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [token]);

  const avatar =
    user?.avatar ||
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();

  if (loadingUser)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando…
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        No se pudo cargar la información del usuario.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      {/* ESTADÍSTICAS RÁPIDAS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Estadísticas Rápidas
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Publicaciones</span>
            <span className="font-semibold text-gray-900">
              {publications.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Días activo</span>
            <span className="font-semibold text-gray-900">15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Meta alcanzada</span>
            <span className="font-semibold text-teal-600">
              {progressPercentage > 0 ? progressPercentage.toFixed(0) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Metas completadas</span>
            <span className="font-semibold text-green-600">
              {metas.filter(meta => meta.cumplida).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;