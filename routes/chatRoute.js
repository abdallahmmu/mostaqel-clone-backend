import express from "express";
import { checkSchema } from "express-validator";

//Controller
import {
  getChatMessages,
  sendMessage,
  getFreelancerChats,
  getClientChats,
  createChat,
} from "../controllers/chatController.js";

//Schema Validator

//Authentication Middlewar
import { isFreelancersAuth } from "../middlewares/freelancersMiddlewares/isFreelancersAuth.js";

export const chatRoute = express.Router();

// @desc get all messages for specific chat
// @route get /api/v1/chats/:chatId/messages
// @access freelancer, the client they chat to each other
chatRoute.get(
  "/:chatId/messages",
  // isFreelancersAuth,
  getChatMessages
);

// @desc Send Message
// @route post /api/v1/chats/:chatId/messages
// @access freelancer, the client they chat to each other
chatRoute.post(
  "/:chatId/messages",
  // isFreelancersAuth,
  sendMessage
);

// @desc get all chats for specific freelancer
// @route get /api/v1/chats/freelancers/:freeancerId
// @access freelancer
chatRoute.get(
  "/freelancers/:freeancerId",
  // isFreelancersAuth,
  getFreelancerChats
);
// @desc get all chats for specific client
// @route get /api/v1/chats/clients/:clientId
// @access client
chatRoute.get(
  "/clients/:clientId",
  // isClientAuth,
  getClientChats
);
// @desc Create New Chat Between Between Client And Freelancer
// @route get /api/v1/chats/
// @access client
chatRoute.post(
  "",
  // isFreelancersAuth,
  createChat
);
