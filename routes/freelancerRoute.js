import express from "express";
import { checkSchema } from "express-validator";


//Controller
import {registerFreelancer,loginFreelancer,getFreelancerById,updateFreelancerById} from './../controllers/freelancerController.js'

//Schema Validator
import { freelancerRegisterSchemaValidations } from "../validators/freelancerRegister.schema.js";
import { freelancerLoginSchemaValidation } from "./../validators/freelancerLogin.schema.js";

//Authentication Middlewar
import { isFreelancersAuth } from "../middlewares/isFreelancersAuth.js";




export const freelancerRoute = express.Router();

//POST ===> Register A Freelancer
freelancerRoute.post("/register",checkSchema(freelancerRegisterSchemaValidations) ,registerFreelancer);

//POST ===> Login A Freelancer
freelancerRoute.post('/login',checkSchema(freelancerLoginSchemaValidation),loginFreelancer)


//GET ===> Get FreelancerById

freelancerRoute.get('/:id',isFreelancersAuth,getFreelancerById)


//UPDATE  ===> Update FreelancerById

freelancerRoute.patch('/:id',isFreelancersAuth,updateFreelancerById)



