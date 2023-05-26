import { Schema, model } from "mongoose";

const messageSchema = Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = model("message", messageSchema);
export default messageModel;
