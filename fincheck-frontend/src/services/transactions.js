// services/transactions.js
import api from "./api";
 export const categories = [
    "Salary",
    "Food",
    "Transport",
    "Health",
    "Entertainment",
    "Shopping",
    "Education",
    "Bills",
    "Investment",
    "Others",
  ];
export const getTransactions = async () => {
  const response = await api.get("/transactions/");
  return response.data;
};

export const createTransaction = async (newTransaction) => {
  const response = await api.post("/transactions/", newTransaction);
  return response.data;
};

export const deleteTransaction = async (id) => {
  await api.delete(`/transactions/${id}`);
};
