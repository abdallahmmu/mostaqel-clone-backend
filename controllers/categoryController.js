//MODELS
import CategoryModel from "./../models/categoryModel.js";
import FreelancerModel from "../models/freelancerModel.js";

import projectModel from "./../models/projectModel.js";
// READ - GET ===> All Categories
export const getAllCategories = async (request, response, next) => {
  try {
    const categories = await CategoryModel.find();
    if (request.query.lang == "ar") {
      categories.map((category) => (category.title = category.titleAr));
    }
    response.status(200).json({ categories });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

//READ GET ===> Get CategoryById

export const getCategoryById = async (request, response, next) => {
  const categoryId = request.params.id;

  if (!categoryId) {
    return response
      .status(404)
      .json({ error: "Please Make Sure You Add a CategoryId" });
  }

  try {
    const category = await CategoryModel.findOne({ _id: categoryId });

    if (!category) {
      throw new Error();
    }
    response.status(200).json({ category });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

//CREATE - POST ===> Add new Category

export const addNewCategory = async (request, response, next) => {
  const title = request.body.title;

  if (!title) {
    return response
      .status(404)
      .json({ error: "Please Make Sure You Add a title" });
  }

  try {
    const newCategory = new CategoryModel(request.body);

    const savedCategory = await newCategory.save();
    response.status(200).json({ message: "Your Category Has Been Saved !" });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

//PATCH ===> Update CategoryById

export const updateCategoryById = async (request, response, next) => {
  const categoryId = request.params.id;
  const title = request.body.title;

  if (!title || !categoryId) {
    return response
      .status(404)
      .json({ error: "Please Make Sure You Add a title and A CategoryId" });
  }

  try {
    await CategoryModel.updateOne({ _id: categoryId }, request.body);
    response.status(200).json({ message: "Your Category Has Been Updated!!" });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

//DELETE ===> Delete CategoryById

export const deleteCategoryById = async (request, response, next) => {
  const categoryId = request.params.id;

  if (!categoryId) {
    return response
      .status(200)
      .json({ error: "Please Make Sure You Entered A Valid Id" });
  }

  try {
    await CategoryModel.deleteOne({ _id: categoryId });
    response.status(200).json({ message: "Your Category Has Been Deleted!!" });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

//GET ===>> Freelancers For Category

export const getFreelancersForCategory = async (request, response, next) => {
  const categoryId = request.params.id;

  if (!categoryId) {
    return response
      .status(404)
      .json({ error: "please send a valid category id" });
  }

  try {
    const freelancers = await FreelancerModel.find(
      { categoryId: categoryId },
      "firstName lasName username categoryId email jobTitle "
    );
    if (!freelancers)
      return response
        .status(200)
        .json({ message: "can not find freelancers in this category" });
    return response.status(200).json({ freelancers });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};
export const cateogryStatistics = async (request, response, next) => {
  try {
    const results = await projectModel.aggregate([
      {
        $group: {
          _id: "$categoryId",
          numProjects: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $sort: { numProjects: -1 },
      },
    ]);
    return response.status(200).json({ results });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};
