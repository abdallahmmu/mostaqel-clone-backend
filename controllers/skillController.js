import skillModel from "../models/skillModel.js";

export const saveSkill = function saveSkill(skill) {
  return skillModel.create(skill);
};

export const getAllskills = function getAllskills() {
  return skillModel.find();
};

export const getSkillById = function getSkillById(id) {
  return skillModel.findById({ _id: id });
};

export const EditSkillById = function EditSkillById(id, name) {
  return skillModel.findByIdAndUpdate(id, { name: name }, { new: true });
};

export const deleteSkillById = function deleteSkillById(id) {
  return skillModel.findByIdAndDelete(id, { new: true });
};
