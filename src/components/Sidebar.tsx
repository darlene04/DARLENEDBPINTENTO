import { X, Home, User, LogOut, Dumbbell,Utensils, Group } from "lucide-react"; // Asegúrate de importar Dumbbell
import { Link } from "react-router-dom";


export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed top-16 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Menú</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="p-4 space-y-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-violet-600">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <Link to="/rutinas" className="flex items-center gap-2 text-gray-700 hover:text-violet-600">
          <Dumbbell className="w-4 h-4" />
          Rutinas
        </Link>
        <Link
        to="/planes-alimentacion"
        className="flex items-center gap-2 text-gray-700 hover:text-lime-600"
        >
          <Utensils className="w-4 h-4" />
          Planes Alimenticios
          </Link>
        <Link to="/grupos/publicos" className="flex items-center gap-2 text-gray-700 hover:text-violet-600">
          <Group className="w-4 h-4" />
          Grupos
        </Link>
        <Link to="/perfil" className="flex items-center gap-2 text-gray-700 hover:text-violet-600">
          <User className="w-4 h-4" />
          Perfil
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
}
