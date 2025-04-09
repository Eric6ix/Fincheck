import express from 'express'
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { getSummary } from '../controllers/transactionController.js'


const router = express.Router()

// Todas as rotas abaixo exigem token (usuário logado)
router.use(authMiddleware)
router.get('/summary', getSummary)
router.post('/', createTransaction)
router.get('/', getTransactions)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

export default router
