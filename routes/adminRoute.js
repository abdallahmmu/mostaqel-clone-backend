import express from "express";
import {
  getAllClients,
  getAllFreelancers,
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
  protectMiddleware,
  allowedTo,
} from "../controllers/adminAuthController.js";
export const adminRoute = express.Router();
const roles = ["superAdmin", "admin"];
adminRoute.post("/auth/admin", addSuperAdmin);
adminRoute.post(
  "/auth/register",
  protectMiddleware,
  allowedTo(["superAdmin"]),
  registerAdmin
);
adminRoute.post("/auth/login", loginAdmin);

adminRoute.get("/clients", protectMiddleware, allowedTo(roles), getAllClients);

adminRoute.get(
  "/freelancers",
  protectMiddleware,
  allowedTo(roles),
  getAllFreelancers
);
adminRoute.get(
  "/statistics",
  protectMiddleware,
  allowedTo(roles),
  getAllStatistics
);
adminRoute.patch(
  "/deactive-freelancer",
  protectMiddleware,
  allowedTo(roles),
  deactiveFreelancerById
);
adminRoute.patch(
  "/deactive-client",
  protectMiddleware,
  allowedTo(roles),
  deactiveClientById
);
adminRoute.patch(
  "/verify-freelancer",
  protectMiddleware,
  allowedTo(roles),
  verifyFreelancerById
);
adminRoute.patch(
  "/verify-client",
  protectMiddleware,
  allowedTo(roles),
  verifyClientById
);
