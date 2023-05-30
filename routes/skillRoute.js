import express from "express";
import {
  saveSkill,
  getAllskills,
  getSkillById,
  EditSkillById,
  deleteSkillById,
} from "../controllers/skillController.js";
export const skillesRoute = express.Router();

skillesRoute.get("/", async (req, res, next) => {
  try {
    var skills = await getAllskills();
    res.status(200).json(skills);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});

skillesRoute.post("/", async (req, res, next) => {
  try {
    var skill = req.body;

    var newSkill = await saveSkill(skill);

    res.json(newSkill);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});

skillesRoute.get("/:id", async (req, res, next) => {
  var id = req.params.id;
  try {
    var foundedSkill = await getSkillById(id);
    res.json(foundedSkill);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});

skillesRoute.patch("/:id", async (req, res) => {
  var { name } = req.body;
  var { id } = req.params;

  var UpdatedSkill = await EditSkillById(id, name);
  res.json(UpdatedSkill);
});

skillesRoute.delete("/:id", async (req, res, next) => {
  try {
    var { id } = req.params;
    var deleteSkill = await deleteSkillById(id);
    res.status(201).json(deleteSkill);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});
