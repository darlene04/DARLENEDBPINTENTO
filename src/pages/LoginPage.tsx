import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { login as loginRequest } from "../service/authService";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const LoginInterface: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token, setToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const isLoginPage = ["/login", "/auth/login"].includes(location.pathname);
  
    if (token && isLoginPage) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, location.pathname, navigate]);
  
  
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Rellena el correo y la contraseña.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginRequest(email, password);
      if (!data?.token) throw new Error("La respuesta no trae token.");
      setToken(data.token);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Credenciales incorrectas o servidor caído."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log("Token:", token);
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-pink-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-500 rounded-full mb-4">
            <LogIn className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Bienvenida de nuevo</h1>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión para continuar</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-violet-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className={`w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg"
          }`}
        >
          {loading ? "Entrando…" : (
            <>
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          ¿No tienes una cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-violet-600 font-semibold hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>
    </main>
  );
};

export default LoginInterface;