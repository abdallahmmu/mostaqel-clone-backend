import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, min: 3, max: 30, required: true },
    description: { type: String, min: 20, max: 100, required: true },
    status: {
      type: String,
      enum: ["open", "pending", "complete", "close"],
      default: "open",
      required: true,
    },
    range: { type: Number, required: true },
    skillsIds: { type: [Schema.Types.ObjectId], ref: "skill" },
    clientId: { type: Schema.Types.ObjectId, ref: "client", required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    offerId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "offer",
    },
  },
  { timestamps: true }
);

const projectModel = model("project", projectSchema);
export default projectModel;
