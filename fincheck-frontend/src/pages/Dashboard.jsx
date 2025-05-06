import { useEffect, useState } from "react";
import { fetchTransactions, createTransaction } from "../services/transactions";
import SummaryCards from "../components/SummaryCards";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import { deleteTransaction } from "../services/transactions";
import EditTransactionModal from "../components/EditTransactionModal";
import api from "../services/api";

const Dashboard = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0 });
  const [modalAberto, setModalAberto] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);

  const buscarTransacoes = async () => {
    try {
      const dados = await fetchTransactions();
      setTransacoes(dados);
      calcularResumo(dados);
    } catch (err) {
      console.error("Erro ao carregar transações:", err.message);
    }
  };

  // 🔁 Carrega as transações da API ao iniciar
  useEffect(() => {
    buscarTransacoes();
  }, []);

  // 🧮 Recalcula o resumo de entradas/saídas
  const calcularResumo = (transacoes) => {
    const entradas = transacoes
      .filter((t) => t.type === "entrada")
      .reduce((acc, t) => acc + t.amount, 0);
  
    const saidas = transacoes
      .filter((t) => t.type === "saída")
      .reduce((acc, t) => acc + t.amount, 0);
  
    const saldo = entradas - saidas;
  
    setResumo({ entradas, saidas, saldo });
  };
  

  // ➕ Adiciona nova transação via formulário
  const handleAdicionarTransacao = async (novaTransaction) => {
    try {
      const nova = await createTransaction(novaTransaction);
      const atualizadas = [...transacoes, nova];
      setTransacoes(atualizadas);
      calcularResumo(atualizadas);
    } catch (err) {
      console.error("Erro ao adicionar transação:", err.message);
    }
  };

  const handleAtualizarTransacao = async (dadosAtualizados) => {
    try {
      await api.put(`/transactions/${dadosAtualizados.id}`, dadosAtualizados);
      buscarTransacoes(); // atualiza a lista
    } catch (err) {
      console.error("Erro ao atualizar transação:", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransacoes((prev) => prev.filter((tx) => tx.id !== id));
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
    }
  };

  const handleAbrirModal = (transacao) => {
    setTransacaoSelecionada(transacao);
    setModalAberto(true);
  };

  // 🔒 Logout limpa o token e redireciona
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redireciona
  };

  return (
    <main className="p-6">
      {/* Botão de logout */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Sair
        </button>
      </div>

      {/* Cartões de resumo */}
      <SummaryCards resumo={resumo} />

      {/* Formulário de nova transação */}
      <TransactionForm onAdd={handleAdicionarTransacao} />

      {/* Tabela de transações */}
      <TransactionTable
        transacoes={transacoes}
        onDelete={handleDeleteTransaction}
        onEdit={handleAbrirModal}
      />
      <EditTransactionModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        transaction={transacaoSelecionada}
        onUpdate={handleAtualizarTransacao}
      />
    </main>
  );
};

export default Dashboard;
