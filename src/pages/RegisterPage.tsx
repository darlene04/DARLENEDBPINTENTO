import { useState } from "react";
import { register } from "../service/authService";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      alert("✅ Registro exitoso. Ahora inicia sesión.");
      navigate("/login");
    } catch (error) {
      alert("❌ Error al registrarse. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-pink-100 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-violet-500 rounded-full">
            <UserPlus className="text-white w-5 h-5" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Crear cuenta</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Únete a VidaFit y empieza tu transformación
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Ana García"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="ana@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold py-2.5 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Registrarse
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-700">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-violet-600 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
