import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPublications } from "../service/publicationService";
import PublicationCard from "../components/PublicationCard";
import LoadingSpinner from "../components/LoadingSpinner";

interface Publication {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function PublicProfilePage() {
  const { token } = useAuth();
  const { username } = useParams();
  const [userPublications, setUserPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && username) {
      getPublications(token)
        .then((res) => {
          const filtered = res.data.filter(
            (pub: Publication) => pub.author === username
          );
          setUserPublications(filtered);
        })
        .catch((err) => console.error("❌ Error:", err))
        .finally(() => setLoading(false));
    }
  }, [token, username]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-violet-700 text-center mb-6">
        Perfil público de <span className="capitalize">{username}</span>
        </h1>


      {loading ? (
        <LoadingSpinner />
      ) : userPublications.length === 0 ? (
        <p className="text-center text-gray-600">
          Este usuario no tiene publicaciones aún.
        </p>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {userPublications.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>
      )}
    </main>
  );
}
