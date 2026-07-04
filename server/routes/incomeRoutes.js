import express from 'express'
import { addIncome, getIncome, deleteIncome } from '../controllers/incomeController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/', addIncome)
router.get('/', getIncome)
router.delete('/:id', deleteIncome)

export default router