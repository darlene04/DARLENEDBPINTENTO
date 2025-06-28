import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login as loginRequest } from "../service/authService";
import { useAuth } from "../context/AuthContext";

const LoginInterface: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  /* Redirige apenas exista token */
  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Rellena usuario y contraseña.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginRequest(email, password);
      if (!data?.token) throw new Error("La respuesta no trae token.");
      setToken(data.token);           // contexto + localStorage
      // No navegamos aquí; useEffect lo hará cuando setToken termine
      console.log("Login OK, token guardado");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl mb-4 shadow-sm">
            <div className="w-6 h-6 border-2 border-white rounded-md relative">
              <div className="absolute inset-0.5 border border-white rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">LOGIN</h1>
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
            <Mail className="absolute inset-y-0 left-0 ml-3 my-auto h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute inset-y-0 left-0 ml-3 my-auto h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Forgot */}
          <div className="text-right">
            <button
              type="button"
              className="text-pink-500 hover:text-pink-600 text-sm"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Botón */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : `bg-gradient-to-r from-pink-500 to-pink-600 ${
                  hover ? "scale-105 shadow-lg" : "hover:shadow-lg"
                }`
          }`}
        >
          {loading ? "Entrando…" : "LOGIN"}
        </button>
      </div>
    </div>
  );
};

export default LoginInterface;
