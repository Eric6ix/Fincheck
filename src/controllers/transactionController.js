import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createTransaction = async (req, res) => {
  const { title, amount, type } = req.body
  const userId = req.user.userId

  try {
    const transaction = await prisma.transaction.create({
      data: { title, amount: parseFloat(amount), type, userId }
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar transação' })
  }
}

export const getTransactions = async (req, res) => {
  const userId = req.user.userId

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar transações' })
  }
}

export const updateTransaction = async (req, res) => {
  const { id } = req.params
  const { title, amount, type } = req.body
  const userId = req.user.userId

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } })

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { title, amount: parseFloat(amount), type }
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar transação' })
  }
}

export const deleteTransaction = async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } })

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    await prisma.transaction.delete({ where: { id } })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar transação' })
  }
}
