import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import adminModel from "../models/adminModel.js";

export const addSuperAdmin = async (req, res, next) => {
  try {
    const adminCount = await adminModel
      .find({
        role: "superAdmin",
      })
      .countDocuments();
    if (adminCount == 1) {
      return res.status(401).json({
        message: "Can't be more than one super admin",
      });
    }
    await adminModel.create(req.body);
    res
      .status(200)
      .json({ message: "Successfully Done You Have The Permissions" });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
export const registerAdmin = async (req, res, next) => {
  try {
    req.body.role = "admin";
    const adminCount = await adminModel.countDocuments();
    if (adminCount == 5) {
      return res.status(401).json({
        message: "Can't be more than one 4 admin",
      });
    }
    await adminModel.create(req.body);
    res
      .status(200)
      .json({ message: "Successfully Done You Have Specific Permissions" });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
export const loginAdmin = async (req, res, next) => {
  try {
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
