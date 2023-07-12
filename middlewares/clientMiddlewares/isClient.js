import jwt from "jsonwebtoken";
import clientModel from "../../models/clientModel.js";

export const isClient = (req, res, next) => {
  const token = req.get("Authorization");


  if (!token) {
    return res.status(404).json({
      error:
        "token not found or you are not a client  --- you should login with client account",
    });
  }

  let veryify;
  try {
    veryify = jwt.verify(token, process.env.SECRETE_KEY);
  } catch (err) {
    err.statusCode = 500;

    next(err);
  }

  if (!veryify) {
    return res.status(401).json({
      error: "your token is not valid",
    });
  }

  req.clientId = veryify.clientId;

  next();
};
