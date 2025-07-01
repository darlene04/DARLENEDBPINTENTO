import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Users, 
  Globe, 
  Lock, 
  Edit3, 
  UserPlus,
  Crown,
  Menu
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../service/authService";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
const API_URL = import.meta.env.API_URL;

interface Miembro {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Administrador {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  esPublico: boolean;
  miembros: Miembro[];
  administrador: Administrador;
}

const MisGruposPage: React.FC = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserAndGrupos = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData.data);

        const response = await axios.get(`${API_URL}/grupos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allGrupos: Grupo[] = response.data;

        const misGrupos = allGrupos.filter((grupo) =>
          grupo.miembros.some((miembro) => miembro.id === userData.data.id)
        );

        setGrupos(misGrupos);
      } catch (error) {
        console.error("Error al obtener grupos o usuario", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserAndGrupos();
  }, [token]);

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando grupos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />

      {/* Menu toggle */}
      <div className="flex items-center px-4 py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-green-500" />
            Mis Grupos
          </h1>
          <p className="text-gray-600 mt-2">
            Administra y participa en tus grupos de fitness
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Grupos</p>
                <p className="text-2xl font-bold text-gray-900">{grupos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Como Admin</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grupos.filter(g => g.administrador.id === user?.id).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Como Miembro</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grupos.filter(g => g.administrador.id !== user?.id).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Groups List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tus Grupos</h2>
            <Link
              to="/grupos/crear"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Crear Grupo
            </Link>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-red-600 font-medium">No se pudo obtener el usuario</p>
              <p className="text-gray-500 text-sm">Intenta recargar la página</p>
            </div>
          ) : grupos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes grupos aún
              </h3>
              <p className="text-gray-500 mb-6">
                Únete a un grupo existente o crea uno nuevo para comenzar
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/grupos/crear"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Grupo
                </Link>
                <Link
                  to="/grupos/explorar"
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Explorar Grupos
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {grupos.map((grupo) => (
                <div
                  key={grupo.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-green-200"
                >
                  {/* Group Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {grupo.nombre}
                        </h3>
                        <div className="flex items-center gap-1">
                          {grupo.esPublico ? (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              <Globe className="w-3 h-3" />
                              Público
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              <Lock className="w-3 h-3" />
                              Privado
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {grupo.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Group Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{grupo.miembros.length} miembros</span>
                    </div>
                    {grupo.administrador.id === user?.id && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Crown className="w-4 h-4" />
                        <span>Administrador</span>
                      </div>
                    )}
                  </div>

                  {/* Administrator Info */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full">
                      <span className="text-xs font-semibold text-white">
                        {getInitials(grupo.administrador.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {grupo.administrador.name}
                      </p>
                      <p className="text-xs text-gray-500">Administrador</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/grupos/${grupo.id}`}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-center text-sm font-medium"
                    >
                      Ver Grupo
                    </Link>
                    {grupo.administrador.id === user?.id && (
                      <Link
                        to={`/grupos/${grupo.id}/editar`}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisGruposPage;