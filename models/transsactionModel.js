import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TransactionModel = new Schema(
  {
    email: {
      type:String,
      required:true
    },
    amount: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("transaction", TransactionModel);
