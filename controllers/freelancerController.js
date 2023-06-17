import FreelancerModel from "../models/freelancerModel.js";
import { validationResult } from "express-validator";
import { deleteFile } from "../helpers/deleteFile.js";
//bcrypt and jwt
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Create ===> Register A Freelancer
export const registerFreelancer = async (request, response, next) => {
  const errors = validationResult(request)
    .array()
    .map((el) => {
      return { msg: el.msg, path: el.path };
    });
  if (errors.length > 0) {
    return response.status(404).json({ errors });
  }

  try {
    let newFreelancer = new FreelancerModel(request.body);
    const createdFreelancer = await newFreelancer.save();
    response.status(200).json({ message: "Freelancer Created Sucssfully!" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//POST ===> Login A Freelancer

export const loginFreelancer = async (request, response, next) => {
  const errors = validationResult(request)
    .array()
    .map((el) => {
      return { msg: el.msg, path: el.path };
    });

  if (errors.length > 0) {
    return response.status(404).json({ errors });
  }
  const email = request.body.email;
  const password = request.body.password;
  
  try {
    const freelancerAccout = await FreelancerModel.findOne({ email: email });
    const hashedPassword = await bcrypt.compare(
      password,
      freelancerAccout.password
    );
    if (!hashedPassword) {
      return response.status(401).json({ error: "invalid email or password" });
    }

    //Generate JWT Token
    const token = jwt.sign(
      {
        email: freelancerAccout.email,
        freelancerId: freelancerAccout._id.toString(),
        username: freelancerAccout.username,
        role: "freelancer",
      },
      process.env.SECRETE_KEY,
      {
        algorithm: "HS384",
        expiresIn: "2h",
      }
    );

    response.status(200).json({
      message: "You Have Been Login Sucssesfully!",
      token,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//GET ===> Get FreelancerById

export const getFreelancerById = async (request, response, next) => {
  const freelancerId = request.params.id;

  /*   if (!req.freelancerId || !request.params.id) { // it was for authorization but now anyone can get any freelancer details
    return response
      .status(401)
      .json({ error: "Your Are Not Allowed To Get This Data" });
  } */

  try {
    const freelancerAccount = await FreelancerModel.findOne(
      { _id: freelancerId },
      "isVerify firstName lastName avatar email jobTitle phoneNumber hourRate description completedProjects username"
    ).populate("categoryId");
    if (!freelancerAccount) {
      return response.status(404).json({ error: "user not found" });
    }
    response.status(200).json({ data: freelancerAccount });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//Update ===> Update Freelancer

export const updateFreelancerById = async (request, response, next) => {
  const freelancerId = request.freelancerId; // coming from token
  const newUpdate = { ...request.body };

  //checking for incomming param to be equal the current freelancerId
  if (request.params.id !== freelancerId) {
    return response.status(404).json({ error: "freelancer id is not valid" });
  }

  try {
    const freelancerAccount = await FreelancerModel.findOne({
      _id: freelancerId,
    });

    if (!freelancerAccount) {
      return response
        .status(404)
        .json({ error: "can not find this freelancer" });
    }

    const updatedData = await FreelancerModel.updateOne(
      { _id: freelancerId },
      newUpdate
    );

    response.status(200).json({ message: "your data has been updated !" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const uploadImageForFreelancer = async (request, response, next) => {
  const avatarPhoto = request.file;

  if (!avatarPhoto) {
    return response.status(404).json({ error: "no file to uploaded" });
  }

  try {
    const freelancerAccount = await FreelancerModel.findById(
      request.freelancerId
    );
    if (freelancerAccount.avatar) {
      deleteFile(freelancerAccount.avatar);
    }

    freelancerAccount.avatar = avatarPhoto.path;
    await freelancerAccount.save();
    freelancerAccount.avatar = response
      .status(200)
      .json({ message: "your photo has been uploaded" });
  } catch (error) {
    error.message = "server error faild to upload";
    error.statusCode = 500;

    next(error);
  }
};

//GET ===> All Freelancers

export const getAllFreelancers = async (request, response, next) => {
  try {
    const allFreelancers = await FreelancerModel.find(
      {},
      "isVerify firstName lastName avatar email jobTitle phoneNumber hourRate description completedProjects username"
    ).sort({ username: -1 });

    response.status(200).json({ allFreelancers });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
