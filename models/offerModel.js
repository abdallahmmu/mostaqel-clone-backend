import { Schema, model } from "mongoose";

const offerSchema = Schema(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "freelancers",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    duration: {
      type: Number,
      min: 1,
      required: true,
    },
    amount: {
      type: Number,
      min: 10,
      required: true,
    },
    description: {
      minLenght: 10,
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const offerModel = model("offer", offerSchema);
export default offerModel;
