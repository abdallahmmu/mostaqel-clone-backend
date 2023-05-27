import express from "express";
import {
  saveSkill,
  getAllskills,
  getSkillById,
  EditSkillById,
  deleteSkillById,
} from "../controllers/skillController.js";
export const skillesRoute = express.Router();

skillesRoute.get("/", async (req, res) => {
  try {
    var skills = await getAllskills();
    res.status(200).json(skills);
  } catch (e) {
    res.status(404).json(e);
  }
});

skillesRoute.post("/", async (req, res) => {
  try {
    var skill = req.body;

    var newSkill = await saveSkill(skill);

    res.json(newSkill);
  } catch (e) {
    res.status(404).json(e);
  }
});

skillesRoute.get("/:id", async (req, res) => {
  var id = req.params.id;
  try {
    var foundedSkill = await getSkillById(id);
    res.json(foundedSkill);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

skillesRoute.patch("/:id", async (req, res) => {
  var { name } = req.body;
  var { id } = req.params;

  var UpdatedSkill = await EditSkillById(id, name);
  res.json(UpdatedSkill);
});

skillesRoute.delete("/:id", async (req, res) => {
  try {
    var { id } = req.params;
    var deleteSkill = await deleteSkillById(id);
    res.status(201).json(deleteSkill);
  } catch (e) {
    res.status(404).json(e);
  }
});
