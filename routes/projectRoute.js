import express from "express";
import {
  createProject,
  getAllProjects,
  getAllOpenProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  completeProject,
  deactivateProject,
  // getProjectReviews,
  // saveProjectFiles,
  acceptOffer,
} from "../controllers/projectController.js";
import { isClient } from "../middlewares/clientMiddlewares/isClient.js";
import { checkSchema } from "express-validator";
import validatorMiddleware from "./../middlewares/validatorMiddleware.js";
import { projectSchema } from "../validators/addProject.schema.js";
import path from 'path';
import multer from 'multer';


export const projectRoute = express.Router();

projectRoute.get("/", getAllProjects);
projectRoute.get("/open", getAllOpenProjects);

projectRoute.get("/:id", getSingleProject);

const storage = multer.diskStorage({
        destination: function(req, file, cb)  {
          cb(null, "./projectfiles" )
        },
        filename: (req, file, cb) => {
          cb(null, 'projectFile' +  Math.random() * 255 + file.originalname);
        }
    })

// const upload = multer({storage})
const upload = multer({ storage , array: true})

   


// save project in DB
projectRoute.post(
  "/",
  isClient,
  upload.array('files'),
  checkSchema(projectSchema),
  validatorMiddleware,
  createProject
);


// page to Edit a project
projectRoute.patch("/:id/update", updateProject);

// accept the freelancer route
projectRoute.patch("/:id/accept", acceptOffer);
projectRoute.patch("/:id/complete", completeProject);

// update project after accept the winner freelancer Id
projectRoute.delete("/:id", isClient, deleteProject);
projectRoute.patch("/:id/deactivate",isClient ,deactivateProject);
