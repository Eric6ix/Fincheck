import { useEffect, useState } from "react";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactions";
import SummaryCards from "../components/SummaryCards";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import EditTransactionModal from "../components/EditTransactionModal";
import Sidebar from "../components/Sidebar";
import { handleExportCSV, handleExportPDF } from "../context/exportPDFendCSV";
import api from "../services/api";


const Dashboard = () => {
  const [transaction, setTransaction] = useState([]);
  const [summary, setSummary] = useState({ entry: 0, outlet: 0, wallet: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionSelected, setTransactionSelected] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryType, setCategory] = useState([]);
  const [CategorySelected, setCategorySelected] = useState("");

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransaction(data);
      CalculateSummary(data);
    } catch (err) {}
  };

  const fetchTransactionsWithFilter = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (setCategorySelected) params.append("categoryId", CategorySelected);

      const res = await api.get(`/transactions?${params.toString()}`);
      setTransaction(res.data);
      CalculateSummary(res.data);
    } catch (err) {
      console.error("Erro when filtering:", err.message);
    }
  };

  const cleanFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const CalculateSummary = (transaction) => {
    const entry = transaction
      .filter((t) => t.type === "Entry")
      .reduce((acc, t) => acc + t.amount, 0);

    const outlet = transaction
      .filter((t) => t.type === "Outlet")
      .reduce((acc, t) => acc + t.amount, 0);

    const wallet = entry - outlet;

    setSummary({ outlet, entry, wallet });
  };

  const handleAddTransaction = async (creatTransaction) => {
    try {
      const creat = await createTransaction(creatTransaction);
      const successCreat = [...transaction, creat];
      setTransaction(successCreat);
      CalculateSummary(successCreat);
      fetchTransactions;
    } catch (err) {
      console.error("Erro when add transaction:", err.message);
    }
  };

  const handleUpdateTransaction = async (updateData) => {
    try {
      await api.put(`/transactions/${updateData.id}`, updateData);
      fetchTransactions();
    } catch (err) {
      console.error("Erro when update transaction:", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransaction((prev) => prev.filter((tx) => tx.id !== id));
      fetchTransactions;
      setTransaction(updated);
      CalculateSummary(updated);
    } catch (error) {
      console.error("Erro when delet transaction:", error);
    }
  };

  const handleOpenModal = (transaction) => {
    setTransactionSelected(transaction);
    setModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <main className="p-6">
      <div className="flex justify-end mb-4">
        <button onClick={handleLogout}className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">logout</button>
        <button onClick={handleExportPDF}className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Export PDF</button>
        <button onClick={handleExportCSV}className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Export CSV</button>
      </div>

      {/* Cartões de resumo */}
      <SummaryCards summary={summary} />

      {/* Filtros por período */}
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
            value={CategorySelected}
            onChange={(e) => setCategorySelected(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {categoryType.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulário de nova transação */}
      <TransactionForm onAdd={handleAddTransaction} CalculateSummary />

      {/* Tabela de transações */}
      <TransactionTable
        transacoes={transaction}
        onDelete={handleDeleteTransaction}
        onEdit={handleOpenModal}
        fetchTransactions
      />

      {/* Modal de edição */}
      <EditTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={transactionSelected}
        onUpdate={handleUpdateTransaction}
        fetchTransactions
      />
    </main>
  );
};

export default Dashboard;
