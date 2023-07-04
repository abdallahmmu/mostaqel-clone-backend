import skillModel from "../models/skillModel.js";

export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await skillModel.find().populate({
      path: "categoryId",
      select: "title  -_id",
    });

    res.status(200).json({
      message: "Success",
      count: skills.length,
      results: skills,
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

export const saveSkill = async (req, res, next) => {
  try {
    const newSkill = await skillModel.create(req.body);
    res.status(200).json({
      message: "Success",
      results: newSkill,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
export const getSkillById = async (req, res, next) => {
  try {
    const foundSkill = await skillModel.findById(req.params.id);
    if (!foundSkill)
      return res.status(404).json({
        error: "Can't Not Find Skill ",
      });
    res.status(200).json({
      message: "Success",
      results: foundSkill,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const EditSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.freelancerId = req.freelancerId;
    const UpdatedSkill = await skillModel.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    );
    if (!UpdatedSkill)
      return res.status(404).json({
        error: "Can't Not Updated Skill Successfully",
      });
    res.status(200).json({
      message: "Skill Updated Successfully",
      results: UpdatedSkill,
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

export const deleteSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await skillModel.findByIdAndDelete(id, { new: true });

    res.status(200).json({
      message: "Successfully Deleted Skills",
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};
