import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // URL base da sua API
  timeout: 100000, // tempo máximo de resposta
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    // Adicionar token se existir
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Requisição enviada:", config);
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor para logs de resposta
api.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", response);
    return response;
  },
  (error) => {
    console.error("Erro na resposta:", error);
    return Promise.reject(error);
  }
);
