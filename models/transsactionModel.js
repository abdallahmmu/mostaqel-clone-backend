import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TransactionModel = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("transaction", TransactionModel);
