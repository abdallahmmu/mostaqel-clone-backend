import mongoose from "mongoose";
const Schema = mongoose.Schema;

let CategoryModel = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    titleAr: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("category", CategoryModel);
