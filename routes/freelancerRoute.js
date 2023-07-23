import express from "express";
import { checkSchema } from "express-validator";
import multer from "multer";

//Controller
import {
  registerFreelancer,
  loginFreelancer,
  getFreelancerById,
  updateFreelancerById,
  uploadImageForFreelancer,
  getAllFreelancers,
  verifyFreelancerAccount,
  verifyFreelancerOTPCode
} from "../controllers/freelancerController.js";

//Schema Validator
import { freelancerRegisterSchemaValidations } from "../validators/freelancerRegister.schema.js";
import { freelancerLoginSchemaValidation } from "../validators/freelancerLogin.schema.js";

//Authentication Middlewar
import { isFreelancersAuth } from "../middlewares/freelancersMiddlewares/isFreelancersAuth.js";
import { isAuthToUpload } from "../middlewares/freelancersMiddlewares/isToUploadAvatar.js";

//Multer Configuration
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Freelancers-Avatars");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar" + Math.random() * 255 + "-" + file.originalname);
  },
});

///filterFiles
const fileFiltered = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    const newError = new Error("File Is Not Supported");
    newError.statusCode = 404;
    cb(newError);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter: fileFiltered,
  limits: { fieldSize: "1MB" },
});

export const freelancerRoute = express.Router();

//GET All Freelancers
freelancerRoute.get("/", getAllFreelancers);

//POST ===> Register A Freelancer
freelancerRoute.post(
  "/register",
  checkSchema(freelancerRegisterSchemaValidations),
  registerFreelancer
);

//POST ===> Login A Freelancer
freelancerRoute.post(
  "/login",
  checkSchema(freelancerLoginSchemaValidation),
  loginFreelancer
);

//GET ===> Get FreelancerById

freelancerRoute.get("/:id", getFreelancerById);

//UPDATE  ===> Update FreelancerById

freelancerRoute.patch("/:id", isFreelancersAuth, updateFreelancerById);

//UPLOAD FILES

freelancerRoute.post(
  "/upload-avatar/:id",
  isFreelancersAuth,
  isAuthToUpload,
  upload.single("avatar"),
  uploadImageForFreelancer
);


//VerifyFreelancer
freelancerRoute.post('/verify-me',verifyFreelancerAccount)
freelancerRoute.post('/verify-code',verifyFreelancerOTPCode)


