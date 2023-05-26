import clientModel from "../models/clientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function saveClient(client) {
  return clientModel.create(client);
}

function getClientById(id) {
  return clientModel.findById(id);
}

function EditClientById(id, title) {
  return clientModel.findByIdAndUpdate(id, { title: title }, { new: true });
}

function getClient() {
  return clientModel.find().populate("userId");
}

function deleteClientById(id) {
  return clientModel.findByIdAndDelete(id, { new: true });
}

async function login(req, res) {
  var client = req.body;
  var savedClient = await clientModel.findOne({ email: client.email });

  if (savedClient) {
    var valid = bcrypt.compareSync(client.password, savedClient.password);
    if (valid) {
      var token = jwt.sign(
        {
          clientName: savedClient.name,
          clientId: savedClient._id,
        },
        process.env.SECRETE_KEY,
        { expiresIn: "2h" }
      );

      res.status(200).json({
        token,
        savedClient: {
          name: savedClient.userName,
          id: savedClient._id,
        },
      });
    } else {
      res.status(422).json({ message: "invalid Name or Password" });
    }
  } else {
    res.status(422).json({ message: "invalid Name or Password" });
  }
}

export {
  saveClient,
  getClientById,
  EditClientById,
  getClient,
  deleteClientById,
  login,
};
