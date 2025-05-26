import clsx from "clsx";

const TransactionTable = ({ transacoes, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow p-6">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="pb-3">Title</th>
            <th className="pb-3">Type</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Data</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr
              key={t.id}
              className="border-b last:border-none text-sm text-gray-700"
            >
              <td className="py-2">{t.title}</td>
              <td className={clsx("py-2 font-medium",t.type === "Entry" ? "text-green-900" : "text-red-700")}>{t.type}</td>
              <td className="py-2">R$ {Number(t.amount).toFixed(2)}</td>
              <td className="py-2">{new Date(t.createdAt).toLocaleDateString()}</td>
              <td className="py-2">{t.categoryType}</td>
              <td className="py-2 space-x-4">

                <button onClick={() => onEdit(t)}className="text-blue-600 hover:underline text-sm">Edit</button>
                <button onClick={() => onDelete(t.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;