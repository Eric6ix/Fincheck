import { useEffect, useState } from "react";
import { createTransaction, deleteTransaction } from "../services/transactions";
import { handleExportCSV, handleExportPDF } from "../context/exportPDFendCSV";
import calculateSummaryUtils from "../utils/CalculateSummary";
import fetchTransactionsUtil from "../utils/ShowTransactions.js";
import SummaryCards from "../components/SummaryCards";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import EditTransactionModal from "../context/EditTransactionModal";
import api from "../services/api";

const Dashboard = () => {
  const [transaction, setTransaction] = useState([]);
  const [summary, setSummary] = useState({ entry: 0, outlet: 0, wallet: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionSelected, setTransactionSelected] = useState(null);

  //RETURNING ALL TRANSACTIONS
  useEffect(() => {
    const fetchData = async () => {
      const transactionUtils = await fetchTransactionsUtil();
      if (transactionUtils) {
        setTransaction(transactionUtils);
      }
    };
    fetchData();
  }, []);


useEffect(() => {
  const fetchCalculade = async () => {
    const data = await fetchTransactionsUtil();
    const summary = await calculateSummaryUtils(data); 
    if (summary) setSummary(summary);
  };

  fetchCalculade();
}, []);




  const handleAddTransaction = async (creatTransaction) => {
    try {
      const creat = await createTransaction(creatTransaction);
      const successCreat = [...transaction, creat];
      setTransaction(successCreat);
      calculateSummaryUtils(successCreat);
      fetchTransactionsUtil;
    } catch (err) {
      console.error("Erro when add transaction:", err.message);
    }
  };

  const handleUpdateTransaction = async (updateData) => {
    try {
      await api.put(`/transactions/${updateData.id}`, updateData);
      fetchTransactionsUtil();
    } catch (err) {
      console.error("Erro when update transaction:", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmed) {
      try {
        await deleteTransaction(id);
        setTransaction((prev) => prev.filter((tx) => tx.id !== id));
        fetchTransactionsUtil();
        setTransaction(updated);
        CalculateSummary(updated);
      } catch (error) {
        console.error("Erro when delet transaction:", error);
      }
    }
  };

  const handleOpenModal = (transaction) => {
    setTransactionSelected(transaction);
    setModalOpen(true);
  };

  const handleLogout = () => {
    alert("You have been logged out");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <main className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          logout
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Export CSV
        </button>
      </div>

      {/* Cartões de resumo */}
      <SummaryCards summary={summary} />

      {/* Formulário de nova transação */}
      <TransactionForm onAdd={handleAddTransaction} CalculateSummary />

      {/* Tabela de transações */}
      <TransactionTable
        transacoes={transaction}
        onDelete={handleDeleteTransaction}
        onEdit={handleOpenModal}
        fetchTransactionsUtil
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
