import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export function getMe(token: string) {
  return axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateUser(token: string, id: number, data: any) {
  return axios.put(`${API}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function login(email: string, password: string) {
  return axios.post(`${API}/auth/login`, { email, password });
}

export function register(name: string, email: string, password: string) {
  return axios.post(`${API}/auth/register`, { name, email, password });
}
