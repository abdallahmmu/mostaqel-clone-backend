const express = require("express");

const router = express.Router();

//Controller
const { registerFreelancer } = require("./../controllers/freelancerController");

router.post("/register", registerFreelancer);

module.exports = router;
