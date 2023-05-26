import offerModel from "../models/offerModel.js";
import { validationResult } from "express-validator";

// @route get /api/v1/projects/:id/offers
export const getProjectOffers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectOffers = await offerModel
      .find({ projectId: id })
      .populate("freelancerId");

    res.status(200).json({
      message: "Success",
      count: projectOffers.length,
      data: projectOffers,
    });
  } catch (error) {
    error.message = "Can't Find This Project Offers";
    error.statusCode = 404;

    next(error);
  }
};
// @route get /api/v1/projects/:id/offers/statistics
export const getProjectOffersStatistics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectOffers = await offerModel.aggregate([
      {
        $match: {
          $expr: { $eq: ["$projectId", { $toObjectId: id }] },
        },
      },
      {
        $group: {
          _id: null,
          numOffers: { $sum: 1 },
          avgPrice: { $avg: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      message: "Success",
      data: projectOffers,
    });
  } catch (error) {
    error.message = "Can't Find This Project Offers";
    error.statusCode = 404;

    next(error);
  }
};

// @route post /api/v1/projects/:id/offers
export const sendOffer = async (req, res, next) => {
  try {
    req.body.freelancerId = req.freelancerId;
    req.body.projectId = req.params.id;
    console.log(req.body);
    console.log(req.body);
    const newOffer = await offerModel.create(req.body);
    res.status(200).json({
      message: "Success",
      data: newOffer,
    });
  } catch (error) {
    error.message = "Error During Saving";
    error.statusCode = 500;
    next(error);
  }
};

// @route delete /api/v1/offers/:id
export const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.freelancerId = req.freelancerId;
    const updatedOffer = await offerModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Offer Updated Successfully",
      data: updatedOffer,
    });
  } catch (error) {
    error.message = "Error During Saving";
    error.statusCode = 500;

    next(error);
  }
};

// @route patch /api/v1/offers/:id
export const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    await offerModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Offer Deleted Successfully",
    });
  } catch (error) {
    error.message = "Error During Saving";
    error.statusCode = 500;

    next(error);
  }
};

// @route get /api/v1/freelancers/myOffers
export const getFreelancerOffers = async (req, res, next) => {
  try {
    const { freelancerId } = req;
    const freelancerOffers = await offerModel.find({ freelancerId });
    res.status(200).json(freelancerOffers);
  } catch (error) {
    error.message = "Can't Find This Freelancer Offers";
    error.statusCode = 404;

    next(error);
  }
};
