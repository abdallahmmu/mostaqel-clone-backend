const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryModel = new Schema(
  {
    title: {
      type: String,
      require: true,
      unique: ture,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('categories',CategoryModel)
