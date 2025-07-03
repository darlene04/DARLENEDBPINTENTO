import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export function login(email: string, password: string) {
  return axios.post(`${API}/auth/login`, { email, password });
}

export function register(name: string, email: string, password: string) {
  return axios.post(`${API}/auth/register`, { name, email, password });
}

export function getUserInfo() {
  const token = localStorage.getItem("token");
  return axios.get(`${API}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAllRoutines(page = 0, size = 6) {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/publicaciones/rutinas`, {
    params: { page, size },
  });
}

