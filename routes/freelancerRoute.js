const express = require("express");
const {checkSchema} = require('express-validator')
const router = express.Router();

//Controller
const { registerFreelancer,loginFreelancer } = require("./../controllers/freelancerController");

//Schema Validator
const freelancerRegisterSchemaValidations = require('../validators/freelancerRegister.schema')
const freelancerLoginSchemaValidation = require('./../validators/freelancerLogin.schema')

//POST ===> Register A Freelancer
router.post("/register",checkSchema(freelancerRegisterSchemaValidations) ,registerFreelancer);

//POST ===> Login A Freelancer
router.post('/login',checkSchema(freelancerLoginSchemaValidation),loginFreelancer)




module.exports = router;
