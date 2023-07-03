import express from "express";
import {
  loginAdmin,
  getAllStatistics,
  deactiveFreelancerById,
  deactiveClientById,
  verifyFreelancerById,
  verifyClientById,
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
adminRoute.patch("/verify-freelancer", verifyFreelancerById);
adminRoute.patch("/verify-client", verifyClientById);
