import jwt from "jsonwebtoken";
import clientModel from "../../models/clientModel.js";

export const isClient = (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    return res.status(404).json({ error: "token not found" });
  }

  let veryify;
  try {
    veryify = jwt.verify(token, process.env.SECRETE_KEY);
  } catch (err) {
    err.message = "server error client middleware auth";
    err.statusCode = 500;

    next(err);
  }

  if (!veryify) {
    return res.status(401).json({
      error: "can not not valid",
    });
  }

  req.clientId = veryify.clientId;

  next();
};
