// components/ProgressCard.tsx
import React, { useState } from "react";
import { Target, TrendingUp, Edit3, Calendar, Weight } from "lucide-react";

interface ProgressCardProps {
  progress: {
    currentWeight: number;
    goalWeight: number;
    lastUpdated: string;
  };
  onProgressUpdate: (newProgress: any) => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress, onProgressUpdate }) => {
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const progressPercentage = Math.min(
    100,
    (progress.currentWeight / progress.goalWeight) * 100
  );
  const weightToLose = Math.max(0, progress.currentWeight - progress.goalWeight);

  const handleProgressSubmit = () => {
    if (newWeight && newGoal) {
      const newProgress = {
        currentWeight: parseFloat(newWeight),
        goalWeight: parseFloat(newGoal),
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      onProgressUpdate(newProgress);
      setNewWeight("");
      setNewGoal("");
      setShowProgressForm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Tu Progreso
        </h2>
        <button
          onClick={() => setShowProgressForm(!showProgressForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          <Edit3 className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Weight className="w-5 h-5" />
            <span className="text-sm opacity-90">Peso Actual</span>
          </div>
          <p className="text-2xl font-bold">{progress.currentWeight} kg</p>
        </div>
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm opacity-90">Meta</span>
          </div>
          <p className="text-2xl font-bold">{progress.goalWeight} kg</p>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm opacity-90">Por Perder</span>
          </div>
          <p className="text-2xl font-bold">{weightToLose.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso hacia tu meta</span>
          <span>{(100 - progressPercentage).toFixed(1)}% restante</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${100 - progressPercentage}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        Última actualización: {new Date(progress.lastUpdated).toLocaleDateString()}
      </p>

      {/* Formulario de actualización */}
      {showProgressForm && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Actualizar Progreso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso Actual (kg)
              </label>
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="70"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta (kg)
              </label>
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="65"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleProgressSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Guardar
            </button>
            <button
              onClick={() => setShowProgressForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;