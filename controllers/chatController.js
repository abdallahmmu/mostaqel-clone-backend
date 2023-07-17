import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import { validationResult } from "express-validator";

// @route get /api/v1/chats/
export const createChat = async (req, res, next) => {
  try {
    req.body.clientId = req.clientId; // projectId,freelancerId
    const { projectId, freelancerId, clientId } = req.body;
    const foundChat = await chatModel.findOne({
      projectId,
      freelancerId,
      clientId,
    });
    if (foundChat) {
      return res.status(200).json({
        message: "Success",
        results: foundChat,
      });
    }
    const newChat = await chatModel.create(req.body);
    return res.status(200).json({
      message: "Success",
      results: newChat,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

// @route get /api/v1/chats/:chatId/messages
export const getChatMessages = async (req, res, next) => {
  try {
    console.log(req.params);
    const { chatId } = req.params;
    const chatMessages = await messageModel.find({ chatId });
    res.status(200).json({
      message: "Success",
      count: chatMessages.length,
      data: chatMessages,
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

// @route post /api/v1/chats/:chatId/messages
export const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const sender = req.freelancerId ? "freelancer" : "client";
    const chatMessages = await messageModel.create({ chatId, content, sender });
    res.status(200).json({
      message: "Success",
      count: chatMessages.length,
      data: chatMessages,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

// @route get /api/v1/freelancers/chats
export const getFreelancerChats = async (req, res, next) => {
  try {
    const { freelancerId } = req;
    const freelancerChats = await chatModel.find({ freelancerId });
    res.status(200).json({
      message: "Success",
      count: freelancerChats.length,
      data: freelancerChats,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

// @route get /api/v1/clients/chats
export const getClientChats = async (req, res, next) => {
  try {
    const { clientId } = req;
    const clientChats = await chatModel
      .find({ clientId })
      .populate({
        path: "projectId",
        select: "_id title",
      })
      .populate({
        path: "clientId",
        select: "_id firstName lastName",
      })
      .populate({
        path: "freelancerId",
        select: "_id firstName lastName",
      });

    res.status(200).json({
      message: "Success",
      count: clientChats.length,
      results: clientChats,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
