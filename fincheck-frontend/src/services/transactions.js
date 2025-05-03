// services/transactions.js
import api from "./api";

export const fetchTransactions = async () => {
  const response = await api.get("/transactions/");
  return response.data;
};

export const createTransaction = async (novaTransaction) => {
  const response = await api.post("/transactions/", novaTransaction);
  return response.data;
};

export const deleteTransaction = async (id) => {
  await api.delete(`/transactions/${id}`);
};
