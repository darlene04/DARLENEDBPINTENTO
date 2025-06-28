import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-extrabold text-violet-700 mb-2">404</h1>
      <p className="text-2xl font-medium text-gray-700 mb-4">
        Página no encontrada
      </p>
      <p className="text-gray-500 mb-8">
        Lo sentimos, la ruta que buscaste no existe o fue movida.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-violet-700 transition"
      >
        Volver al inicio
      </button>
    </main>
  );
}
