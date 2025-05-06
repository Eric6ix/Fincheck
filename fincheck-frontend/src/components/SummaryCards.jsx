import React from "react";
import { FaArrowDown, FaArrowUp, FaDollarSign } from "react-icons/fa";

const SummaryCards = ({ resumo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <p className="text-gray-700 font-medium">Entradas</p>
          <FaArrowDown className="text-green-500 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mt-2">
          R$ {resumo.entradas.toFixed(2)}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <p className="text-gray-700 font-medium">Saídas</p>
          <FaArrowUp className="text-red-500 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mt-2">
          R$ {resumo.saidas.toFixed(2)}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <p className="text-gray-700 font-medium">Saldo</p>
          <FaDollarSign className="text-blue-500 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-blue-600 mt-2">
          R$ {(resumo.saldo || 0).toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default SummaryCards;
