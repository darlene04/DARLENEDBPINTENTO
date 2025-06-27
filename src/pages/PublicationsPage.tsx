import { useEffect, useState } from "react";
import { getPublications } from "../service/publicationService";
import { useAuth } from "../context/AuthContext";
import PublicationCard from "../components/PublicationCard";

interface Publication {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function PublicationsPage() {
  const { token } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (token) {
      getPublications(token)
        .then((res) => setPublications(res.data))
        .catch((err) =>
          console.error("❌ Error al obtener publicaciones:", err)
        )
        .finally(() => setLoading(false));
    }
  }, [token]);

  const filtered = publications.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  );

  const visiblePublications = filtered.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-violet-700 mb-4">Publicaciones</h1>

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por título o autor"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      {loading ? (
        <p className="text-center text-gray-500">Cargando publicaciones...</p>
      ) : visiblePublications.length === 0 ? (
        <p className="text-center text-gray-600">No hay publicaciones encontradas.</p>
      ) : (
        <div className="w-full max-w-md space-y-4">
          {visiblePublications.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}

          {visibleCount < filtered.length && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="mt-4 w-full py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
            >
              Ver más
            </button>
          )}
        </div>
      )}
    </main>
  );
}


