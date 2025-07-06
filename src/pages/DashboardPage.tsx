// Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getUserInfo } from "../service/authService";
import { useAuth } from "../context/AuthContext";
import UserProfile from "../components/Dashboard/UserProfile";

// Importar los nuevos componentes
import ProgressCard from "../components/Dashboard/ProgressCard";
import CommunityPublications from "../components/Dashboard/CommunityPublications";
import MyPublications from "../components/Dashboard/MyPublications";
import QuickStats from "../components/Dashboard/QuickStats"; // Add this line
const API_URL = import.meta.env.VITE_API_URL;

interface Meta {
  id: number;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cumplida: boolean;
  userId: number;
  pesoMeta: number;
  pesoActual: number;
}

interface Progreso {
  id: number;
  peso: number;
  fecha: string | null;
  metaId: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState<{
    currentWeight: number;
    goalWeight: number;
    lastUpdated: string;
  } | null>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [otrasPublicaciones, setOtrasPublicaciones] = useState<any[]>([]);
  const [misGrupos, setMisGrupos] = useState<{ id: number; nombre: string }[]>([]);

  // Función para obtener el último progreso de una meta
  const getUltimoProgreso = (progresos: Progreso[], metaId: number): Progreso | null => {
    const progresosDeEstaMetaConFecha = progresos.filter(
      p => p.metaId === metaId && p.fecha !== null
    );
    
    if (progresosDeEstaMetaConFecha.length === 0) return null;
    
    // Ordenar por fecha descendente y tomar el primero
    return progresosDeEstaMetaConFecha.sort((a, b) => 
      new Date(b.fecha!).getTime() - new Date(a.fecha!).getTime()
    )[0];
  };

