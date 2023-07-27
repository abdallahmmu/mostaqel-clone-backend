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
  registerAdmin,
  addSuperAdmin,
  protectMiddleware,
  loginAdmin,
  allowedTo,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/adminAuthController.js";

import {
  deactiveProject,
  getAllProjects,
  getProjectById,
  getProjectsStats,
} from "../controllers/Projects/adminProjectsConroller.js";

export const adminRoute = express.Router();
const roles = ["superAdmin", "admin"];
adminRoute.post("/auth/admin", addSuperAdmin);
adminRoute.post("/auth/login", loginAdmin);
adminRoute.post(
  "/auth/register",
  protectMiddleware,
  allowedTo(["superAdmin"]),
  registerAdmin
);
adminRoute.get(
  "/admins",
  protectMiddleware,
  allowedTo(["superAdmin"]),
  getAllAdmins
);
adminRoute.delete(
  "/admins/:adminId",
  protectMiddleware,
  allowedTo(["superAdmin"]),
  deleteAdmin
);

// Projects
adminRoute.get("/projects", getAllProjects);
adminRoute.get("/projects/:id", getProjectById);
adminRoute.get("/projects-stats", protectMiddleware, getProjectsStats);
adminRoute.patch("/deactivate-project", protectMiddleware, deactiveProject);

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
