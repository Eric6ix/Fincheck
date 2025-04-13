import React from 'react'
import clsx from 'clsx'

const TransactionTable = ({ transacoes }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow p-6">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="pb-3">Título</th>
            <th className="pb-3">Tipo</th>
            <th className="pb-3">Valor</th>
            <th className="pb-3">Data</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id} className="border-b last:border-none text-sm text-gray-700">
              <td className="py-2">{t.titulo}</td>
              <td
                className={clsx(
                  'py-2 font-medium',
                  t.tipo === 'entrada' ? 'text-green-600' : 'text-red-500'
                )}
              >
                {t.tipo}
              </td>
              <td className="py-2">R$ {t.valor.toFixed(2)}</td>
              <td className="py-2">{new Date(t.data).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
