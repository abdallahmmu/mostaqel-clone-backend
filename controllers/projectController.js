import freelancerModel from "../models/freelancerModel.js";
import offerModel from "../models/offerModel.js";

import projectModel from "../models/projectModel.js";

const createProject = async (req, res) => {
  req.body.clientId = req.clientId;
  const project = req.body;

  try {
    let projectAdded = await projectModel.create(project);
    projectAdded && res.status(200).json(projectAdded);
    !projectAdded && res.status(400).json({ message: "project can't added" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  const limit = 5; //projects per page
  const page = parseInt(req.query.page) || 1;

  let countDocument;

  const startIndex = (page - 1) * limit;

  try {
    countDocument = await projectModel.find().countDocuments();

    let resultProjects = await projectModel
      .find()
      .skip(startIndex)
      .limit(limit);
    let totalPages = Math.ceil(countDocument / limit);
    let currentPage = page;

    resultProjects &&
      res
        .status(200)
        .json({ resultProjects, totalPages, currentPage, countDocument });

    !resultProjects &&
      res.status(400).json({ message: "all project can't returned" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const acceptFreelancerToProject = async (req, res) => {
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
    res.status(403).json({ message: error.message });
  }
};

const getSingleProject = async (req, res) => {
  let projectId = req.params.id;
  try {
    let singleProject = await projectModel.findById(projectId);
    singleProject && res.status(200).json(singleProject);
    !singleProject &&
      res.status(400).json({ message: "single project can't returned" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    let projectUpdated = await projectModel.updateOne(
      { _id: id },
      { title, description }
    );
    projectUpdated && res.status(200).json(projectUpdated);
    !projectUpdated &&
      res.status(400).json({ message: "project can't updated" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    let projectDeleted = await projectModel.deleteOne({ _id: id });
    projectDeleted && res.status(200).json(projectDeleted);
    !projectDeleted &&
      res.status(400).json({ message: "project can't deleted" });
  } catch (error) {
    res.status(403).json({ message: error.message });
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
