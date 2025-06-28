import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-white px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">Bienvenido a VidaFit</h1>
        <p className="text-lg text-gray-700 mb-6">
          Tu espacio personal para registrar tu progreso y compartir hábitos saludables.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-white border border-green-600 hover:bg-green-100 text-green-700 font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </main>
  );
}
