import express from "express";
import { checkSchema } from "express-validator";

//Controller
import {
  getChatMessages,
  sendMessage,
  getFreelancerChats,
  getClientChats,
  createChat,
  getFreelancerNotReadMessages,
  getClientNotReadMessages,
} from "../controllers/chatController.js";

//Schema Validator

//Authentication Middlewar
import { isClient } from "../middlewares/clientMiddlewares/isClient.js";
import { isFreelancersAuth } from "../middlewares/freelancersMiddlewares/isFreelancersAuth.js";
import { uploadFiles } from "../middlewares/uploadMiddleware.js";
export const chatRoute = express.Router();

// @desc Create New Chat Between Between Client And Freelancer
// @route post /api/v1/chats/
// @access client
chatRoute.post("/v1/chats", isClient, createChat);

// @desc get all messages for specific chat
// @route get /api/v1/chats/:chatId/messages
// @access freelancer, the client they chat to each other
chatRoute.get("/v1/chats/:chatId/messages", getChatMessages);

// @desc Send Message
// @route post /api/v1/chats/:chatId/messages
// @access freelancer, the client they chat to each other
chatRoute.post(
  "/v1/chats/:chatId/messages",
  uploadFiles("chats", [
    {
      name: "attachments",
      maxCount: 5,
    },
  ]),
  // isFreelancersAuth,
  sendMessage
);

// @desc get all chats for specific freelancer
// @route get /api/v1/freelancers/chats
// @access freelancer
chatRoute.get("/v1/freelancer/chats", isFreelancersAuth, getFreelancerChats);
chatRoute.get(
  "/v1/freelancer/messages",
  isFreelancersAuth,
  getFreelancerNotReadMessages
);

// @desc get all chats for specific client
// @route get /api/v1/clients/chats
// @access client
chatRoute.get("/v1/client/chats", isClient, getClientChats);
chatRoute.get("/v1/client/messages", isClient, getClientNotReadMessages);
