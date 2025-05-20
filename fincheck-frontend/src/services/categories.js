import api from "./api";

export const fetchCategories = async () => {
  const response = await api.get("/category");
  return response.data;
};

export const createCategory = async (dados) => {
  const response = await api.post("/category", dados);
  return response.data;
};

export const updateCategory = async (dados) => {
  const response = await api.put("/category", dados);
  return response.data;
};

export const deletCategory = async (dados) => {
  const response = await api.delete("/category", dados);
  return response.data;
};

