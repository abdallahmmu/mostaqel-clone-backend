import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import { validationResult } from "express-validator";

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

    const chatMessages = await messageModel.create({ chatId, content });
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

// @route get /api/v1/freelancers/:freeancerId/chats
export const getFreelancerChats = async (req, res, next) => {
  // try {
  //   const { chatId } = req.params;
  //   const chatMessages = await messageModel.find({ chatId });
  //   res.status(200).json({
  //     message: "Success",
  //     count: chatMessages.length,
  //     data: chatMessages,
  //   });
  // } catch (error) {
  //   error.message = "Can't Find This Project Offers";
  //   error.statusCode = 404;
  //   next(error);
  // }
};

// @route get /api/v1/clients/:clientId/chats
export const getClientChats = async (req, res, next) => {
  // try {
  //   const { chatId } = req.params;
  //   const chatMessages = await messageModel.find({ chatId });
  //   res.status(200).json({
  //     message: "Success",
  //     count: chatMessages.length,
  //     data: chatMessages,
  //   });
  // } catch (error) {
  //   error.message = "Can't Find This Project Offers";
  //   error.statusCode = 404;
  //   next(error);
  // }
};

// @route get /api/v1/chats/
export const createChat = async (req, res, next) => {
  // try {
  //   const { chatId } = req.params;
  //   const chatMessages = await messageModel.find({ chatId });
  //   res.status(200).json({
  //     message: "Success",
  //     count: chatMessages.length,
  //     data: chatMessages,
  //   });
  // } catch (error) {
  //   error.message = "Can't Find This Project Offers";
  //   error.statusCode = 404;
  //   next(error);
  // }
};

// // @route post /api/v1/projects/:projectId/offers
// export const sendOffer = async (req, res, next) => {
//   try {
//     req.body.freelancerId = req.freelancerId;
//     req.body.projectId = req.params.projectId;
//     console.log(req.body);
//     const newOffer = await offerModel.create(req.body);
//     res.status(200).json({
//       message: "Success",
//       data: newOffer,
//     });
//   } catch (error) {
//     error.message = "Error During Saving";
//     error.statusCode = 500;

//     next(error);
//   }
// };

// // @route delete /api/v1/projects/:projectId/offers/:id
// export const deleteOffer = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     req.body.freelancerId = req.freelancerId;
//     req.body.projectId = req.params.projectId;
//     const updatedOffer = await offerModel.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json({
//       message: "Offer Updated Successfully",
//       data: updatedOffer,
//     });
//   } catch (error) {
//     error.message = "Error During Saving";
//     error.statusCode = 500;

//     next(error);
//   }
// };

// // @route patch /api/v1/projects/:projectId/offers/:id
// export const updateOffer = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     await offerModel.findByIdAndDelete(id);
//     res.status(200).json({
//       message: "Offer Deleted Successfully",
//     });
//   } catch (error) {
//     error.message = "Error During Saving";
//     error.statusCode = 500;

//     next(error);
//   }
// };

// // @route get /api/v1/freelancers/:freelancerId/offers
// export const getFreelancerOffers = async (req, res, next) => {
//   try {
//     const { freelancerId } = req.params;
//     const freelancerOffers = await offerModel.find({ freelancerId });
//     res.status(200).json(freelancerOffers);
//   } catch (error) {
//     error.message = "Can't Find This Freelancer Offers";
//     error.statusCode = 404;

//     next(error);
//   }
// };
