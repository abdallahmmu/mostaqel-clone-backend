import { Schema, Types, model } from "mongoose";

let skillSchema = Schema({
  name: {
    type: String,
    minLength: 3,
  },
  nameAr: {
    type: String,
    minLength: 3,
  },

  categoryId: {
    type: Types.ObjectId,
    ref: "category",
    required: true,
  },
});

let skillModel = model("skill", skillSchema);

export default skillModel;
