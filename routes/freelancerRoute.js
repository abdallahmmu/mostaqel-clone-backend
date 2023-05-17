const express = require("express");
const {checkSchema} = require('express-validator')
const router = express.Router();

//Controller
const { registerFreelancer } = require("./../controllers/freelancerController");

//Schema Validator
const freelancerSchemaValidator = require('../validators/freelancerRegister.schema')

router.post("/register",checkSchema(freelancerSchemaValidator) ,registerFreelancer);

module.exports = router;
