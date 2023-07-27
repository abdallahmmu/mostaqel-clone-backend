import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import { validationResult } from "express-validator";
import { sendNotification, getIo } from "./../helpers/socket.js";
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
    sendNotification({
      userId: freelancerId,
      relatedTo: "messages",
      attachedId: newChat._id,
      content: `You Have New Message About ${req.body.title}`,
    });
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
    const { chatId } = req.params;
    const chatMessages = await messageModel.find({ chatId });
    const chatDetails = await chatModel
      .findById(chatId)
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
    // getIo().emit("joinRoom", chatId);
    // getIo().on("message", (message) => {
    //   if (message.chatId === chatId) {
    //     res.status(200).json({
    //       message: "Success",
    //       data: [...chatMessages, message],
    //     });
    //   }
    // });
    // getIo().on("connection", (socket) => {
    //   console.log(socket.id);

    //   socket.on("join_room", (data) => {
    //     socket.join(data);
    //     console.log("User Joined Room: " + data);
    //   });
    //   socket.on("send_message", async (data) => {
    //     console.log(data);
    //     await messageModel.create(data);
    //     socket.to(data.ch).emit("receive_message", data.content);
    //   });

    //   socket.on("disconnect", () => {
    //     console.log("USER DISCONNECTED");
    //   });
    // });

    res.status(200).json({
      message: "Success",
      count: chatMessages.length,
      details: chatDetails,
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
    if (req.files.attachments) {
      req.body.attachments = [];
      req.files.attachments.map((file) => {
        // Save image into our db
        req.body.attachments.push(file.filename);
        console.log(file.filename);
      });
    }

    const newMessage = await messageModel.create(req.body);
    getIo().to(req.params.chatId).emit("message", newMessage);
    await chatModel.findByIdAndUpdate(req.params.chatId, {
      lastMessage: {
        sender: newMessage.sender,
        content: newMessage.content,
        read: false,
      },
    });
    res.status(200).json({
      message: "Success",
      results: newMessage,
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
    const freelancerChats = await chatModel
      .find({ freelancerId })
      .sort("-updatedAt")
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
      count: freelancerChats.length,
      results: freelancerChats,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
export const getFreelancerNotReadMessages = async (req, res, next) => {
  try {
    const { freelancerId } = req;
    const freelancerChats = await chatModel.find({
      freelancerId,
    });
    console.log(freelancerChats);
    const filteredChats = freelancerChats.filter((chat) => {
      const lastMessage = chat.lastMessage;
      return lastMessage.sender === "client" && !lastMessage.read;
    });

    res.status(200).json({
      message: "Success",
      count: filteredChats.length,
      results: filteredChats,
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
      .sort("-updatedAt")
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
export const getClientNotReadMessages = async (req, res, next) => {
  try {
    const { clientId } = req;
    const clientChats = await chatModel.find({
      clientId,
    });
    const filteredChats = clientChats.filter((chat) => {
      const lastMessage = chat.lastMessage;
      return lastMessage.sender === "freelancer" && !lastMessage.read;
    });
    res.status(200).json({
      message: "Success",
      count: filteredChats.length,
      results: filteredChats,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
