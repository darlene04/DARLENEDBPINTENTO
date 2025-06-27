import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-violet-700 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <div className="text-2xl font-bold tracking-wide cursor-pointer" onClick={() => navigate("/dashboard")}>
        VidaFit
      </div>

      {token && (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-white text-violet-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
          >
            Editar perfil
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
