import { validationResult } from "express-validator";
// import validator from "express-validator";
// @desc  catch errors from rules if exists
const validatorMiddleware = (req, res, next) => {
  //isEmpty method inside a class called validator stati

  const errors = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validatorMiddleware;
