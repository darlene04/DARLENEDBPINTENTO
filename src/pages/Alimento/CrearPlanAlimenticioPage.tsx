import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Utensils, Menu, AlertCircle, CheckCircle, ArrowLeft, Clock, Target, Shield } from "lucide-react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const CrearPlanAlimentacionPage: React.FC = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tipoDieta, setTipoDieta] = useState("");
  const [calorias, setCalorias] = useState<number | undefined>(undefined);
  const [objetivos, setObjetivos] = useState("");
  const [restricciones, setRestricciones] = useState("");

  // Estados de UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Validación del formulario
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!titulo.trim()) {
      newErrors.titulo = "El título es obligatorio";
    } else if (titulo.length < 5) {
      newErrors.titulo = "El título debe tener al menos 5 caracteres";
    }

    if (!contenido.trim()) {
      newErrors.contenido = "La descripción es obligatoria";
    } else if (contenido.length < 20) {
      newErrors.contenido = "La descripción debe tener al menos 20 caracteres";
    }

    if (!tipoDieta.trim()) {
      newErrors.tipoDieta = "El tipo de dieta es obligatorio";
    }

    if (!objetivos) {
      newErrors.objetivos = "Debes seleccionar un objetivo";
    }

    if (calorias && (calorias < 800 || calorias > 5000)) {
      newErrors.calorias = "Las calorías deben estar entre 800 y 5000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardarPlan = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/publicaciones/planes`,
        {
          titulo: titulo.trim(),
          contenido: contenido.trim(),
          tipoDieta: tipoDieta.trim(),
          calorias,
          objetivos,
          restricciones: restricciones.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/planes-alimentacion");
      }, 1500);

    } catch (err: any) {
      console.error("Error al guardar plan:", err);
      setErrors({ 
        submit: err.response?.data?.message || "Ocurrió un error al guardar el plan de alimentación." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tiposDieta = [
    "Mediterránea", "Keto", "Vegetariana", "Vegana", "Paleo", 
    "Intermitente", "Baja en carbohidratos", "Alta en proteínas", "Equilibrada"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50 to-teal-50">
      <Navbar />
      
      {/* Header con botón de menú y navegación */}
      <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 hover:text-lime-600 focus:outline-none p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate("/planes-alimentacion")}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver a planes</span>
          </button>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle className="w-5 h-5" />
          <span>¡Plan guardado exitosamente!</span>
        </div>
      )}

      {/* Contenido principal */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-emerald-600 to-lime-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              Crear nuevo plan de alimentación
            </h1>
            <p className="text-emerald-100 mt-2">
              Diseña un plan personalizado para ayudar a otros a alcanzar sus objetivos nutricionales
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            {/* Error general */}
            {errors.submit && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Error al guardar</p>
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Información básica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del plan *
                    </label>
                    <input
                      value={titulo}
                      onChange={(e) => {
                        setTitulo(e.target.value);
                        if (errors.titulo) setErrors(prev => ({...prev, titulo: ""}));
                      }}
                      placeholder="Ej: Plan Mediterráneo para Principiantes"
                      className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.titulo 
                          ? "border-red-300 focus:ring-red-500 bg-red-50" 
                          : "border-gray-300 focus:ring-emerald-500 hover:border-gray-400"
                      }`}
                    />
                    {errors.titulo && (
                      <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de dieta *
                    </label>
                    <select
                      value={tipoDieta}
                      onChange={(e) => {
                        setTipoDieta(e.target.value);
                        if (errors.tipoDieta) setErrors(prev => ({...prev, tipoDieta: ""}));
                      }}
                      className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.tipoDieta 
                          ? "border-red-300 focus:ring-red-500 bg-red-50" 
                          : "border-gray-300 focus:ring-emerald-500 hover:border-gray-400"
                      }`}
                    >
                      <option value="">-- Selecciona el tipo --</option>
                      {tiposDieta.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    {errors.tipoDieta && (
                      <p className="text-red-600 text-sm mt-1">{errors.tipoDieta}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Objetivos y calorías */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Objetivos y especificaciones
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objetivo principal *
                    </label>
                    <select
                      value={objetivos}
                      onChange={(e) => {
                        setObjetivos(e.target.value);
                        if (errors.objetivos) setErrors(prev => ({...prev, objetivos: ""}));
                      }}
                      className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.objetivos 
                          ? "border-red-300 focus:ring-red-500 bg-red-50" 
                          : "border-gray-300 focus:ring-emerald-500 hover:border-gray-400"
                      }`}
                    >
                      <option value="">-- Selecciona un objetivo --</option>
                      <option value="Pérdida de grasa corporal">Pérdida de grasa corporal</option>
                      <option value="Subir masa muscular">Subir masa muscular</option>
                      <option value="Mantener peso">Mantener peso</option>
                      <option value="Salud general">Salud general</option>
                      <option value="Rendimiento deportivo">Rendimiento deportivo</option>
                    </select>
                    {errors.objetivos && (
                      <p className="text-red-600 text-sm mt-1">{errors.objetivos}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calorías estimadas (opcional)
                    </label>
                    <input
                      type="number"
                      value={calorias || ""}
                      onChange={(e) => {
                        setCalorias(e.target.value ? Number(e.target.value) : undefined);
                        if (errors.calorias) setErrors(prev => ({...prev, calorias: ""}));
                      }}
                      placeholder="Ej: 2000"
                      min="800"
                      max="5000"
                      className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.calorias 
                          ? "border-red-300 focus:ring-red-500 bg-red-50" 
                          : "border-gray-300 focus:ring-emerald-500 hover:border-gray-400"
                      }`}
                    />
                    {errors.calorias && (
                      <p className="text-red-600 text-sm mt-1">{errors.calorias}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Descripción detallada
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del plan *
                  </label>
                  <textarea
                    value={contenido}
                    onChange={(e) => {
                      setContenido(e.target.value);
                      if (errors.contenido) setErrors(prev => ({...prev, contenido: ""}));
                    }}
                    placeholder="Describe el plan: qué incluye, cómo seguirlo, beneficios esperados, duración recomendada, etc."
                    rows={6}
                    className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.contenido 
                        ? "border-red-300 focus:ring-red-500 bg-red-50" 
                        : "border-gray-300 focus:ring-emerald-500 hover:border-gray-400"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.contenido && (
                      <p className="text-red-600 text-sm">{errors.contenido}</p>
                    )}
                    <p className="text-gray-500 text-sm ml-auto">
                      {contenido.length} caracteres
                    </p>
                  </div>
                </div>
              </div>

              {/* Restricciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Restricciones y consideraciones
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restricciones alimentarias (opcional)
                  </label>
                  <input
                    value={restricciones}
                    onChange={(e) => setRestricciones(e.target.value)}
                    placeholder="Ej: sin gluten, sin lactosa, sin frutos secos, apto para diabéticos"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-gray-400 transition-colors"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Especifica si el plan tiene restricciones o es apto para condiciones específicas
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 mt-8">
              <button
                onClick={() => navigate("/planes-alimentacion")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                Cancelar
              </button>
              
              <button
                onClick={handleGuardarPlan}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar plan de alimentación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPlanAlimentacionPage;