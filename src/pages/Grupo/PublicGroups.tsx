import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Menu, Users, Calendar, ArrowRight, Plus, AlertCircle } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../service/authService";

/* -------------------------------- Tipos -------------------------------- */
interface MiembroDTO {
  id: number;
  name: string;
}

interface GrupoPublicoDTO {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string; // "PUBLICO"
  miembros: MiembroDTO[];
  fechaCreacion: string;
}

interface User {
  id: number;
  name: string;
  // Agregar otros campos según tu API
}

/* ------------------------------ Componente ----------------------------- */
export default function PublicGroups() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grupos, setGrupos] = useState<GrupoPublicoDTO[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joiningGroup, setJoiningGroup] = useState<number | null>(null);

  /* ---------------------------- Cargar usuario ------------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      
      try {
        const { data } = await getUserInfo();
        setUser(data);
      } catch (err) {
        console.error("Error al obtener usuario", err);
        setError("Error al cargar la información del usuario");
      }
    };
    
    fetchUser();
  }, [token]);

  /* ---------------------------- Cargar grupos --------------------------- */
  const fetchGruposPublicos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get<GrupoPublicoDTO[]>(
        `${import.meta.env.VITE_API_URL}/grupos/publicos`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      
      setGrupos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar grupos públicos", err);
      setError("Error al cargar los grupos públicos");
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGruposPublicos();
  }, [fetchGruposPublicos]);

  /* --------------------- Unirse a un grupo público --------------------- */
  const handleUnirse = async (
    e: React.MouseEvent<HTMLButtonElement>,
    grupoId: number
  ) => {
    e.stopPropagation();
    
    if (!user) {
      alert("Inicia sesión para unirte a un grupo.");
      return;
    }

    if (!token) {
      alert("No tienes autorización. Inicia sesión nuevamente.");
      return;
    }

    // Verificar si ya es miembro
    const grupo = grupos.find(g => g.id === grupoId);
    if (grupo?.miembros.some(m => m.id === user.id)) {
      return; // Ya es miembro
    }

    try {
      setJoiningGroup(grupoId);
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/grupos/${grupoId}/unirse`,
        null,
        {
          params: { userId: user.id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar estado local
      setGrupos((prev) =>
        prev.map((g) =>
          g.id === grupoId
            ? {
                ...g,
                miembros: [...g.miembros, { id: user.id, name: user.name }],
              }
            : g
        )
      );
      
      alert("¡Te has unido al grupo exitosamente!");
    } catch (err: any) {
      console.error("Error al unirte al grupo", err);
      
      // Manejo de errores más específico
      if (err.response?.status === 409) {
        alert("Ya eres miembro de este grupo");
      } else if (err.response?.status === 404) {
        alert("El grupo no existe");
      } else if (err.response?.status === 401) {
        alert("No tienes autorización. Inicia sesión nuevamente.");
      } else {
        alert("No se pudo unir al grupo. Inténtalo de nuevo.");
      }
    } finally {
      setJoiningGroup(null);
    }
  };

  /* ---------------------------- Formato de fecha ------------------------ */
  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  /* ------------------------------- Render ------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          <p className="text-gray-600">Cargando grupos públicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />

      {/* Botón menu y crear grupo */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-white/50 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate("/grupos/crear")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Crear grupo
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Grupos Públicos</h1>
          {grupos.length > 0 && (
            <p className="text-gray-600">
              {grupos.length} grupo{grupos.length !== 1 ? 's' : ''} disponible{grupos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchGruposPublicos}
              className="ml-auto text-red-600 hover:text-red-800 underline text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de grupos */}
        {grupos.length === 0 && !error ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No hay grupos públicos disponibles.</p>
            <p className="text-gray-500 text-sm mt-2">
              ¡Sé el primero en crear uno!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grupos.map((grupo) => {
              const esMiembro = user ? grupo.miembros.some((m) => m.id === user.id) : false;
              const isJoining = joiningGroup === grupo.id;
              
              return (
                <div
                  key={grupo.id}
                  onClick={() => navigate(`/grupos/${grupo.id}`)}
                  className="group cursor-pointer border border-gray-200 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="line-clamp-2">{grupo.nombre}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {grupo.descripcion || "Sin descripción"}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-4 text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {grupo.miembros.length} miembro{grupo.miembros.length !== 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatearFecha(grupo.fechaCreacion)}
                    </span>
                  </div>

                  {/* Botón Unirse / Miembro */}
                  <button
                    onClick={(e) => handleUnirse(e, grupo.id)}
                    disabled={esMiembro || isJoining || !user}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      esMiembro
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                        : isJoining
                        ? "bg-green-400 text-white cursor-not-allowed"
                        : !user
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow"
                    }`}
                  >
                    {isJoining ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Uniéndose...
                      </span>
                    ) : esMiembro ? (
                      "✓ Miembro"
                    ) : !user ? (
                      "Inicia sesión"
                    ) : (
                      "Unirse"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}