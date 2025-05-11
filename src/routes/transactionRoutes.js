import express from 'express'
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Todas as rotas abaixo exigem token (usuário logado)
router.use(authMiddleware)

router.post('/', createTransaction)
router.get('/', getTransactions)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

export default router
