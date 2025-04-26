import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

const prisma = new PrismaClient();

// Gera e envia CSV
export const exportTransactionCSV = async (req, res) => {
  const userId = req.user.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Nenhuma transação encontrada para exportar.' });
    }

    const fields = ['id', 'title', 'amount', 'type', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao exportar CSV.' });
  }
};

// Gera e envia PDF
export const exportTransactionPDF = async (req, res) => {
  const userId = req.user.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Nenhuma transação encontrada para exportar.' });
    }

    const doc = new PDFDocument();
    const stream = new Readable().wrap(doc);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

    doc.fontSize(16).text('Relatório de Transações', { align: 'center' });
    doc.moveDown();

    transactions.forEach((t) => {
      doc
        .fontSize(12)
        .text(`Título: ${t.title}`)
        .text(`Valor: R$ ${t.amount / 100}`)
        .text(`Tipo: ${t.type}`)
        .text(`Data: ${new Date(t.createdAt).toLocaleDateString()}`)
        .moveDown();
    });

    doc.end();
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao exportar PDF.' });
  }
};
