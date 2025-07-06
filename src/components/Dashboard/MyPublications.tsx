// components/MyPublications.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";

interface MyPublicationsProps {
  publications: any[];
  user: any;
  onPublicationAdd: (publication: any) => void;
  navigate: (path: string) => void;
}

const MyPublications: React.FC<MyPublicationsProps> = ({
  publications,
  user,
  onPublicationAdd,
  navigate,
}) => {
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [publicationType, setPublicationType] = useState<"rutina" | "plan" | "normal" | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handlePublicationSubmit = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    const nueva = {
      id: publications.length + 1,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: user?.name ?? "Yo",
      createdAt: new Date().toISOString(),
      ejercicios: [],
    };
    
    onPublicationAdd(nueva);
    setNewTitle("");
    setNewContent("");
    setShowPublicationForm(false);
    setPublicationType(null);
  };

  const avatar = user?.avatar || user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Mis Publicaciones</h2>
        <button
          onClick={() => {
            setShowPublicationForm((prev) => !prev);
            setPublicationType(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          <Plus className="w-4 h-4" />
          Nueva
        </button>
      </div>

      {/* Formulario de selección de tipo */}
      {showPublicationForm && publicationType === null && (
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <button
            onClick={() => navigate("/rutinas/crear")}
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Publicar Rutina
          </button>
          <button
            onClick={() => navigate("/planes-alimentacion/crear")}
            className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Plan Alimenticio
          </button>
          <button
            onClick={() => setPublicationType("normal")}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Publicación Normal
          </button>
        </div>
      )}

      {/* Formulario de publicación normal */}
      {showPublicationForm && publicationType === "normal" && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-4">Nueva Publicación</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Título</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Contenido</label>
              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg resize-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handlePublicationSubmit}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Publicar
            </button>
            <button
              onClick={() => {
                setShowPublicationForm(false);
                setPublicationType(null);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de publicaciones */}
      <div className="space-y-4">
        {publications.slice(0, 4).map((pub) => (
          <div
            key={pub.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{pub.title}</h3>
              <span className="text-xs text-gray-500">
                {new Date(pub.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{pub.content}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                <span className="text-xs font-semibold text-green-700">
                  {avatar}
                </span>
              </div>
              <span>Por {pub.author}</span>
            </div>

            {/* Ejercicios */}
            {(pub.ejercicios ?? []).length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-800">Ejercicios:</h4>
                {pub.ejercicios?.map((ej: any) => (
                  <div key={ej.id} className="text-sm border rounded p-2 bg-gray-50">
                    <p className="font-semibold">{ej.nombre}</p>
                    <p className="text-gray-600">{ej.descripcion}</p>
                    <p className="text-gray-700">
                      {ej.series} series, {ej.repeticiones} reps, {ej.pesoKg}kg, descanso {ej.descansoSegundos}s
                    </p>
                    {ej.imagenUrl && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${ej.imagenUrl}`}
                        alt={ej.nombre}
                        className="w-32 mt-2 rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {publications.length > 4 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/mis-publicaciones")}
              className="text-cyan-600 font-semibold hover:underline"
            >
              Ver más publicaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPublications;