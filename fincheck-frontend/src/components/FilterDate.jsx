import { useState, useEffect } from "react";
import { categories } from "../services/transactions";

const EditTransactionModal = ({ transaction, onUpdate }) => {
  const [dateTO, setDateTO] = useState("");
  const [dateFROM, setDateFROM] = useState("");
  const [categoryType, setCategoryType] = useState("");

  return (
<div className="flex gap-4 items-end mb-4">
        <div>
          <label className="block text-sm text-gray-600">from :</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">to:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={fetchTransactionsWithFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
        <button
          onClick={cleanFilter}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Clean
        </button>
        <div>
          <label className="block text-sm text-gray-600">Category:</label>
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
      </div>)
}