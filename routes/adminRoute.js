import express from "express";
import {
  getAllStatistics,
  deactiveFreelancerById,
  deactiveClientById,
} from "../controllers/adminController.js";
import {
  loginAdmin,
  registerAdmin,
  addSuperAdmin,
} from "../controllers/adminAuthController.js";

export const adminRoute = express.Router();

adminRoute.post("/auth/admin", addSuperAdmin);
adminRoute.post("/auth/register", registerAdmin);
adminRoute.post("/auth/login", loginAdmin);
adminRoute.get("/statistics", getAllStatistics);
adminRoute.patch("/deactive-freelancer", deactiveFreelancerById);
adminRoute.patch("/deactive-client", deactiveClientById);