  // Función para cargar el progreso actual
// Fixed fetchProgress function with proper authentication
const fetchProgress = async () => {
  try {
    if (!user?.id) return;

    // 1. Obtener las metas del usuario
    const metasResponse = await axios.get(
      `${API_URL}/api/metas/usuario/${user.id}`,
          {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const metas: Meta[] = metasResponse.data;

    if (metas.length === 0) {
      console.log("No hay metas para este usuario");
      return;
    }

    // 2. Obtener todos los progresos - ADD AUTHORIZATION HEADER HERE
    const progresosResponse = await axios.get(
      `${API_URL}/api/progresos`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const progresos: Progreso[] = progresosResponse.data;

    // 3. Tomar la primera meta no cumplida (o la más reciente)
    const metaActual = metas.find(meta => !meta.cumplida) || metas[0];
    
    console.log("Meta actual seleccionada:", metaActual);
    
    // 4. Obtener el último progreso para esta meta
    const ultimoProgreso = getUltimoProgreso(progresos, metaActual.id);
    
    console.log("Último progreso encontrado:", ultimoProgreso);
    
    // 5. Calcular el peso actual
    const pesoActual = ultimoProgreso ? ultimoProgreso.peso : metaActual.pesoActual;
    const fechaActualizacion = ultimoProgreso ? ultimoProgreso.fecha : metaActual.fechaInicio;

    console.log("Peso calculado:", {
      pesoDelProgreso: ultimoProgreso?.peso,
      pesoActualDeMeta: metaActual.pesoActual,
      pesoFinal: pesoActual
    });

    // 6. Actualizar el estado
    setProgress({
      currentWeight: pesoActual,
      goalWeight: metaActual.pesoMeta,
      lastUpdated: fechaActualizacion!.split('T')[0]
    });

    console.log("Progreso actualizado:", {
      metaId: metaActual.id,
      pesoActual,
      pesoMeta: metaActual.pesoMeta,
      ultimoProgreso
    });

  } catch (error) {
    console.error("Error al cargar el progreso:", error);
    // Fallback: intentar obtener al menos la meta activa sin progresos
    try {
      const metasResponse = await axios.get(
        `${API_URL}/api/metas/usuario/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );      
      const metas: Meta[] = metasResponse.data;
      
      if (metas.length > 0) {
        const metaActual = metas.find(meta => !meta.cumplida) || metas[0];
        setProgress({
          currentWeight: metaActual.pesoActual,
          goalWeight: metaActual.pesoMeta,
          lastUpdated: metaActual.fechaInicio
        });
      } else {
        // Solo si no hay metas, usar datos mock
        setProgress({
          currentWeight: 68,
          goalWeight: 65,
          lastUpdated: "2024-06-28"
        });
      }
    } catch (fallbackError) {
      console.error("Error en fallback:", fallbackError);
      setProgress({
        currentWeight: 68,
        goalWeight: 65,
        lastUpdated: "2024-06-28"
      });
    }
  }
};



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

  // Cargar progreso cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  // Mis publicaciones
  useEffect(() => {
    const fetchMisPublicaciones = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/publicaciones/autor`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const base = res.data;
        const completas = await Promise.all(
          base.map(async (pub: any) => {
            const det = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/publicaciones/${pub.id}`
            );
            return {
              id: pub.id,
              title: pub.titulo,
              content: det.data.contenido ?? "Sin contenido",
              author: pub.autor,
              createdAt: pub.fechaCreacion ?? new Date().toISOString(),
              ejercicios: det.data.ejercicios ?? [],
            };
          })
        );
        setPublications(completas);
      } catch (err) {
        console.error("Error al cargar publicaciones del autor:", err);
      }
    };
    if (token) fetchMisPublicaciones();
  }, [token]);

  useEffect(() => {
    const fetchComunidad = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/publicaciones/rutinas`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        console.log("Respuesta de publicaciones/rutinas:", res.data);
        
        const responseData = res.data;
        const todas = responseData.content || responseData;
        
        if (!Array.isArray(todas)) {
          console.error("La respuesta no contiene un array válido:", typeof todas, todas);
          setOtrasPublicaciones([]);
          return;
        }
        
        const filtradas = todas.filter((p: any) => p.userId !== user?.id);
        setOtrasPublicaciones(filtradas);
        
      } catch (err) {
        console.error("Error al cargar otras publicaciones:", err);
        
        // Si es un error de axios, mostrar más detalles
        if (axios.isAxiosError(err)) {
          console.error("Status:", err.response?.status);
          console.error("Data:", err.response?.data);
          console.error("Headers:", err.response?.headers);
        }
        
        // Establecer array vacío en caso de error
        setOtrasPublicaciones([]);
      }
    };
    if (user) fetchComunidad();
  }, [user]);

  useEffect(() => {
    const fetchMisGrupos = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/grupos/mis`,
          {
            params: { userId: user.id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMisGrupos(data);
      } catch (err) {
        console.error("Error al cargar grupos:", err);
      }
    };
    if (token && user) fetchMisGrupos();
  }, [token, user]);

  const handleProgressUpdate = (newProgress: typeof progress) => {
    setProgress(newProgress);
    fetchProgress();
  };

  const handlePublicationAdd = (newPublication: any) => {
    setPublications([newPublication, ...publications]);
  };

  const compartirEnGrupo = async (publicacionId: number, grupoId: number) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/publicacionescompartidas/${publicacionId}/compartir`,
        null,
        {
          params: { grupoId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("¡Publicación compartida correctamente! 🎉");
    } catch (err) {
      console.error("Error al compartir:", err);
      alert("Ocurrió un error al compartir la publicación.");
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />

      {/* Botón hamburguesa */}
      <div className="flex items-center px-4 py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {progress && (
              <ProgressCard 
                progress={progress} 
                onProgressUpdate={handleProgressUpdate}
              />
            )}
            
            <CommunityPublications 
              publications={otrasPublicaciones}
              groups={misGrupos}
              onShareInGroup={compartirEnGrupo}
            />
            
            <MyPublications 
              publications={publications}
              user={user}
              onPublicationAdd={handlePublicationAdd}
              navigate={navigate}
            />

            
          </div>
          {/* COLUMNA DERECHA (1/3) */}
          <div className="space-y-6">
            <UserProfile user={user} />
            <QuickStats publications={publications} progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;