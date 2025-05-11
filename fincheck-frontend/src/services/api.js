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

// 🔄 Intercepta respostas com erro 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for 401, tenta renovar o token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post("http://localhost:3333/api/refresh-token", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        const newToken = refreshResponse.data.token;

        // Atualiza o token localmente
        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Reenvia a requisição original com o novo token
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Erro ao renovar token:", refreshErr);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    // Se não for 401 ou se falhar na renovação
    return Promise.reject(error);
  }
);

export default api;
