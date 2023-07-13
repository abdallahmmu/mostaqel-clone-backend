import express from "express";
import multer from "multer";
import { auth } from "../middlewares/auth.js";
import { isClient } from "../middlewares/clientMiddlewares/isClient.js";
import {
  saveClient,
  getClientById,
  EditClientById,
  getClient,
  deleteClientById,
  uploadImageForClient,
  login
} from "../controllers/clientController.js";
import projectModel from "../models/projectModel.js";
const clientRouter = express.Router();

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

clientRouter.get("/", async (req, res, next) => {
  try {
    const client = await getClient();

    res.status(200).json({data:client});
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});

clientRouter.post("/", async (req, res, next) => {
  var { firstName, lastName, userName, password, phone, email, address } =
    req.body;
  try {
    var newClient = await saveClient({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      password: password,
      phone: phone,
      email: email,
      address: address,
    });
    res.status(201).json(newClient);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});

clientRouter.get("/:id", async (req, res, next) => {
  var id = req.params.id;
  try {
    var foundedClient = await getClientById(id);
    res.json(foundedClient);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});


clientRouter.get('/:id/projects', async (req, res) => {
  let { id} = req.params;
  try {
    let project = await projectModel.find({clientId: id});

    if(Object.keys(project).length === 0){
      return res.status(500).json({message: 'there is no projects for this client'});
    }

    res.status(200).json({message: 'success', project});
  } catch (error) {
    error.statusCode = 500;
    next(error)
  }
  
});




clientRouter.patch("/:id", auth, async (req, res) => {
  const userData = {...req.body}
  var { id } = req.params;
  var UpdatedClient = await EditClientById(id, userData);
  res.json(UpdatedClient);
});

clientRouter.delete("/:id", auth, async (req, res, next) => {
  try {
    var { id } = req.params;
    var deleteClient = await deleteClientById(id);
    res.status(201).json(deleteClient);
  } catch (e) {
    e.statusCode = 500;
    next(e);
  }
});


//Upload Photo For Clients 
//UPLOAD FILES

clientRouter.post(
  "/upload-avatar/:id",
  upload.single("avatar"),
  uploadImageForClient
);

clientRouter.post("/login", login);

export default clientRouter;
