import axios from "axios";

const API = import.meta.env.VITE_API_URL;

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

export function getPublications(token: string) {
  return axios.get(`${API}/api/publications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
