import express from "express";
import {
  loginAdmin,
  getAllStatistics,
  deactiveFreelancerById,
  deactiveClientById,
  verifyFreelancerById,
  verifyClientById,
} from "../controllers/adminController.js";

export const adminRoute = express.Router();

adminRoute.post("/", loginAdmin);
adminRoute.get("/statistics", getAllStatistics);
adminRoute.patch("/deactive-freelancer", deactiveFreelancerById);
adminRoute.patch("/deactive-client", deactiveClientById);
adminRoute.patch("/verify-freelancer", verifyFreelancerById);
adminRoute.patch("/verify-client", verifyClientById);
