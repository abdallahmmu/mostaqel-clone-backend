import mongoose from "mongoose";
const Schema = mongoose.Schema;

let CategoryModel = new Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model('categories',CategoryModel)
