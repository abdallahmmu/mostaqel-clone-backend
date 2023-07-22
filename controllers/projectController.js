import ApiFeatures from "../helpers/ApiFeatures.js";
import clientModel from "../models/clientModel.js";
import freelancerModel from "../models/freelancerModel.js";
import offerModel from "../models/offerModel.js";
import projectModel from "../models/projectModel.js";
import TransactionModel from "../models/transsactionModel.js";
import { faker } from "@faker-js/faker";



const createProject = async (req, res, next) => {
  let file = req.file;
  // let files = req.files;
  console.log(file)
  // console.log(files)
  try {
    if(!file){
      return res.status(400).json({message: 'no file selected !!'})
    }

    let projectAdded;
    projectAdded = await projectModel.create({...req.body, file: `http://localhost:3300/${file.path}`});

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
    let api = new ApiFeatures(
      req.params,
      projectModel
        .find()
        .populate("clientId categoryId skillsIds")
        .sort("-createdAt")
    )
      .search()
      .paginate(totalDocuments)
      .filter()
      .select()
      .sort();

    let resultProjects = await api.mongooseQuery;

    resultProjects &&
      res.status(200).json({
        resultProjects,
        pagination: api.pagination,
        tot: totalDocuments,
      });

    !resultProjects &&
      res.status(400).json({ error: "all project can't returned" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
const getAllOpenProjects = async (req, res, next) => {
  try {
    let totalDocuments = await projectModel.countDocuments({ status: "open" });
    let api = new ApiFeatures(
      req.query,
      projectModel
        .find({ status: "open" })
        .populate("clientId categoryId skillsIds")
        .sort("-createdAt")
    )
      .search()
      .paginate(totalDocuments)
      .filter()
      .select()
      .sort()
      .Skills()
      .Categories();

    let resultProjects = await api.mongooseQuery;
    if (req.query?.lang == "ar") {
      resultProjects.forEach((pro) => {
        pro.skillsIds.map((sk) => (sk.name = sk.nameAr));
        if (pro.categoryId) {
          pro.categoryId.title = pro.categoryId?.titleAr;
        }
      });
    }
    resultProjects &&
      res.status(200).json({
        resultProjects,
        pagination: api.pagination,
        tot: totalDocuments,
      });

    !resultProjects &&
      res.status(400).json({ error: "all project can't returned" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const acceptOffer = async (req, res, next) => {
  let projetId = req.params.id;
  let offerId = req.body.offerId;

  try {
    let projectUpdated = await projectModel
      .findByIdAndUpdate(
        projetId,
        { status: "pending", offerId },
        {
          new: true,
        }
      )
      .populate("offerId");

    let winnerFreelancer = await offerModel
      .findById(offerId, { freelancerId: 1, _id: 0 })
      .populate("freelancerId");

    projectUpdated &&
      res.status(200).json({ projectUpdated, winnerFreelancer });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const getSingleProject = async (req, res, next) => {
  let projectId = req.params.id;
  try {
    let singleProject = await projectModel
      .findById(projectId)
      .populate("clientId categoryId skillsIds")
      .populate({
        path: "offerId",
        populate: "freelancerId",
      });
    if (req.query?.lang == "ar") {
      singleProject.skillsIds.map((skill) => (skill.name = skill.nameAr));
      if (singleProject.description_ar) {
        singleProject.description = singleProject.description_ar;
      }
    }
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

const completeProject = async (req, res, next) => {
  let { freelancerId, clientId, offerId } = req.body;
  const { id } = req.params;
  let offer = await offerModel.findById(offerId);

  try {
    let project = await projectModel.findById(id);
    let client = await clientModel.findById(clientId);

    if (client.totalMoney < offer.amount) {
      return res.status(500).json({
        message: "the client charge is less than offer amount money !!",
      });
    }

    if (project.status !== "pending") {
      return res
        .status(500)
        .json({ message: "this project wasnot accpted yet !!" });
    } else {
      let session = Math.random() * 10;

      let freelancer = await freelancerModel.findByIdAndUpdate(
        freelancerId,
        {
          $inc: { totalMoney: offer.amount * 0.8 },
          $push: { completedProjects: id },
        },
        { new: true }
      );

      let client = await clientModel.findByIdAndUpdate(
        clientId,
        { $inc: { totalMoney: -offer.amount } },
        { new: true }
      );

      let project = await projectModel.findByIdAndUpdate(
        id,
        { status: "complete" },
        { new: true }
      );

      let transToFreelancer = await TransactionModel.create({
        amount: offer.amount,
        userId: freelancerId,
        mode: "profit",
        sessionId: session,
      });
      let transFromClient = await TransactionModel.create({
        amount: offer.amount,
        userId: clientId,
        mode: "withdraw",
        sessionId: session,
      });

      res.status(200).json({
        message: "the project ended successfully ",
        freelancer,
        client,
        project,
        transToFreelancer,
        transFromClient,
      });
    }
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
const deactivateProject = async (req, res, next) => {
  let { id } = req.params;

  try {
    if (!id) {
      return res.status(500).json({ message: "project is not exist!!" });
    }

    let project = await projectModel.findById(id);

    if (project.status == "pending") {
      return res
        .status(500)
        .json({ message: "can not activate project with Pending Status" });
    }

    let resultProject = await projectModel.findByIdAndUpdate(
      id,
      { status: "close" },
      { new: true }
    );

    res.status(200).json(resultProject);
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
export {
  createProject,
  getAllProjects,
  getAllOpenProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  acceptOffer,
  deactivateProject,
  // saveProjectFiles,
  completeProject,
};
