import api from "./api";

export const fetchCategories = async () => {
  const response = await api.get("/category");
  return response.data;
};

export const createCategory = async (dados) => {
  const response = await api.post("/category", dados);
  return response.data;
};

export const getCategory = async (dados) => {
  const response = await api.get("/category", dados);
  return response.data;
};
