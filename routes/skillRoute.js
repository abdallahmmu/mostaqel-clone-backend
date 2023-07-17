import express from "express";
import {
  saveSkill,
  getAllSkills,
  getSkillById,
  EditSkillById,
  deleteSkillById,
  skillStatistics,
} from "../controllers/skillController.js";
export const skillesRoute = express.Router();

skillesRoute.get("/", getAllSkills);
skillesRoute.get("/statistics", skillStatistics);

skillesRoute.post("/", saveSkill);

skillesRoute.get("/:id", getSkillById);

skillesRoute.patch("/:id", EditSkillById);

skillesRoute.delete("/:id", deleteSkillById);
