import express from "express";
import {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  getProjectReviews,
  acceptFreelancerToProject,
} from "../controllers/projectController.js";
import { isClient } from "../middlewares/clientMiddlewares/isClient.js";
import { checkSchema } from "express-validator";
import validatorMiddleware from "./../middlewares/validatorMiddleware.js";
import { projectSchema } from "../validators/addProject.schema.js";

export const projectRoute = express.Router();

projectRoute.get("/", getAllProjects);

projectRoute.get("/:id", getSingleProject);
projectRoute.get("/:projectId/feedback", getProjectReviews);

// save project in DB
projectRoute.post(
  "/",
  isClient,
  checkSchema(projectSchema),
  validatorMiddleware,
  createProject
);

// page to Edit a project
projectRoute.patch("/:id/update", updateProject);

// accept the freelancer route
projectRoute.patch("/:id/accept", acceptFreelancerToProject);

// update project after accept the winner freelancer Id
// projectRoute.patch('/update/:id/:fId', isClient, updateProjectFreelancer)
projectRoute.delete("/:id", isClient, deleteProject);
