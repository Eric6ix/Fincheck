import React, { useState } from "react";

const TransactionForm = ({ onAdd }) => {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");

  const handleSubmit = (e) => {
    e.preventDefault();

    const novaTransacao = {
      titulo,
      valor: parseFloat(valor),
      tipo,
      data: new Date().toISOString(),
    };

    onAdd(novaTransacao); // Callback para a dashboard
    setTitulo("");
    setValor("");
    setTipo("entrada");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Nova Transação</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="border rounded-lg p-2"
          required
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="entrada">Entrada</option>
          <option value="saída">Saída</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Adicionar
      </button>
    </form>
  );
};

export default TransactionForm;
