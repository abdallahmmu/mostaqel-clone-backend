import express from "express";
import   {
  // loginAdmin,
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

import { deactiveProject, getAllProjects, getProjectById, getProjectsStats } from "../controllers/Projects/adminProjectsConroller.js";

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
adminRoute.get('/freelancers',getAllFreelancers);
adminRoute.get("/statistics", getAllStatistics);
adminRoute.patch("/deactive-freelancer", deactiveFreelancerById);
adminRoute.patch("/deactive-client", deactiveClientById);
adminRoute.patch("/verify-freelancer", verifyFreelancerById);
adminRoute.patch("/verify-client", verifyClientById);

// Projects
adminRoute.get('/projects', getAllProjects)
adminRoute.get('/projects/:id', getProjectById)
adminRoute.get('/projects-stats', getProjectsStats)
adminRoute.patch('/deactivate-project', deactiveProject)
