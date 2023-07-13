import clientModel from "../models/clientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


function saveClient(client) {
  return clientModel.create(client);
}

function getClientById(id) {
  return clientModel.findById(id);
}

function EditClientById(id, updatedData) {
  return clientModel.updateOne(
    { _id: id },
    {...updatedData}
  );
}

function getClient() {
  // return clientModel.find().populate("userId");
  return clientModel.find();
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
          clientName: savedClient.userName,
          clientId: savedClient._id,
        },
        process.env.SECRETE_KEY,
        { expiresIn: "2h" }
      );

      res.status(200).json({
        token,
      });
    } else {
      res.status(422).json({ error: "invalid Name or Password" });
    }
  } else {
    res.status(422).json({ error: "invalid Name or Password" });
  }
}

const uploadImageForClient = async (request, response, next) => {
  const avatarPhoto = request.file;

  if (!avatarPhoto) {
    return response.status(404).json({ error: "no file to uploaded" });
  }

 
  try {
    const clientAccount = await clientModel.findById(
      request.params.id
    );
    if (clientAccount.avatar) {
      deleteFile(clientAccount.avatar);
    }

    await clientAccount.updateOne({ avatar: avatarPhoto.path });
    response.status(200).json({ message: "your photo has been uploaded" });
  } catch (error) {
    error.message = "server error faild to upload";
    error.statusCode = 500;

    next(error);
  }
};


export {
  saveClient,
  getClientById,
  EditClientById,
  getClient,
  deleteClientById,
  login,
  uploadImageForClient
};
