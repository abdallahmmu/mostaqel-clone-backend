import express from 'express'
import { despositPayment } from '../controllers/transactionController.js'

export const transactionRoute = express.Router()


transactionRoute.post('/',despositPayment)



