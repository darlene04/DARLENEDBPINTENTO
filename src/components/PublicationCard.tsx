import { Link } from "react-router-dom";
interface Publication {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PublicationCardProps {
  publication: Publication;
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 w-full max-w-md">
      <h2 className="text-xl font-bold text-violet-700 mb-2">
        {publication.title}
      </h2>

      <p className="text-base text-gray-700 mb-3 whitespace-pre-wrap">
        {publication.content}
      </p>

      <p className="text-sm text-gray-500">
        Publicado por{" "}
        <Link
          to={`/profile/${publication.author}`}
          className="font-medium text-violet-700 underline hover:text-violet-900"
        >
          {publication.author}
        </Link>{" "}
        el{" "}
        <span>{new Date(publication.createdAt).toLocaleDateString()}</span>
      </p>
    </div>
  );
}
