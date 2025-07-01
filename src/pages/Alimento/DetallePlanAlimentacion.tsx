import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Flame, Clock3, Target, Star, Users, ChefHat, Apple } from "lucide-react";
import ComentarioSection from "../../components/ComentarioSection";

interface PlanAlimentacion {
  id_publicacion: number;
  titulo: string;
  contenido: string;
  tipoDieta: string;
  calorias: number;
  objetivos: string;
  restricciones: string;
}

const DetallePlanAlimentacion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<PlanAlimentacion | null>(null);
  const [rutinasRelacionadas, setRutinasRelacionadas] = useState<any[]>([]);
  const [recetasRelacionadas, setRecetasRelacionadas] = useState<PlanAlimentacion[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/publicaciones/planes/${id}`)
      .then((res) => {
        const planData = res.data;
        setPlan(planData);

        if (planData.objetivos) {
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/publicaciones/rutinas/buscar`, {
              params: { objetivo: planData.objetivos },
            })
            .then((res2) => setRutinasRelacionadas(res2.data))
            .catch((err) => console.error("Error al obtener rutinas:", err));

          axios
            .get(`${import.meta.env.VITE_API_URL}/api/publicaciones/planes`)
            .then((res3) => {
              const relacionadas = res3.data.filter(
                (p: PlanAlimentacion) =>
                  p.objetivos === planData.objetivos && p.id_publicacion !== planData.id_publicacion
              );
              setRecetasRelacionadas(relacionadas);
            })
            .catch((err) => console.error("Error al obtener recetas:", err));
        }
      })
      .catch((err) => {
        console.error("Error al obtener el plan:", err);
        alert("No se pudo cargar el detalle del plan.");
      });
  }, [id]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <Link
            to="/planes-alimentacion"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver a planes
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-6 h-6 text-white/80" />
                <span className="text-white/80 font-medium">{plan.tipoDieta}</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {plan.titulo}
              </h1>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <Clock3 className="w-6 h-6 text-white mb-2 mx-auto" />
                  <p className="text-2xl font-bold text-white">40</p>
                  <p className="text-sm text-white/80">minutos</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <Flame className="w-6 h-6 text-white mb-2 mx-auto" />
                  <p className="text-2xl font-bold text-white">{plan.calorias}</p>
                  <p className="text-sm text-white/80">calorías</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <Target className="w-6 h-6 text-white mb-2 mx-auto" />
                  <p className="text-2xl font-bold text-white">{plan.objetivos.split(",").length}</p>
                  <p className="text-sm text-white/80">objetivos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white/90">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">4.8</span>
                <span className="text-white/70">(127 valoraciones)</span>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src="https://media.istockphoto.com/id/1472680285/es/foto/comida-saludable-con-pollo-a-la-parrilla-arroz-ensalada-y-verduras-servida-por-una-mujer.jpg?s=612x612&w=0&k=20&c=RafCzs-2byU6HSC2hbEkT07ZsZ5Q7j_XfAxCsXT6_f0="
                  alt="Plan alimenticio"
                  className="rounded-3xl shadow-2xl w-full max-w-lg mx-auto object-cover border-4 border-white/20"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-3 shadow-xl">
                  <Apple className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                Descripción del Plan
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {plan.contenido}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {plan.objetivos.split(",").map((objetivo, index) => (
                    <span
                      key={index}
                      className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {objetivo.trim()}
                    </span>
                  ))}
                </div>
              </div>
              
              {plan.restricciones && (
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">Restricciones</h3>
                  <p className="text-amber-700">{plan.restricciones}</p>
                </div>
              )}
            </div>
            {/* Sección de Comentarios */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                    <ComentarioSection publicacionId={parseInt(id || "0")} />
                </div>
          </div>
          
          <div className="space-y-8">
            {recetasRelacionadas.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-600" />
                  Otros planes con el mismo objetivo
                </h3>
                <div className="space-y-3">
                  {recetasRelacionadas.slice(0, 3).map((receta) => (
                    <Link
                      key={receta.id_publicacion}
                      to={`/planes-alimentacion/${receta.id_publicacion}`}
                      className="block bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all group"
                    >
                      <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                        {receta.titulo}
                      </h4>
                      <p className="text-sm text-gray-600">{receta.tipoDieta}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Flame className="w-3 h-3" />
                        {receta.calorias} cal
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {rutinasRelacionadas.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-600" />
                  Rutinas recomendadas
                </h3>
                <div className="space-y-3">
                  {rutinasRelacionadas.slice(0, 3).map((rutina) => (
                    <div
                      key={rutina.id_publicacion}
                      className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100 hover:border-cyan-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">{rutina.titulo}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {rutina.descripcion?.slice(0, 80)}...
                      </p>
                      <Link
                        to={`/rutinas/${rutina.id_publicacion}`}
                        className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-medium hover:underline transition-colors"
                      >
                        Ver rutina
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePlanAlimentacion;