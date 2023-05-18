const FreelancerModel = require("./../models/freelancerModel");
const { validationResult } = require("express-validator");

//bcrypt and jwt
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Create ===> Register A Freelancer
exports.registerFreelancer = async (request, response, next) => {
  const errors = validationResult(request)
    .array()
    .map((el) => {
      return { msg: el.msg, path: el.path };
    });
  if (errors.length > 0) {
    return response.status(404).json({ errors });
  }

  try {
    const newFreelancer = new FreelancerModel(request.body);

    const createdFreelancer = await newFreelancer.save();

    response.status(200).json({ massage: "Freelancer Created Sucssfully!" });
  } catch (error) {
    error.message = "this freelancer already exsist!";
    error.statusCode = 500;

    next(error);
  }
};

//POST ===> Login A Freelancer

exports.loginFreelancer = async (request, response, next) => {
  const errors = validationResult(request)
    .array()
    .map((el) => {
      return { msg: el.msg, path: el.path };
    });

  if (errors.length > 0) {
    return response.status(404).json({ errors });
  }
  const email = request.body.email;
  const password = request.body.password;

  try {
    const freelancerAccout = await FreelancerModel.findOne({ email: email });
    const hashedPassword = await bcrypt.compare(
      password,
      freelancerAccout.password
    );
    if (!hashedPassword) {
      return response
        .status(401)
        .json({ massage: "invalid email or password" });
    }

    //Generate JWT Token
    const token = jwt.sign(
      {
        email: freelancerAccout.email,
        freelancerId: freelancerAccout._id.toString(),
        role: "freelancer",
      },
      process.env.SECRETE_KEY,
      {
        algorithm: "HS384",
        expiresIn: "2h",
      }
    );

    response.status(200).json({
      massage: "You Have Been Login Sucssesfully!",
      token,
      freelancerId: freelancerAccout._id,
      role: "freelancer",
    });
  } catch (error) {
    error.message = "invalid email or password";
  }

  console.log(password);
  response.status(200).json({ massage: "Login into Freelancer Accout" });
};

//GET ===> Get FreelancerById

exports.getFreelancerById = async (request, response, next) => {
  const freelancerId = request.freelancerId;

  try {
    const freelancerAccount = await FreelancerModel.findOne(
      { _id: freelancerId },
      "isVerify firstName lastName avatar email jobTitle phoneNumber hourRate description completedProjects username"
    ).populate("categoryId");
    response.status(200).json({ data: freelancerAccount });
  } catch (error) {
    error.message = "can not find freelancer account";
    error.statusCode = 401;
    next(error);
  }
};

//Update ===> Update Freelancer

exports.updateFreelancerById = async (request, response, next) => {
  const freelancerId = request.freelancerId;
  const newUpdate = { ...request.body };

  //checking for incomming param to be equal the current freelancerId
  if (request.params.id !== freelancerId) {
    return response.status(404).json({ error: "param is not an id" });
  }

  try {
    const freelancerAccount = await FreelancerModel.findOne({
      _id: freelancerId,
    });

    if (!freelancerAccount) {
      return response
        .status(404)
        .json({ error: "can not find this freelancer" });
    }

    const updatedData = await FreelancerModel.updateOne(
      { _id: freelancerId },
      newUpdate
    );

    response.status(200).json({ massage: "your data has been updated !" });
    console.log(updatedData);
  } catch (error) {
    error.message = "can not update this freelancer";
    error.statusCode = 401;
    next(error);
  }
};
