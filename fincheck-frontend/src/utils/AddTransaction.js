import { createTransaction } from "../services/transactions.js";

const handleAddTransactionUtils = async (creatTransaction, currentList) => {
  try {
    const newTx = await createTransaction(creatTransaction);
    return [...currentList, newTx];
  } catch (err) {
    console.error("Error when adding transaction:", err.message);
    return null;
  }
};

export default handleAddTransactionUtils;




