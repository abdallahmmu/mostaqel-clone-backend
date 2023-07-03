import mongoose from "mongoose";
import bcrypt from "bcrypt";
import process from "process";
const Schema = mongoose.Schema;

let FreelancerModel = new Schema({
  username: {
    type: String,
    min: 3,
    max: 25,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  hourRate: {
    type: String,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 16,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
  jobTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  completedProjects: {
    type: Array,
    default: [],
  },
  isActive:{
    type:Boolean,
    default:true
  }
});

FreelancerModel.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});
const setImageURL = (doc) => {
  if (doc.avatar) {
    doc.avatar = `${process.env.BASE_URL}/${doc.avatar}`;
  }
};

FreelancerModel.post("init", (doc) => {
  setImageURL(doc);
});

FreelancerModel.post("save", (doc) => {
  setImageURL(doc);
});
export default mongoose.model("freelancer", FreelancerModel);
