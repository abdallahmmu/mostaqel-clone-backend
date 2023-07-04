import ApiFeatures from "../helpers/ApiFeatures.js";
import projectModel from "../models/projectModel.js";
import { faker } from '@faker-js/faker';

const createProject = async (req, res, next) => {

  try {
    let projectAdded;


    projectAdded = await projectModel.create(req.body);


    if (!projectAdded) {
      return res.status(400).json({ error: "can not save project" });
    }
    res.status(200).json(projectAdded);
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {


  try {

    let totalDocuments = await projectModel.countDocuments();
    let api = new ApiFeatures(req.query, projectModel.find().populate('clientId categoryId'))
      .search().paginate(totalDocuments).filter().select().sort()




    let resultProjects = await api.mongooseQuery

    resultProjects
      &&
      res
        .status(200)
        .json({ resultProjects, pagination: api.pagination, tot: totalDocuments });

    !resultProjects &&
      res.status(400).json({ error: "all project can't returned" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const acceptFreelancerToProject = async (req, res, next) => {
  let projetId = req.params.id;
  let offerId = req.body.offerId;

  try {
    let projectUpdated = await projectModel.findByIdAndUpdate(
      projetId,
      { status: "pending", offerId: offerId },
      {
        new: true,
      }
    );

    projectUpdated && res.status(200).json({ projectUpdated });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const getSingleProject = async (req, res, next) => {
  let projectId = req.params.id;
  try {
    let singleProject = await projectModel.findById(projectId);
    singleProject && res.status(200).json(singleProject);
    !singleProject &&
      res.status(404).json({ error: "single project can't returned" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    let projectUpdated = await projectModel.updateOne(
      { _id: id },
      { title, description }
    );
    projectUpdated && res.status(200).json(projectUpdated);
    !projectUpdated && res.status(404).json({ error: "project can't updated" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    let projectDeleted = await projectModel.deleteOne({ _id: id });
    projectDeleted && res.status(200).json(projectDeleted);
    !projectDeleted && res.status(404).json({ error: "project can't deleted" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  acceptFreelancerToProject,
};
