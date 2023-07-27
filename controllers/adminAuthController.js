import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "process";
import adminModel from "../models/adminModel.js";

const createToken = (payload) =>
  jwt.sign(
    { adminRole: payload.role, adminId: payload._id },
    process.env.SECRETE_KEY
  );
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
    res.status(200).json({ message: "Successfully Done!" });
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
        error: "Can't be more than one 4 admin",
      });
    }
    await adminModel.create(req.body);
    res.status(200).json({ message: "Successfully Done !" });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
export const loginAdmin = async (req, res, next) => {
  try {
    const admin = await adminModel.findOne({ email: req.body.email });

    if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }
    // 3) generate token
    const token = createToken(admin);

    // 4) send response to client side
    res.status(200).json({ token });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
export const deleteAdmin = async (req, res, next) => {
  try {
    const deletedAdmin = await adminModel.findByIdAndDelete(req.params.adminId);

    if (!deletedAdmin) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    // 4) send response to client side
    res.status(200).json({ message: "Successfully! Admin Was Deleted" });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
export const getAllAdmins = async (req, res, next) => {
  try {
    const allAdmins = await adminModel.find({
      role: "admin",
    });

    // 4) send response to client side
    res.status(200).json({ message: "Successfully! ", results: allAdmins });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
export const protectMiddleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        message: "You are not login, Please login to get access this route",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRETE_KEY);

    const currentAdmin = await adminModel.findById(decoded.adminId);
    if (!currentAdmin) {
      return res.status(401).json({
        message: " The admin that belong to this token does no longer exist",
      });
    }
    req.admin = currentAdmin;
    next();
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
export const allowedTo = (roles) => async (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({
      message: "You are not allowed to access this route",
    });
  }
  next();
};
