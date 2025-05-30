import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

// 🛡️ Adiciona token de acesso em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
