import React from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import TransactionTable from "../components/TransactionTable";

const transacoesMock = [
  {
    id: 1,
    titulo: "Salário",
    tipo: "entrada",
    valor: 2500,
    data: "2025-04-01",
  },
  {
    id: 2,
    titulo: "Aluguel",
    tipo: "saída",
    valor: 1200,
    data: "2025-04-03",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 bg-gray-50 p-10">
        <h1 className="text-3xl font-semibold text-blue-700 mb-4">
          Resumo Financeiro
        </h1>
        <p className="text-blue-600">
          Aqui vão aparecer seus lançamentos financeiros e filtros.
        </p>
        <SummaryCards resumo={{ entradas: 2500, saidas: 1200 }} />
        <TransactionTable transacoes={transacoesMock} />
      </main>
    </div>
  );
};

export default Dashboard;
