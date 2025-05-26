import { useState, useEffect } from "react";

const EditTransactionModal = ({ isOpen, onClose, transaction, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [categoryType, setCategoryType] = useState("");

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setType(transaction.type);
      setCategoryType(transaction.categoryType);
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...transaction,
      title,
      amount: parseFloat(amount),
      type,
      categoryType,
    });
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Título"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Valor"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="entry">Entry</option>
            <option value="outlet">Outlet</option>
          </select>
          <select
            value={categoryType}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Bills">Bills</option>
            <option value="TraInvestmentnsport">Investment</option>
            <option value="Others">Others</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;