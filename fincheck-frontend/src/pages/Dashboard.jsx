import { useEffect, useState } from "react";
import { deleteTransaction } from "../services/transactions";
// import { handleExportCSV, handleExportPDF } from "../components/Button.jsx";
import handleAddTransactionUtils from "../utils/AddTransaction";
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

  // CALCULATE SUMMARY
  useEffect(() => {
    const fetchCalculade = async () => {
      const data = await fetchTransactionsUtil();
      const summary = await calculateSummaryUtils(data);
      if (summary) setSummary(summary);
    };
    fetchCalculade();
  }, []);



  // CREATE TRANSACTION
const createTransaction = async (creatTransaction) => {
  const successCreat = await handleAddTransactionUtils(creatTransaction, transaction);
  if (successCreat) {
    setTransaction(successCreat);
    const summary = await calculateSummaryUtils(successCreat);
     const transactionUtils = await fetchTransactionsUtil();
      if (transactionUtils) {
        setTransaction(transactionUtils);
        calculateSummaryUtils(successCreat);
        setSummary(summary);
      }
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

  const handleOpenModal = (transaction) => {
    setTransactionSelected(transaction);
    setModalOpen(true);
  };

  return (
    <main className="p-6">
      {/* Cartões de resumo */}
      <SummaryCards summary={summary} />

      {/* Formulário de nova transação */}
      <TransactionForm
        onAdd={createTransaction}
        fetchCalculade
        fetchData/>

      {/* Tabela de transações */}
      <TransactionTable
        transacoes={transaction}
        // onDelete={handleDeleteTransaction}
        onEdit={handleOpenModal}
        fetchTransactionsUtil/>

      {/* Modal de edição */}
      <EditTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={transactionSelected}
        onUpdate={handleUpdateTransaction}
        fetchTransactions/>
    </main>
  );
};

export default Dashboard;
