import api from "./api"; // importa o axios configurado

export const fetchTransacoes = async () => {
  const response = await api.get("/transactions");
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

// e você pode ir adicionando outros, tipo deleteTransaction, updateTransaction, etc
