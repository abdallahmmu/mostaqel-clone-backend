import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import { validationResult } from "express-validator";

// @route get /api/v1/chats/
export const createChat = async (req, res, next) => {
  try {
    req.body.clientId = req.clientId; // projectId,freelancerId
    const newChat = await chatModel.create(req.body);
    res.status(200).json({
      message: "Success",
      data: newChat,
    });
  } catch (error) {
    error.message = "Can't Find This Project Offers";
    error.statusCode = 404;
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
    error.message = "Can't Find This Project Offers";
    error.statusCode = 404;

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
    error.message = "Can't Find This Project Offers";
    error.statusCode = 404;
    next(error);
  }
};

// @route get /api/v1/freelancers/myChats
export const getFreelancerChats = async (req, res, next) => {
  try {
    const { freelancerId } = req.params;
    const freelancerChats = await chatModel.find({ freelancerId });
    res.status(200).json({
      message: "Success",
      count: freelancerChats.length,
      data: freelancerChats,
    });
  } catch (error) {
    error.message = "Can't Find This Project Offers";
    error.statusCode = 404;
    next(error);
  }
};

// @route get /api/v1/clients/myChats
export const getClientChats = async (req, res, next) => {
  try {
    const { clientId } = req;
    const clientChats = await chatModel.find({ clientId });
    res.status(200).json({
      message: "Success",
      count: clientChats.length,
      data: clientChats,
    });
  } catch (error) {
    error.message = "Can't Find This Project Offers";
    error.statusCode = 404;
    next(error);
  }
};
