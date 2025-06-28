import { useState } from "react";

interface ProgressFormProps {
  onSubmit: (currentWeight: number, goalWeight: number) => void;
}

export default function ProgressForm({ onSubmit }: ProgressFormProps) {
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const current = parseFloat(currentWeight);
    const goal = parseFloat(goalWeight);
    if (!isNaN(current) && !isNaN(goal)) {
      onSubmit(current, goal);
      setCurrentWeight("");
      setGoalWeight("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-lg font-bold text-violet-700">Actualizar progreso</h2>
      <div>
        <label className="block text-sm">Peso actual (kg)</label>
        <input
          type="number"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm">Peso meta (kg)</label>
        <input
          type="number"
          value={goalWeight}
          onChange={(e) => setGoalWeight(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded">
        Guardar
      </button>
    </form>
  );
}
