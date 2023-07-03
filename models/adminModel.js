import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import process from "process";

let adminSchema = Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 16,
  },
  role: {
    type: String,
    required: true,
    enums: ["superAdmin", "admin"],
  },
});

adminSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 12);

  next();
});
export default model("admin", adminSchema);
