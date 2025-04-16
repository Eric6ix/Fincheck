import { useEffect, useState } from "react";
import { fetchTransacoes } from "../services/api";
import SummaryCards from "../components/SummaryCards";
import TransactionTable from "../components/TransactionTable";

const Dashboard = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0 });

  useEffect(() => {
    const carregarTransacoes = async () => {
      try {
        const dados = await fetchTransacoes();
        setTransacoes(dados);

        const entradas = dados
          .filter((t) => t.tipo === "entrada")
          .reduce((acc, t) => acc + t.valor, 0);
        const saidas = dados
          .filter((t) => t.tipo === "saída")
          .reduce((acc, t) => acc + t.valor, 0);

        setResumo({ entradas, saidas });
      } catch (err) {
        console.error(err.message);
      }
    };

    carregarTransacoes();
  }, []);

  return (
    <main className="p-6">
      <SummaryCards resumo={resumo} />
      <TransactionTable transacoes={transacoes} />
    </main>
  );
};

export default Dashboard;
