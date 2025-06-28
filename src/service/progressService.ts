import axios from "axios";

const API = "http://localhost:8090";

export function getProgress(token: string) {
  return axios.get(`${API}/api/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateProgress(
  token: string,
  currentWeight: number,
  goalWeight: number
) {
  return axios.post(
    `${API}/api/progress`,
    { currentWeight, goalWeight },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
