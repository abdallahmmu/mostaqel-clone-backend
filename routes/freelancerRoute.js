const express = require("express");
const {checkSchema} = require('express-validator')
const router = express.Router();

//Controller
const { registerFreelancer,loginFreelancer,getFreelancerById,updateFreelancerById } = require("./../controllers/freelancerController");

//Schema Validator
const freelancerRegisterSchemaValidations = require('../validators/freelancerRegister.schema')
const freelancerLoginSchemaValidation = require('./../validators/freelancerLogin.schema')

//Authentication Middlewar
const {isFreelancersAuth} = require('../middlewares/isFreelancersAuth') 

//POST ===> Register A Freelancer
router.post("/register",checkSchema(freelancerRegisterSchemaValidations) ,registerFreelancer);

//POST ===> Login A Freelancer
router.post('/login',checkSchema(freelancerLoginSchemaValidation),loginFreelancer)


//GET ===> Get FreelancerById

router.get('/:id',isFreelancersAuth,getFreelancerById)


//UPDATE  ===> Update FreelancerById

router.patch('/:id',isFreelancersAuth,updateFreelancerById)




module.exports = router;
