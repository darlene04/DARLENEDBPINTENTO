import { useState } from "react";
import type { FormEvent } from "react";

interface CreatePublicationFormProps {
  onSubmit: (title: string, content: string) => void;
}

export default function CreatePublicationForm({ onSubmit }: CreatePublicationFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
      setTitle("");
      setContent("");
    } else {
      alert("Por favor completa ambos campos.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md flex flex-col gap-4 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-violet-700 mb-2">Crear publicación</h2>

      <input
        type="text"
        placeholder="Título de la publicación"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      <textarea
        placeholder="Escribe aquí tu contenido..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        rows={5}
      />

      <button
        type="submit"
        className="bg-violet-700 hover:bg-violet-800 text-white py-2 rounded-lg font-semibold transition"
      >
        Publicar
      </button>
    </form>
  );
}
