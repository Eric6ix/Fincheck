import { Parser } from 'json2csv';
import { prisma } from "../lib/prisma.js";

export const exportTransaction = async (req, res) => {
  const userId = req.user.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Formatando a data para cada transação
    const formattedTransactions = transactions.map(transaction => ({
      ...transaction,
      createdAt: new Date(transaction.createdAt).toLocaleDateString('pt-BR'), // <-- aqui
    }));

    const fields = ['id', 'title', 'amount', 'type', 'createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(formattedTransactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao exportar CSV' });
    console.log(error);
  }
};
