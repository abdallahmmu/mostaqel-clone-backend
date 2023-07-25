import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, min: 3, max: 100, required: true },
    title_ar: { type: String, min: 3, max: 100, required: false },
    description: { type: String, min: 20, max: 200, required: true },
    description_ar: { type: String, min: 20, max: 200, required: false },
    status: {
      type: String,
      enum: ["open", "pending", "complete", "close"],
      default: "open",
      required: true,
    },
    range: { type: Number, required: true, min: 1, max: 1000000 },
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
    duration: {
      type: Number,
      min: 1,
      required: true,
    },
    files: {
      type: [String],
    },
    numOffers: {
      type: Number,
      default: 0,
    },
    avgPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const projectModel = model("project", projectSchema);

export default projectModel;
