import { Schema, model } from "mongoose";

const notificationSchema = Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    relatedTo: {
      type: String,
      enum: ["projects", "account", "transaction", "messages"],
    },
    attachedId: {
      type: Schema.Types.ObjectId,
    },

    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = model("notification", notificationSchema);
export default notificationModel;
