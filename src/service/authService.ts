import axios from "axios";

const API = "http://localhost:8090";

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


export function getAllRoutines() {
  return axios.get(`${API}/api/publicaciones/rutinas`);
}