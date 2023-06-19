import express from "express";
import { auth } from "../middlewares/auth.js";
import { isClient } from "../middlewares/clientMiddlewares/isClient.js";
import {
  saveClient,
  getClientById,
  EditClientById,
  getClient,
  deleteClientById,
  login,
} from "../controllers/clientController.js";
const clientRouter = express.Router();

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

clientRouter.post("/login", login);

export default clientRouter;
