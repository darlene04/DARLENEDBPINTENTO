import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getUserInfo } from "../../service/authService";
import {
  Users,
  Calendar,
  MessageSquare,
  Plus,
  ArrowLeft,
  User,
  Hash,
  Clock,
  Send,
  Menu,
  Share2,
  UserPlus,              
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

/* -------------------- Tipos -------------------- */
interface Miembro {
  id: number;
  name: string;
}

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaCreacion: string;
  miembros: Miembro[];
  administrador: Miembro;
}

interface Publicacion {
  id: number;
  titulo: string;
  contenido: string | null;
  fechaCreacion: string;
  user: { id?: number; name: string };
  esCompartida?: boolean;
}

/* -------------------- Componente -------------------- */
export default function GroupDetails() {
  const { grupoId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showPublicationForm, setShowPublicationForm] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  /* ------------ Helpers ------------ */
  const avatar = (name: string) =>
    name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "?";

  /* ----------- Cargar datos ----------- */
  const cargarDatos = async () => {
    try {
      const { data: userData } = await getUserInfo();
      setUser(userData);

      const { data: gruposData } = await axios.get(`${API}/grupos`);
      setGrupo(gruposData.find((g: any) => g.id === Number(grupoId)));

      const { data: internas } = await axios.get(
        `${API}/publicaciones/grupo/por-grupo/${grupoId}`
      );
      const internasMap: Publicacion[] = (internas ?? []).map((p: any) => ({
        id: p.id,
        titulo: p.titulo,
        contenido: p.contenido,
        fechaCreacion: p.fechaCreacion,
        user: { id: p.user?.id, name: p.user?.name || "Anónimo" },
        esCompartida: false,
      }));

      /* Publicaciones compartidas */
      const { data: compartidas } = await axios.get(
        `${API}/api/publicacionescompartidas/grupo/${grupoId}`
      );
      const compartidasMap: Publicacion[] = (compartidas ?? []).map(
        (dto: any) => ({
          id: dto.publicacionId,
          titulo: dto.publicacionTitulo,
          contenido: dto.publicacionContenido,
          fechaCreacion: dto.fechaCompartida,
          user: { name: dto.autor },
          esCompartida: true,
        })
      );

      const combinadas = [...internasMap, ...compartidasMap].sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime()
      );
      setPublicaciones(combinadas);
    } catch (err) {
      console.error("Error al cargar detalles del grupo", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && grupoId) cargarDatos();
  }, [token, grupoId]);

  /* ------ Crear publicación ------ */
  const handleCrearPublicacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim() || !user) return;

    try {
      await axios.post(
        `${API}/publicaciones/grupo/crear`,
        null,
        {
          params: { titulo, contenido, userId: user.id, grupoId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitulo("");
      setContenido("");
      setShowPublicationForm(false);
      /* Actualizar lista */
      cargarDatos();
    } catch (err) {
      console.error("Error al crear publicación", err);
      alert("No se pudo crear la publicación.");
    }
  };

  /* ------ Agregar miembro (solo admin) ------ */
  const handleAgregarMiembro = async () => {
    const nuevoId = window.prompt("Ingresa el ID del usuario a agregar:");
    if (!nuevoId) return;

    try {
      await axios.post(
        `${API}/grupos/${grupoId}/agregar-miembro`,
        null,
        {
          params: { userId: nuevoId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Miembro agregado correctamente.");
      /* Refrescar datos del grupo */
      cargarDatos();
    } catch (err: any) {
      console.error("Error al agregar miembro", err);
      alert(
        err.response?.data ?? "No se pudo agregar el miembro. Revisa los datos."
      );
    }
  };

  /* ------------ LOADING / ERROR ------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!grupo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-bold text-gray-800">Grupo no encontrado</h2>
        </div>
      </div>
    );
  }

  const esMiembro = grupo.miembros.some((m) => m.id === user?.id);
  const esAdministrador = grupo.administrador?.id === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />

      {/* Header con menú */}
      <div className="flex items-center px-4 py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 p-2 ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ------------------------------------- COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            {/* ---- Tarjeta cabecera del grupo ---- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {grupo.nombre}
                  </h1>
                  <p className="text-gray-600 mb-4">{grupo.descripcion}</p>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <Hash className="w-4 h-4" />
                      {grupo.tipo}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Creado el{" "}
                      {new Date(grupo.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm opacity-90">Miembros</span>
                  </div>
                  <p className="text-2xl font-bold">{grupo.miembros.length}</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm opacity-90">Publicaciones</span>
                  </div>
                  <p className="text-2xl font-bold">{publicaciones.length}</p>
                </div>
              </div>

              {!esMiembro && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <User className="w-5 h-5" />
                    <span className="font-medium">
                      No eres miembro de este grupo
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Solicita unirte para poder crear publicaciones y participar.
                  </p>
                </div>
              )}
            </div>

            {/* ---- Publicaciones ---- */}
            {esMiembro && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Compartir con el grupo
                  </h3>
                  <button
                    onClick={() => setShowPublicationForm(!showPublicationForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva publicación
                  </button>
                </div>


                {showPublicationForm && (
                  <form onSubmit={handleCrearPublicacion} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la publicación
                      </label>
                      <input
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="¿Qué quieres compartir?"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido
                      </label>
                      <textarea
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        rows={4}
                        placeholder="Comparte tus pensamientos, experiencias o consejos..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        <Send className="w-4 h-4" />
                        Publicar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPublicationForm(false);
                          setTitulo("");
                          setContenido("");
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                Publicaciones del grupo
              </h2>

              {publicaciones.length === 0 ? (
                <p className="text-center text-gray-500">
                  No hay publicaciones aún.
                </p>
              ) : (
                <div className="space-y-4">
                  {publicaciones.map((pub) => (
                    <div
                      key={`${pub.id}-${pub.esCompartida ? "comp" : "org"}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                          {pub.titulo}
                          {pub.esCompartida && (
                            <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-xs px-2 py-0.5 rounded-full">
                              <Share2 className="w-3 h-3" />
                              Compartida
                            </span>
                          )}
                        </h3>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(pub.fechaCreacion).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 whitespace-pre-line">
                        {pub.contenido ?? "Sin contenido"}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <span className="text-xs font-semibold text-green-700">
                            {avatar(pub.user.name)}
                          </span>
                        </div>
                        <span className="font-medium">Por {pub.user.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

            <div className="space-y-6">
              {/* ---- Lista de miembros ---- */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Miembros ({grupo.miembros.length})
                  </h3>

                  {esAdministrador && (
                    <button
                      onClick={handleAgregarMiembro}
                      title="Agregar miembro"
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors duration-200"
                    >
                      <UserPlus className="w-4 h-4" />
                      Agregar
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {grupo.miembros.map((miembro) => (
                    <div key={miembro.id} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full">
                        <span className="text-xs font-bold text-white">
                          {avatar(miembro.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {miembro.name}
                        </p>
                        {miembro.id === user?.id && (
                          <span className="text-xs text-green-600 font-medium">
                            Tú
                          </span>
                        )}
                        {miembro.id === grupo.administrador?.id && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Admin)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            {/* Información adicional */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Información del grupo</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo</span>
                  <span className="font-medium text-gray-900">{grupo.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miembros</span>
                  <span className="font-medium text-gray-900">{grupo.miembros.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicaciones</span>
                  <span className="font-medium text-gray-900">{publicaciones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creado</span>
                  <span className="font-medium text-gray-900">
                    {new Date(grupo.fechaCreacion).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}