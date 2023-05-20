
import FreelancerModel from "../models/freelancerModel.js";
import CategoryModel from "./../models/categoryModel.js";

export const freelancerRegisterSchemaValidations = {
  username: {
    isAlphanumeric:true,
    notEmpty: true,
    optional: false,
    isLength: { options: { min: 8 } },
    errorMessage: "username should be string with at leaset 8 alphanumeric",
    custom: {
      options: async (value) => {
        const freelancer = await FreelancerModel.findOne({ username: value });
        if (freelancer) {
          throw new Error("username is already exist");
        }
      },
    },
  },
  password: {
    isStrongPassword: true,
    notEmpty: true,
    optional: false,
    isLength: { options: { min: 8, max: 32 } },
    errorMessage:
      "password should be string with at leaset 8 digits, it has at least 1 lowercase, 1 uppercase letter, and one symbol",
  },
  firstName: {
    isAlpha: true,
    notEmpty: true,
    optional: false,
    isLength: { options: { min: 3, max: 15 } },
    errorMessage:
      "firstname should be string with at leaset 8 and at most 15 alphapetic charachters",
  },
  lastName: {
    isAlpha: true,
    notEmpty: true,
    optional: false,
    isLength: { options: { min: 3, max: 15 } },
    errorMessage:
      "lastname should be string with at leaset 8 and at most 15 alphapetic charachters",
  },
  email: {
    isEmail: true,
    notEmpty: true,
    custom: {
      options: async (value) => {
        const freelancer = await FreelancerModel.findOne({ email: value });
        if (freelancer) {
          throw new Error("email is already exist");
        }
      },
    },
  },
  jobTitle: {
    notEmpty: true,
  },
  categoryId: {
    notEmpty: true,
    custom:{
      options: async (value) =>{
        const category = await CategoryModel.findOne({_id:value})

        if(!category){
          throw new Error('Can not Find This Category Please Enter A Valid Category!')
        }
      }
    }
  },
  phoneNumber:{
    isMobilePhone:true,
    custom:{
      options: async (value) => {
        const phoneNumberExsist = await FreelancerModel.findOne({phoneNumber:value})

        if(phoneNumberExsist){
          throw new Error('This phone number is already exsist')
        }
      }
    }
  }
};

