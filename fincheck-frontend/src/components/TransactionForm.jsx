import { useState } from "react";
import { categories } from "../services/transactions";
const TransactionForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("entry");
  const [categoryType, setCategoryType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      title: title,
      amount: parseFloat(value),
      type: type,
      categoryType: categoryType,
    };

    onAdd(newTransaction);
    setTitle("");
    setValue("");
    setType("");
    setCategoryType("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow p-6 mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">New transaction</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border rounded-lg p-2"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="">Type</option>
          <option value="Entry">Entry</option>
          <option value="Outlet">Outlet</option>
        </select>
        <select
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="">Category Type</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
};

export default TransactionForm;
