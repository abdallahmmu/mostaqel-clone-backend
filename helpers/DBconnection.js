import mongoose from "mongoose";
import { initIo } from "./socket.js";
import messageModel from "../models/messageModel.js";
import chatModel from "../models/chatModel.js";

export const init = async (app) => {
  try {
    const CONNECTION = await mongoose.connect(process.env.DB_CONNECTION);

    if (CONNECTION) {
      console.log("DB CONNECTED");
      let server = app.listen(process.env.PORT, () => {
        console.log("APP IS WORKING PORT " + process.env.PORT);
      });

      const io = initIo(server);
      io.on("connection", (socket) => {
        // Handle messages for the chat room
        socket.on("joinRoom", (chatId) => {
          socket.join(chatId);
          // console.log(`User joined chat room ${chatId}`);
        });
        socket.on("markAsRead", async (chatId, role) => {
          const chat = await chatModel.findById(chatId);
          if (chat.lastMessage.sender !== role) {
            chat.lastMessage.read = true;
            chat.markModified("updatedAt");
            await chat.save({ timestamps: { updatedAt: false } });
          }
        });

        // socket.on("newMessage", async (message) => {
        //   const newMessage = await messageModel.create(message);
        //   await chatModel.findByIdAndUpdate(message.chatId, {
        //     lastMessage: {
        //       sender: newMessage.sender,
        //       content: newMessage.content,
        //       read: false,
        //     },
        //   });

        //   // Broadcast the message to all clients in the chat room
        //   io.to(message.chatId).emit("message", newMessage);
        // });

        // Handle disconnections
        socket.on("disconnect", () => {
          console.log("A user disconnected");
        });
      });
    }
  } catch (error) {
    console.log("FAILD TO CONNECT");
    process.exit();
  }
};
