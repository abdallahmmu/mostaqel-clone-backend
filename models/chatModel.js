import { Schema, model } from "mongoose";

const chatSchema = Schema(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "freelancer",
      required: true,
    },
    cleintId: {
      type: Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = model("chat", chatSchema);
export default chatModel;
