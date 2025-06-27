interface ProgressCardProps {
  currentWeight: number;
  goalWeight: number;
  lastUpdated: string;
}

export default function ProgressCard({
  currentWeight,
  goalWeight,
  lastUpdated,
}: ProgressCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-violet-700 mb-4">📈 Tu Progreso</h2>

      <div className="flex justify-between text-base text-gray-700 mb-2">
        <span>Peso actual:</span>
        <span className="font-semibold">{currentWeight} kg</span>
      </div>

      <div className="flex justify-between text-base text-gray-700 mb-2">
        <span>Meta:</span>
        <span className="font-semibold">{goalWeight} kg</span>
      </div>

      <p className="text-sm text-gray-500 text-right mt-4 italic">
        Última actualización: {new Date(lastUpdated).toLocaleDateString()}
      </p>
    </div>
  );
}