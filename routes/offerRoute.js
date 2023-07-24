import express from "express";
import { checkSchema } from "express-validator";
import validatorMiddleware from "./../middlewares/validatorMiddleware.js";

//Controller
import {
  getProjectOffers,
  getProjectOffersStatistics,
  sendOffer,
  getOfferInfo,
  deleteOffer,
  updateOffer,
  getFreelancerOffers,
} from "./../controllers/offerController.js";

//Schema Validator
import {
  sendOfferSchemaValidator,
  updateOfferSchemaValidator,
} from "../validators/offerValidator.js";

//Authentication Middlewar
import { isFreelancersAuth } from "../middlewares/freelancersMiddlewares/isFreelancersAuth.js";
import { uploadFiles } from "../middlewares/uploadMiddleware.js";

export const offerRoute = express.Router();

// @desc get all offers for specific project
// @route get /api/v1/projects/:projectId/offers
// @access public
offerRoute.get("/projects/:id/offers", getProjectOffers);

// @desc get  offers Statistics for specific project
// @route get /api/v1/projects/:id/offers/statistics
// @access public
offerRoute.get("/projects/:id/offers/statistics", getProjectOffersStatistics);

// @desc make offer for specific project
// @route post /api/v1/projects/:projectId/offers
// @access freelancer who logged In
offerRoute.post(
  "/projects/:id/offers",
  uploadFiles("offers", [
    {
      name: "attachments",
      maxCount: 5,
    },
  ]),
  isFreelancersAuth,
  checkSchema(sendOfferSchemaValidator),
  validatorMiddleware,
  sendOffer
);

// @desc get winning offer for specific project
// @route delete /api/v1/offers/:id
//  @access freelancer who logged In and who sent the offer
offerRoute.get("/offers/:id", getOfferInfo);

// @desc delete offer for specific project
// @route delete /api/v1/offers/:id
//  @access freelancer who logged In and who sent the offer
offerRoute.delete("/offers/:id", isFreelancersAuth, deleteOffer);

// @desc update offer for specific project
// @route patch /api/v1/offers/:id
offerRoute.patch(
  "/offers/:id",
  isFreelancersAuth,
  checkSchema(updateOfferSchemaValidator),
  validatorMiddleware,
  updateOffer
);

// @desc get offer for specific freelancer
// @route get /api/v1/freelancers/myoffers
//  @access freelancer who logged In and who sent the offer
offerRoute.get("/freelancers/myoffers", isFreelancersAuth, getFreelancerOffers);
