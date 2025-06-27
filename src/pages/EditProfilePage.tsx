import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useAuth } from "../context/AuthContext";
import { getMe, updateUser } from "../service/userService";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function EditProfilePage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      getMe(token)
        .then((res) => setForm(res.data))
        .catch((err) => {
          console.error("❌ Error al cargar datos:", err);
          setMessage("❌ No se pudo cargar el perfil.");
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form || !token) return;
    try {
      await updateUser(token, form.id, form);
      setMessage("✅ Perfil actualizado correctamente");
      setTimeout(() => {
        setMessage("");
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err);
      setMessage("❌ No se pudo actualizar el perfil.");
    }
  };

  if (loading || !form) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-violet-700 text-center">
          Editar perfil
        </h1>

        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo"
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-violet-700 text-white py-2 rounded hover:bg-violet-800 transition"
        >
          Guardar cambios
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
        )}
      </form>
    </main>
  );
}
