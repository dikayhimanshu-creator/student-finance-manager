import express from 'express'
import { setBudget, getBudget } from '../controllers/budgetController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/', setBudget)
router.get('/', getBudget)

export default router