import axios from "axios";

const API = "http://localhost:8090";

export function createPublication(token: string, title: string, content: string) {
  return axios.post(
    `${API}/api/publications`,
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// ✅ AÑADE ESTA FUNCIÓN PARA QUE EL IMPORT FUNCIONE
export function getPublications(token: string) {
  return axios.get(`${API}/api/publications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
