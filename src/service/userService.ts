import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// 🔐 Obtener datos del usuario logueado con su token
export function getMe(token: string) {
  return axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ✏️ Actualizar datos del usuario
export function updateUser(token: string, id: number, data: any) {
  return axios.put(`${API}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 🚪 Login y registro siguen igual (tú ya los tenías)
export function login(email: string, password: string) {
  return axios.post(`${API}/auth/login`, { email, password });
}

export function register(name: string, email: string, password: string) {
  return axios.post(`${API}/auth/register`, { name, email, password });
}
