import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Play, Eye, Clock, Flame, BarChart3, Menu, Dumbbell } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ComentarioSection from "../../components/ComentarioSection";
interface Ejercicio {
  id: number;
  nombre: string;
  descripcion: string;
  series: number;
  repeticiones: number;
  descansoSegundos: number;
  pesoKg: number;
  imagenUrl?: string;
}

interface Rutina {
  titulo: string;
  descripcion: string;
  nombreRutina: string;
  duracion: number;
  frecuencia: string;
  nivel: string | null;
  fecha: string;
  autor: string;
  ejercicios: Ejercicio[];
}

const DetalleRutinaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/publicaciones/rutinas/${id}`);
        setRutina(res.data);
      } catch (err) {
        console.error("Error al cargar rutina:", err);
        setError("Error al cargar los detalles de la rutina.");
      } finally {
        setLoading(false);
      }
    };

    fetchRutina();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Cargando rutina...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!rutina) return null;

  const getNivelColor = (nivel?: string | null) => {
    const v = nivel?.toLowerCase();
    switch (v) {
      case 'easy':
      case 'fácil':
        return 'bg-green-100 text-green-700';
      case 'medium':
      case 'medio':
        return 'bg-cyan-100 text-cyan-700';
      case 'hard':
      case 'difícil':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />
      
      <div className="flex items-center justify-start px-4 py-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 focus:outline-none p-2 rounded-lg hover:bg-white/50"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              <div className="relative h-80 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
                {rutina.ejercicios.length > 0 && rutina.ejercicios[0].imagenUrl ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL}${rutina.ejercicios[0].imagenUrl}`}
                    alt={rutina.ejercicios[0].nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200" style={{display: rutina.ejercicios.length > 0 && rutina.ejercicios[0].imagenUrl ? 'none' : 'flex'}}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Dumbbell className="w-10 h-10 text-gray-500" />
                    </div>
                    <div className="text-lg text-gray-600 font-medium">Rutina de Ejercicios</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <button className="w-full bg-gradient-to-r from-green-400 to-cyan-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:from-green-500 hover:to-cyan-600 transition-all transform hover:scale-105">
                  <Play className="w-5 h-5" />
                  Comenzar Rutina
                </button>
                <button className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                  <Eye className="w-5 h-5" />
                  Vista Previa
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            
            <button
              onClick={() => navigate(-1)}
              className="text-green-600 hover:text-green-800 flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              
              <div className="mb-6">
                <div className="flex items-center gap-3 text-sm text-green-600 font-medium mb-2">
                  <Dumbbell className="w-4 h-4" />
                  {rutina.nombreRutina}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{rutina.titulo}</h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-bold text-cyan-500">{rutina.autor}</span>
                  <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">Entrenador Certificado</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-green-100 px-4 py-3 rounded-xl">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">{rutina.duracion} mins</span>
                  </div>
                  <div className="flex items-center gap-3 bg-cyan-100 px-4 py-3 rounded-xl">
                    <Flame className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold text-cyan-700">~{Math.round(rutina.duracion * 1.8)} kcal</span>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${getNivelColor(rutina.nivel)}`}>
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-semibold">{rutina.nivel}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-teal-100 px-4 py-3 rounded-xl">
                    <span className="font-semibold text-teal-700">{rutina.frecuencia}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Descripción de la Rutina</h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{rutina.descripcion}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-sm font-medium text-gray-500">Fecha de Publicación</span>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(rutina.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total de Ejercicios</span>
                  <div className="text-lg font-semibold text-gray-900">{rutina.ejercicios.length} ejercicios</div>
                </div>
              </div>
            </div>

{/* Sección de Comentarios */}
<div className="bg-white rounded-2xl shadow-lg p-8">
                        <ComentarioSection publicacionId={parseInt(id || "0")} />
                        </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ejercicios de la Rutina</h2>
              <div className="space-y-6">
                {rutina.ejercicios.map((ej, index) => (
                  <div key={ej.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">{ej.nombre}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{ej.descripcion}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{ej.series}</div>
                            <div className="text-sm text-green-600 font-medium">Series</div>
                          </div>
                          <div className="text-center p-3 bg-cyan-50 rounded-lg">
                            <div className="text-2xl font-bold text-cyan-600">{ej.repeticiones}</div>
                            <div className="text-sm text-cyan-600 font-medium">Reps</div>
                          </div>
                          <div className="text-center p-3 bg-teal-50 rounded-lg">
                            <div className="text-2xl font-bold text-teal-600">{ej.descansoSegundos}s</div>
                            <div className="text-sm text-teal-600 font-medium">Descanso</div>
                          </div>
                          <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <div className="text-2xl font-bold text-emerald-600">{ej.pesoKg}kg</div>
                            <div className="text-sm text-emerald-600 font-medium">Peso</div>
                          </div>
                        </div>
                      </div>

                      {ej.imagenUrl && (
                        <div className="lg:w-48 flex-shrink-0">
                          <img
                            src={`${import.meta.env.VITE_API_URL}${ej.imagenUrl}`}
                            alt={ej.nombre}
                            className="w-full h-32 lg:h-40 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleRutinaPage;