import express from "express";
import {
  despositPayment,
  getPayments,
  ThankYou,
  getAllUserTranactios,
  withdrawFreelancer,
} from "../controllers/transactionController.js";

export const transactionRoute = express.Router();

transactionRoute.post("/", despositPayment);
transactionRoute.get("/", getPayments);
transactionRoute.post("/thankyou", ThankYou);

transactionRoute.post("/withdraw", withdrawFreelancer);
transactionRoute.get("/userTrans/:userId", getAllUserTranactios)