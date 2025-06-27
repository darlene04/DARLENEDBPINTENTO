import { useState } from "react";
import { register } from "../service/authService";
import { useNavigate, Link } from "react-router-dom";

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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">
          Crear cuenta
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-600"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
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
            {loading ? "Registrando..." : "Registrarse"}
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
