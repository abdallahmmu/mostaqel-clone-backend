const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const FreelancerModel = new Schema({
  username: {
    type: String,
    min: 3,
    max: 25,
    unique: true,
    require: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
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
    require: true,
    min: 8,
    max: 16,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
  jobTitle: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  completedProjects: {
    type: Array,
    default: [],
  },
});


FreelancerModel.pre('save', async function(next){
  this.password = await bcrypt.hash(this.password,12)
  next()
})

module.exports = mongoose.model('freelancers',FreelancerModel)