import { useState } from "react";
import { login } from "../service/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      const token = response.data.token;
      setToken(token);
      navigate("/dashboard");
    } catch (error) {
      alert("❌ Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">
          Iniciar sesión
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-600"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-700">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-violet-600 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </main>
  );
}

