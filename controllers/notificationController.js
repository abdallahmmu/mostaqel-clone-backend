import notificationModel from "../models/notificationModel.js";
import { getIo } from "./../helpers/socket.js";
export const getMyNotifications = async (request, response, next) => {
  try {
    const notification = await notificationModel.find({
      userId: request.params.userId,
    });
    const notificationIo = getIo().of("/notification");

    notificationIo.on("connection", (socket) => {
      socket.on("LogIn", (userId) => {
        socket.join(userId);
        // console.log(`${userId} Has Logged In`);
      });

      // Handle disconnections
      socket.on("disconnect", () => {
        // console.log("A user disconnected");
      });
    });
    response.status(200).json({ message: "Success", results: notification });
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
};
export const readGeneralNotifications = async (request, response, next) => {
  try {
    const notification = await notificationModel.updateMany(
      {
        userId: request.params.userId,
        relatedTo: { $ne: "messages" },
      },
      { status: true }
    );

    response.status(200).json({ message: "Success", results: notification });
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
};
export const readMessageslNotifications = async (request, response, next) => {
  try {
    const notification = await notificationModel.updateMany(
      {
        userId: request.params.userId,
        relatedTo: "messages",
      },
      { status: true }
    );

    response.status(200).json({ message: "Success", results: notification });
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
};
