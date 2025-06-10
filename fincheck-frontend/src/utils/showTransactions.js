import { getTransactions } from "../services/transactions";

const fetchTransactionsUtil = async () => {
  try {
    const data = await getTransactions();
    if (data && Array.isArray(data)) {
      return data;
    } else {
      throw new Error("Invalid data format received from API");
    }
  } catch (err) {
    console.error("Error fetching transactions:", err.message);
    return null;
  }
};

export default fetchTransactionsUtil;
