import { useEffect, useState } from "react";
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactions";
import SummaryCards from "../components/SummaryCards";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import EditTransactionModal from "../components/EditTransactionModal";
import api from "../services/api";

const Dashboard = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  const [modalAberto, setModalAberto] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  
  const buscarTransacoes = async () => {
    try {
      const dados = await fetchTransactions();
      setTransacoes(dados);
      calcularResumo(dados);
    } catch (err) {
      console.error("Erro ao carregar transações:", err.message);
    }
  };

  const buscarTransacoesComFiltro = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (selectedCategory) params.append("categoryId", selectedCategory);

      const res = await api.get(`/transactions?${params.toString()}`);
      setTransacoes(res.data);
      calcularResumo(res.data);
    } catch (err) {
      console.error("Erro ao filtrar transações:", err.message);
    }
  };

  const limparFiltro = () => {
    setStartDate("");
    setEndDate("");
    buscarTransacoes();
  };

  useEffect(() => {
    buscarTransacoes();
    buscarCategorias();
  }, []);

  const buscarCategorias = async () => {
    try {
      const res = await api.get("/category");
      setCategorias(res.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err.message);
    }
  };

  // const calcularResumo = (transacoes) => {
  //   const entradas = transacoes
  //     .filter((t) => t.type === "entrada")
  //     .reduce((acc, t) => acc + t.amount, 0);

  //   const saidas = transacoes
  //     .filter((t) => t.type === "saída")
  //     .reduce((acc, t) => acc + t.amount, 0);

  //   const saldo = entradas - saidas;

  //   setResumo({ entradas, saidas, saldo });
  // };

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
      buscarTransacoes();
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

  const handleExportPDF = async () => {
  try {
    const response = await api.get("/transactions/export/pdf", {
      responseType: "blob", // importante para baixar arquivo binário
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transacoes.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
  }
};
const handleExportCSV = async () => {
  try {
    const response = await api.get("/transactions/export/csv", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transacoes.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Erro ao exportar CSV:", error);
  }
};



  const handleAbrirModal = (transacao) => {
    setTransacaoSelecionada(transacao);
    setModalAberto(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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

        <button
          onClick={handleExportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Exportar PDF
        </button>

        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Exportar CSV
        </button>
      </div>

      {/* Cartões de resumo */}
      <SummaryCards resumo={resumo} />

      {/* Filtros por período */}
      <div className="flex gap-4 items-end mb-4">
        <div>
          <label className="block text-sm text-gray-600">De:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Até:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={buscarTransacoesComFiltro}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filtrar
        </button>
        <button
          onClick={limparFiltro}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Limpar
        </button>
        <div>
          <label className="block text-sm text-gray-600">Categoria:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulário de nova transação */}
      <TransactionForm onAdd={handleAdicionarTransacao} />

      {/* Tabela de transações */}
      <TransactionTable
        transacoes={transacoes}
        onDelete={handleDeleteTransaction}
        onEdit={handleAbrirModal}
      />

      {/* Modal de edição */}
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
