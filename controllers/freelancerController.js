import FreelancerModel from "../models/freelancerModel.js";
import { validationResult } from "express-validator";
import { deleteFile } from "../helpers/deleteFile.js";
//bcrypt and jwt
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendNotification } from "./../helpers/socket.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

//Create ===> Register A Freelancer
export const registerFreelancer = async (request, response, next) => {
  const errors = validationResult(request)
    .array()
    .map((el) => {
      return { msg: el.msg, path: el.path };
    });
  if (errors.length > 0) {
    return response.status(404).json({ errors });
  }

  try {
    let newFreelancer = new FreelancerModel(request.body);
    const createdFreelancer = await newFreelancer.save();
    response.status(200).json({ message: "Freelancer Created Sucssfully!" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//POST ===> Login A Freelancer

export const loginFreelancer = async (request, response, next) => {
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
      return response.status(401).json({ error: "invalid email or password" });
    }

    //Generate JWT Token
    const token = jwt.sign(
      {
        email: freelancerAccout.email,
        freelancerId: freelancerAccout._id.toString(),
        username: freelancerAccout.username,
        role: "freelancer",
      },
      process.env.SECRETE_KEY,
      {
        algorithm: "HS384",
        expiresIn: "2h",
      }
    );

    response.status(200).json({
      message: "You Have Been Login Sucssesfully!",
      token,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//GET ===> Get FreelancerById

export const getFreelancerById = async (request, response, next) => {
  const freelancerId = request.params.id;
  try {
    const freelancerAccount = await FreelancerModel.findOne(
      { _id: freelancerId },
      "isVerify firstName lastName avatar email jobTitle phoneNumber hourRate description completedProjects username skill totalMoney isActive availableOffers nextCharge"
    ).populate("categoryId");
    if (!freelancerAccount) {
      return response.status(404).json({ error: "user not found" });
    }
    response.status(200).json({ data: freelancerAccount });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//Update ===> Update Freelancer

export const updateFreelancerById = async (request, response, next) => {
  const freelancerId = request.freelancerId; // coming from token
  const newUpdate = { ...request.body };

  //checking for incomming param to be equal the current freelancerId
  if (request.params.id !== freelancerId) {
    return response.status(404).json({ error: "freelancer id is not valid" });
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

    await freelancerAccount.updateOne(newUpdate);
    /*     const updatedData = await FreelancerModel.updateOne(
      { _id: freelancerId },
      newUpdate
    ); */
    response.status(200).json({ message: "your data has been updated !" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const uploadImageForFreelancer = async (request, response, next) => {
  const avatarPhoto = request.file;

  if (!avatarPhoto) {
    return response.status(404).json({ error: "no file to uploaded" });
  }

  try {
    const freelancerAccount = await FreelancerModel.findById(
      request.freelancerId
    );
    if (freelancerAccount.avatar) {
      deleteFile(freelancerAccount.avatar);
    }

    await freelancerAccount.updateOne({ avatar: avatarPhoto.path });
    response.status(200).json({ message: "your photo has been uploaded" });
  } catch (error) {
    error.message = "server error faild to upload";
    error.statusCode = 500;

    next(error);
  }
};

//GET ===> All Freelancers

export const getAllFreelancers = async (request, response, next) => {
  try {
    const allFreelancers = await FreelancerModel.find(
      {},
      "isVerify firstName lastName avatar email jobTitle phoneNumber hourRate description completedProjects username"
    ).sort({ username: -1 });

    response.status(200).json({ allFreelancers });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//POST ==> Verify Freelancer Account

export const verifyFreelancerAccount = async (request, response, next) => {
  const freelancerId = request.body.freelancerId;

  if (!freelancerId) {
    return response.status(401).json({ error: "Can Not Find This Freelancer" });
  }

  try {
    const freelancer = await FreelancerModel.findById(freelancerId);
    if (!freelancer) {
      return response
        .status(401)
        .json({ error: "Can Not Find This Freelancer" });
    }

    //preper transporter for nodemailer
    let transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      auth: {
        user: "apikey",
        pass: "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", // generated ethereal password
      },
    });

    //generate the 6 numbers of OTP

    const OTPCode = Math.floor(100000 + Math.random() * 900000).toString();

    //hashed numbers

    const hashedNumbers = crypto
      .createHash("sha256")
      .update(OTPCode)
      .digest("hex");

    await freelancer.updateOne({ verifyCode: hashedNumbers });

    let email = await transporter.sendMail({
      from: "mostaqlClone14@gmail.com",
      to: `${freelancer.email}`,
      subject: "Your Verification Code",
      text: `Hello Dear,${freelancer.username} This email send By Mostaql-clone To Infrom You With The Verification Code to your Account`, // plain text body
      html: `
          <h3>Click Here To Verify Your Account: <a style="font-size:24px;" target="_blank" href="http://localhost:5173/verify-account/${freelancer._id}?code=${OTPCode}/">Visit Me</a></h3>
    `,
    });

    response.json({ message: "Email Has Been Send" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const verifyFreelancerOTPCode = async (request, response, next) => {
  const { freelancerId, OTPCode } = request.body;
  if (!freelancerId || !OTPCode) {
    return response.status(404).json({ error: "can not find freelancer" });
  }

  try {
    const freelancer = await FreelancerModel.findById(freelancerId);

    if (!freelancer) {
      return response.status(404).json({ error: "can not find freelancer" });
    }

    const compareNumber = crypto
      .createHash("sha256")
      .update(OTPCode)
      .digest("hex");

    if (compareNumber !== freelancer.verifyCode) {
      return response.status(404).json({ error: "OTP Code is Worng" });
    }

    await freelancer.updateOne({ isVerify: true, verifyCode: "" });
    // sendNotification({
    //   userId: freelancerId,
    //   attachedId: freelancerId,
    //   relatedTo: "account",
    //   content: `Your Account Has Been Verified Successfully!`,
    // });
    response.status(201).json({ message: "Your Accout Has Been Verified" });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
