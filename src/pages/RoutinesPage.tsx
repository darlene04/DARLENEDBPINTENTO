import React, { useEffect, useState } from "react";
import { getAllRoutines } from "../service/authService";
import { Dumbbell } from "lucide-react";
import Navbar from "../components/Navbar";

interface Routine {
  id: number;
  titulo: string;
  descripcion: string;
  autor: string;
  fecha: string;
}

const RoutinesPage: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    getAllRoutines()
      .then((res) => setRoutines(res.data))
      .catch((err) => {
        console.error("Error al cargar rutinas:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Dumbbell className="w-6 h-6 text-violet-600" />
          Rutinas Disponibles
        </h1>

        {routines.length === 0 ? (
          <p className="text-gray-600">No hay rutinas disponibles por ahora.</p>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{routine.titulo}</h2>
                <p className="text-gray-700 text-sm mb-2">{routine.descripcion}</p>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Autor: {routine.autor}</span>
                  <span>{new Date(routine.fecha).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutinesPage;
