import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import FreelancerModel from "../models/freelancerModel.js";
import ClientModel from "../models/clientModel.js";
import OffersModel from "../models/offerModel.js";
import ProjectsModel from "../models/projectModel.js";
import { sendNotification } from "./../helpers/socket.js";

export const getAllStatistics = async (request, response, next) => {
  try {
    const freelancerCount = await FreelancerModel.countDocuments();
    const clientCount = await ClientModel.countDocuments();
    const offersCount = await OffersModel.countDocuments();
    const projectsCount = await ProjectsModel.countDocuments();
    response.status(201).json({
      message: "succsess",

      freelancerCount,
      clientCount,
      offersCount,
      projectsCount,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const getAllClients = async (requset, response, next) => {
  try {
    const clients = await ClientModel.find(
      {},
      "firstName lastName userName phone email address isVerified isActive _id avatar"
    );

    response.status(201).json({ message: "Succsses", clients });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const getAllFreelancers = async (request, response, next) => {
  try {
    const freelancers = await FreelancerModel.find(
      {},
      "firstName lastName userName phone email address isVerify isActive _id avatar"
    );

    response.status(201).json({ message: "Succsses", freelancers });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
export const deactiveFreelancerById = async (request, response, next) => {
  const { freelancerId } = request.body;

  if (!freelancerId) {
    return response.status(401).json({ error: "please enter a valid Id" });
  }

  try {
    const deactiveFreelancer = await FreelancerModel.findByIdAndUpdate(
      { _id: freelancerId },
      [
        {
          $set: { isActive: { $not: "$isActive" } },
        },
      ],
      {
        new: true,
      }
    );

    if (!deactiveFreelancer) {
      return response
        .status(404)
        .json({ error: "can not find this freelancer" });
    }

    if (!deactiveFreelancer?.isActive) {
      sendNotification({
        userId: freelancerId,
        attachedId: freelancerId,
        relatedTo: "account",
        content: `Your Account Has Been Deactivated Feel Free to contact us: mostaqel@clone.com`,
      });
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
    const deactiveClient = await ClientModel.findByIdAndUpdate(
      clientId,
      [
        {
          $set: { isActive: { $not: "$isActive" } },
        },
      ],
      {
        new: true,
      }
    );

    if (!deactiveClient) {
      return response.status(404).json({ error: "can not find this client" });
    }

    if (!deactiveClient?.isActive) {
      sendNotification({
        userId: clientId,
        attachedId: clientId,
        relatedTo: "account",
        content: `Your Account Has Been Deactivated Feel Free to contact us: mostaqel@clone.com`,
      });
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
