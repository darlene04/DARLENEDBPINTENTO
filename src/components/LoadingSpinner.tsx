export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-violet-700">
      <div className="w-14 h-14 border-4 border-dashed border-violet-600 rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-semibold tracking-wide">Cargando...</p>
    </div>
  );
}

