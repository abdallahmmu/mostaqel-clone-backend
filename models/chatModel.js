import { Schema, model } from "mongoose";

const chatSchema = Schema(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "freelancer",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    lastMessage: {
      content: {
        type: String,
        default: "Hi !",
      },
      sender: {
        type: String,

        enums: ["freelancer", "client"],
        default: "client",
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = model("chat", chatSchema);
export default chatModel;
