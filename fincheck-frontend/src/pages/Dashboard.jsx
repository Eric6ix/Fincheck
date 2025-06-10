import { useEffect, useState } from "react";
import {
  createTransaction,
  deleteTransaction,
} from "../services/transactions";
import SummaryCards from "../components/SummaryCards";
import FetchTransactionsUtil from "../utils/showTransactions.js"
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import EditTransactionModal from "../context/EditTransactionModal";
import { handleExportCSV, handleExportPDF } from "../context/exportPDFendCSV";
import api from "../services/api";


const Dashboard = () => {
  const [transaction, setTransaction] = useState([]);
  const [summary, setSummary] = useState({ entry: 0, outlet: 0, wallet: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionSelected, setTransactionSelected] = useState(null);

  
  // const fetchTransactions = async () => {
  //   try {
  //     const data = await getTransactions();
  //     setTransaction(data);
  //     CalculateSummary(data);
  //   } catch (err) {}
  // };

    useEffect(() => {
  const fetchData = async () => {
    const data = await FetchTransactionsUtil();
    if (data) {
      setTransaction(data);
    }
  };

  fetchData();
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
      FetchTransactionsUtil
    } catch (err) {
      console.error("Erro when add transaction:", err.message);
    }
  };

  const handleUpdateTransaction = async (updateData) => {
    try {
      await api.put(`/transactions/${updateData.id}`, updateData);
      FetchTransactionsUtil();
    } catch (err) {
      console.error("Erro when update transaction:", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
   const confirmed = window.confirm("Are you sure you want to delete this transaction?");
if (confirmed) {
      try {
          await deleteTransaction(id);
          setTransaction((prev) => prev.filter((tx) => tx.id !== id));
          FetchTransactionsUtil();
          setTransaction(updated);
          CalculateSummary(updated);
        } catch (error) {
          console.error("Erro when delet transaction:", error);
        }
      };
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
        <button onClick={handleLogout}className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">logout</button>
        <button onClick={handleExportPDF}className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Export PDF</button>
        <button onClick={handleExportCSV}className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Export CSV</button>
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
