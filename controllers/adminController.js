import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import FreelancerModel from "./../models/freelancerModel.js";
import ClientModel from "./../models/clientModel.js";
import OffersModel from "./../models/offerModel.js";
import ProjectsModel from "./../models/projectModel.js";

export const getAllStatistics = async (request, response, next) => {
  try {
    const freelancerCount = await FreelancerModel.countDocuments();
    const clientCount = await ClientModel.countDocuments();
    const offersCount = await OffersModel.countDocuments();
    const projectsCount = await ProjectsModel.countDocuments();
    response.status(201).json({
      message: "succsess",
      data: [
        {
          freelancerCount,
          clientCount,
          offersCount,
          projectsCount,
        },
      ],
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const loginAdmin = (request, response, next) => {
  response.status(200).json({ message: "admin Login" });
};

export const deactiveFreelancerById = async (request, response, next) => {
  const { freelancerId } = request.body;

  if (!freelancerId) {
    return response.status(401).json({ error: "please enter a valid Id" });
  }

  try {
    const deactiveFreelancer = await FreelancerModel.updateOne(
      { _id: freelancerId },
      [
        {
          $set: { isActive: { $not: "$isActive" } },
        },
      ]
    );

    if (!deactiveFreelancer) {
      return response
        .status(404)
        .json({ error: "can not find this freelancer" });
    }
    response.status(200).json({ message: "Sucssess" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const deactiveClientById = async (request, response, next) => {
  const { clientId } = request.body;

  if (!clientId) {
    return response
      .status(401)
      .json({ error: "please enter a valid clientId" });
  }

  try {
    const deactiveClient = await ClientModel.updateOne({ _id: clientId }, [
      {
        $set: { isActive: { $not: "$isActive" } },
      },
    ]);

    if (!deactiveClient) {
      return response.status(404).json({ error: "can not find this client" });
    }
    response.status(200).json({ message: "Sucssess" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const verifyFreelancerById = async (request, response, next) => {
  const { freelancerId } = request.body;

  if (!freelancerId) {
    return response.status(401).json({ error: "please enter a valid Id" });
  }

  try {
    const verifyFreelancer = await FreelancerModel.updateOne(
      { _id: freelancerId },
      [
        {
          $set: { isVerify: { $not: "$isVerify" } },
        },
      ]
    );

    if (!verifyFreelancer) {
      return response
        .status(404)
        .json({ error: "can not find this freelancer" });
    }
    response.status(200).json({ message: "Sucssess" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const verifyClientById = async (request, response, next) => {
  const { clientId } = request.body;

  if (!clientId) {
    return response
      .status(401)
      .json({ error: "please enter a valid clientId" });
  }

  try {
    const verifyClient = await ClientModel.updateOne({ _id: clientId }, [
      {
        $set: { isVerified: { $not: "$isVerified" } },
      },
    ]);

    if (!verifyClient) {
      return response.status(404).json({ error: "can not find this client" });
    }
    response.status(200).json({ message: "Sucssess" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
