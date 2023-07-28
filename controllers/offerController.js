import offerModel from "../models/offerModel.js";
import { validationResult } from "express-validator";
import { Schema, model } from "mongoose";
import FreelancerModel from "../models/freelancerModel.js";
// @route get /api/v1/projects/:id/offers
export const getProjectOffers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectOffers = await offerModel.find({ projectId: id }).populate({
      path: "freelancerId",
      select: "firstName lastName jobTitle isVerify avatar _id",
    });

    res.status(200).json({
      message: "Success",
      count: projectOffers.length,
      results: projectOffers,
    });
  } catch (error) {
    error.statusCode = 500;

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
      results: projectOffers,
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

// @route post /api/v1/projects/:id/offers
export const sendOffer = async (req, res, next) => {
  try {
    if (req.files.attachments) {
      req.body.attachments = [];
      req.files.attachments.map((file) => {
        // Save image into our db
        req.body.attachments.push(file.filename);
        // console.log(file.filename);
      });
    }

    req.body.freelancerId = req.freelancerId;

    await FreelancerModel.updateOne(
      { _id: req.body.freelancerId },
      { $inc: { availableOffers: -1 } }
    );

    req.body.projectId = req.params.id;
    // console.log(req.body);
    const newOffer = await offerModel.create(req.body);
    res.status(200).json({
      message: "Success",
      results: newOffer,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

// @route get /api/v1/offers/:id
export const getOfferInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offerDetails = await offerModel.findOne({ _id: id });
    if (!offerDetails)
      return res.status(404).json({
        error: "Can't Not Find Offer",
      });
    res.status(200).json({
      results: offerDetails,
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

// @route pacth /api/v1/offers/:id
export const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.freelancerId = req.freelancerId;
    const updatedOffer = await offerModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedOffer)
      return res.status(404).json({
        error: "Can't Not Updated Offer",
      });
    res.status(200).json({
      message: "Offer Updated Successfully",
      results: updatedOffer,
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

// @route delete /api/v1/offers/:id
export const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    await offerModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Offer deleted Successfully",
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

// @route get /api/v1/freelancers/myoffers
export const getFreelancerOffers = async (req, res, next) => {
  const freelancerId = req.freelancerId;
  try {
    const freelancerOffers = await offerModel
      .find({
        freelancerId,
      })
      .populate({
        path: "projectId",
        select: "_id  title",
      });

    res.status(200).json({
      message: "Success",
      count: freelancerOffers.length,
      results: freelancerOffers,
    });
  } catch (error) {
    error.statusCode = 404;
    next(error);
  }
};
