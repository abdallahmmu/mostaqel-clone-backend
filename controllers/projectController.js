import ApiFeatures from "../helpers/ApiFeatures.js";
import clientModel from "../models/clientModel.js";
import freelancerModel from "../models/freelancerModel.js";
import offerModel from "../models/offerModel.js";
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
    let api = new ApiFeatures(req.query, projectModel.find().populate('clientId categoryId skillsIds').sort('-createdAt'))
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

const acceptOffer = async (req, res, next) => {
  let projetId = req.params.id;
  let offerId = req.body.offerId;

  try {
    let projectUpdated = await projectModel.findByIdAndUpdate(
      projetId,
      { status: "pending", offerId },
      {
        new: true,
      }
    ).populate("offerId")

    let winnerFreelancer = await offerModel.findById(offerId, {freelancerId: 1, _id: 0}).populate('freelancerId')

    projectUpdated && res.status(200).json({ projectUpdated , winnerFreelancer});
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const getSingleProject = async (req, res, next) => {
  let projectId = req.params.id;
  try {
    let singleProject = await projectModel.findById(projectId)
    .populate('clientId categoryId skillsIds')
    .populate({
      path: 'offerId',
      populate: 'freelancerId'
    })
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




const completeProject = async (req , res, next) => {
  let { projectId, freelancerId,  clientId } = req.body;

  try {
  let projectAmount = await projectModel.findById(projectId, { range: 1});
  let clientCharge = await clientModel.findById(clientId, { totalMoney: 1});

  if(clientCharge.totalMoney < projectAmount.range){
    res.status(500).json({message: 'the client charge is less than pproject range money !!'});
    
  }else{
    let freelancer = await freelancerModel.findByIdAndUpdate(freelancerId, { $inc: { totalMoney: projectAmount.range}}, { new : true});
    let client = await clientModel.findByIdAndUpdate(clientId, { $dec: { totalMoney: projectAmount.range}}, { new : true});
    let project = await projectModel.findByIdAndUpdate(projectId, { status: 'completed'}, { new : true});

    res.status(200).json({message: 'the project ended successfully ', freelancer, client , project});
  }
  res.status(201).json({projectAmount})
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
}


export {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  acceptOffer,
  completeProject
};
