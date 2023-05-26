import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  saveClient,
  getClientById,
  EditClientById,
  getClient,
  deleteClientById,
  login,
} from "../controllers/clientController.js";
const clientRouter = express.Router();

clientRouter.get("/", async (req, res) => {
  try {
    var client = await getClient();

    res.status(200).json(client);
  } catch (e) {
    res.status(404).json(e);
  }
});

clientRouter.post("/", async (req, res) => {
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
    res.status(422).json(e);
  }
});

clientRouter.get("/:id", async (req, res) => {
  var id = req.params.id;
  try {
    var foundedClient = await getClientById(id);
    res.json(foundedClient);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

clientRouter.patch("/:id", auth, async (req, res) => {
  var { userName } = req.body;
  var { id } = req.params;

  var UpdatedClient = await EditClientById(id, userName);
  res.json(UpdatedClient);
});

clientRouter.delete("/:id", auth, async (req, res) => {
  try {
    var { id } = req.params;
    var deleteClient = await deleteClientById(id);
    res.status(201).json(deleteClient);
  } catch (e) {
    res.status(404).json(e);
  }
});

clientRouter.post("/login", login);

export default clientRouter;
