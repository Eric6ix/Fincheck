import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333/api", // Atualiza se necessário
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const API_URL = "http://localhost:3333"; // ou a URL da tua API

export const getToken = () => {
  return localStorage.getItem("token");
};

export const fetchTransacoes = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar transações");
  }

  const data = await response.json();
  return data;
};

export default api;
