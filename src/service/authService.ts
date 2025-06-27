import axios from "axios";

const API = "http://localhost:8090";

export function login(email: string, password: string) {
  return axios.post(`${API}/auth/login`, { email, password });
}

export function register(name: string, email: string, password: string) {
  return axios.post(`${API}/auth/register`, { name, email, password });
}


