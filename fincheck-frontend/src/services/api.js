// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:3333"; // Ou sua URL de produção

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Intercepta todas as requests e adiciona o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemplo de uma função de serviço
export const fetchTransacoes = async () => {
  const response = await api.get("/transactions");
  return response.data; // já retorna só o `data`
};

export const fetchCategorias = async () => {
  const response = await api.get("/category");
  return response.data;
};

export const fetchUserInfo = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const createTransaction = async ({ title, amount, type, categoryId }) => {
  const response = await api.post("/transactions", {
    title,
    amount,
    type,
    categoryId,
  });

  return response.data;
};

// Você pode exportar o axios "cru" também
export default api;
