import React, { useEffect, useState } from "react";
import { getAllRoutines } from "../service/authService";
import { Dumbbell, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

interface Routine {
  id_publicacion: number;
  titulo: string;
  contenido: string | null;
  nombreRutina: string;
  descripcion: string | null; // Added descripcion property
  duracion: number;
  frecuencia: string;
  nivel: string | null;
  userId: number;
  ejercicios: {
    id: number;
    nombre: string;
    descripcion: string | null;
    series: number;
    repeticiones: number;
    descansoSegundos: number;
    pesoKg: number;
  }[];
}

const RoutinesPage: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    getAllRoutines()
      .then((res) => {
        const data = res.data.map((r: any) => ({
          ...r,
          ejercicios: r.ejercicios || [],
        }));
        setRoutines(data);
      })
      .catch((err) => {
        console.error("Error al cargar rutinas:", err);
      });
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />

      <div className="flex items-center justify-start px-4 py-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto bg-white/40 rounded-xl shadow-md mt-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-green-600" />
            Rutinas Disponibles
          </h1>

          <button
            onClick={() => navigate("/rutinas/crear")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Nueva rutina
          </button>
        </div>

        {routines.length === 0 ? (
          <p className="text-gray-600">No hay rutinas disponibles por ahora.</p>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => {
              const getDifficultyColor = (nivel: string | null) => {
                switch (nivel?.toLowerCase()) {
                  case 'principiante':
                  case 'fácil':
                  case 'beginner':
                    return 'bg-green-500';
                  case 'intermedio':
                  case 'intermediate':
                    return 'bg-cyan-500';
                  case 'avanzado':
                  case 'difícil':
                  case 'advanced':
                    return 'bg-teal-600';
                  default:
                    return 'bg-gray-500';
                }
              };

              return (
                <div
                  key={routine.id_publicacion}
                  onClick={() => navigate(`/rutinas/${routine.id_publicacion}`)}
                  className="cursor-pointer bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 border border-white/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getDifficultyColor(routine.nivel)}`}>
                      {routine.nivel || 'Sin nivel'}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">{routine.titulo}</h2>
                  <p className="text-gray-600 text-sm mb-4">{routine.descripcion ?? "Sin descripción."}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3 h-3" />
                        {routine.ejercicios?.length ?? 0} ejercicios
                        </span>
                      <span>{routine.duracion} días</span>
                      <span>{routine.frecuencia}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center gap-4">
  <button
    disabled={page === 0}
    onClick={() => setPage((p) => p - 1)}
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
  >
    Anterior
  </button>

  <span className="self-center text-gray-700 font-medium">
    Página {page + 1} de {totalPages}
  </span>

  <button
    disabled={page + 1 >= totalPages}
    onClick={() => setPage((p) => p + 1)}
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
  >
    Siguiente
  </button>
</div>

    </div>
  );
};

export default RoutinesPage;