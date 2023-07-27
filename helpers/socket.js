import { Server } from "socket.io";
import notificationModel from "../models/notificationModel.js";
let io;

export const initIo = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("fail to setup io");
  }
  return io;
};
export const sendNotification = async (notification) => {
  const newNotification = await notificationModel.create(notification);
  // console.log(notification, "From Server");
  // Broadcast the notification to all clients in the chat room
  io.of("/notification")
    .to(notification.userId.toString())
    .emit("newNotification", newNotification);
};
