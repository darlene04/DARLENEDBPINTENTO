import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Ilustración animada del 404 */}
        <div className="mb-8 relative">
          <div className="text-8xl font-bold text-green-200 select-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center animate-bounce">
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Título y descripción */}
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Oops! Página no encontrada
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Parece que la página que buscas no existe o fue movida a otra ubicación. 
            No te preocupes, te ayudamos a encontrar tu camino.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </button>
          
          <button
            onClick={goBack}
            className="w-full bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 border-2 border-green-200 hover:border-green-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver atrás
          </button>
        </div>

        {/* Sugerencias adicionales */}
        <div className="mt-8 p-4 bg-white/50 rounded-lg backdrop-blur-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            ¿Necesitas ayuda?
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Verifica que la URL esté escrita correctamente</p>
            <p>• Intenta usar el menú de navegación</p>
            <p>• Regresa a la página principal</p>
          </div>
        </div>
      </div>
    </div>
  );
}