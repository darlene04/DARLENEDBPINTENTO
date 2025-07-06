// components/CommunityPublications.tsx
import React from "react";

interface CommunityPublicationsProps {
  publications: any[];
  groups: { id: number; nombre: string }[];
  onShareInGroup: (publicacionId: number, grupoId: number) => void;
}

const CommunityPublications: React.FC<CommunityPublicationsProps> = ({
  publications,
  groups,
  onShareInGroup,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Publicaciones de la comunidad
      </h2>

      {publications.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay publicaciones disponibles.
        </p>
      ) : (
        <div className="space-y-4">
          {publications.map((pub) => (
            <div
              key={pub.id_publicacion}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                {pub.titulo}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Rutina: {pub.nombreRutina} – Duración: {pub.duracion} día(s)
              </p>

              {/* EJERCICIOS */}
              {pub.ejercicios && pub.ejercicios.length > 0 && (
                <div className="mt-2 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Ejercicios:
                  </h4>
                  {(pub.ejercicios ?? []).map((ej: any) => (
                    <div
                      key={ej.id}
                      className="text-sm border rounded p-2 bg-gray-50"
                    >
                      <p className="font-semibold">{ej.nombre}</p>
                      <p className="text-gray-600">{ej.descripcion}</p>
                      <p className="text-gray-700">
                        {ej.series} series, {ej.repeticiones} reps,{" "}
                        {ej.pesoKg}kg, descanso {ej.descansoSegundos}s
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

              {/* COMPARTIR EN GRUPO */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  defaultValue=""
                  id={`grupo-select-${pub.id_publicacion}`}
                >
                  <option value="" disabled>
                    Selecciona grupo
                  </option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>

                <button
                  className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-sm"
                  onClick={() => {
                    const select = document.getElementById(
                      `grupo-select-${pub.id_publicacion}`
                    ) as HTMLSelectElement;
                    const grupoId = Number(select.value);
                    if (!grupoId) {
                      alert("Elige un grupo primero.");
                      return;
                    }
                    onShareInGroup(pub.id_publicacion, grupoId);
                  }}
                >
                  Compartir en grupo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPublications;