import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../service/userService";
import { getProgress, updateProgress } from "../service/progressService";
import { getPublications, createPublication } from "../service/publicationService";
import Navbar from "../components/Navbar";
import ProgressCard from "../components/ProgressCard";
import ProgressForm from "../components/ProgressForm";
import CreatePublicationForm from "../components/CreatePublicationForm";
import PublicationCard from "../components/PublicationCard";

interface User {
  name: string;
  email: string;
}

interface Progress {
  currentWeight: number;
  goalWeight: number;
  lastUpdated: string;
}

interface Publication {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    if (token) {
      getMe(token)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("❌ Error al obtener usuario:", err));

      getProgress(token)
        .then((res) => setProgress(res.data))
        .catch((err) => console.error("❌ Error al obtener progreso:", err));

      getPublications(token)
        .then((res) => setPublications(res.data))
        .catch((err) => console.error("❌ Error al obtener publicaciones:", err));
    }
  }, [token]);

  const handleProgressSubmit = (currentWeight: number, goalWeight: number) => {
    if (token) {
      updateProgress(token, currentWeight, goalWeight)
        .then((res) => setProgress(res.data))
        .catch((err) => console.error("❌ Error al actualizar progreso:", err));
    }
  };

  const handleCreatePublication = (title: string, content: string) => {
    if (token && title.trim() && content.trim()) {
      createPublication(token, title.trim(), content.trim())
        .then(() => getPublications(token))
        .then((res) => setPublications(res.data))
        .catch((err) => console.error("❌ Error al publicar:", err));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center gap-6">
      <Navbar />

      <section className="flex flex-col items-center py-8 px-4 gap-6 w-full">
        <h1 className="text-3xl font-bold text-violet-700">Dashboard</h1>

        {/* Usuario */}
        {user ? (
          <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold text-violet-700 mb-2">Información del usuario</h2>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Correo:</strong> {user.email}</p>
          </div>
        ) : (
          <p className="text-gray-600">Cargando usuario...</p>
        )}

        {/* Progreso */}
        {progress ? (
          <>
            <ProgressCard
              currentWeight={progress.currentWeight}
              goalWeight={progress.goalWeight}
              lastUpdated={progress.lastUpdated}
            />
            <div className="w-full max-w-md">
              <div className="bg-gray-300 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-violet-600 h-4 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (progress.currentWeight / progress.goalWeight) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-600">
                {progress.currentWeight} kg / Meta: {progress.goalWeight} kg
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Cargando progreso...</p>
        )}

        {/* Formulario de progreso */}
        <ProgressForm onSubmit={handleProgressSubmit} />

        {/* Formulario de publicación */}
        <CreatePublicationForm onSubmit={handleCreatePublication} />

        {/* Lista de publicaciones */}
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-violet-700 mb-4">Publicaciones</h2>
          {publications.length > 0 ? (
            publications.map((pub) => (
              <div key={pub.id} className="mb-4">
                <PublicationCard publication={pub} />
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay publicaciones aún.</p>
          )}

          <button
            onClick={() => navigate("/edit-profile")}
            className="mt-4 bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
          >
            Editar perfil
          </button>
        </div>
      </section>
    </main>
  );
}

