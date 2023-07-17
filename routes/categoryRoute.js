import express from "express";

export const categoryRoute = express.Router();

//Controllers
import {
  getAllCategories,
  cateogryStatistics,
  getCategoryById,
  addNewCategory,
  updateCategoryById,
  deleteCategoryById,
  getFreelancersForCategory,
} from "./../controllers/categoryController.js";
//GET ==> get all Categories
categoryRoute.get("/", getAllCategories);
categoryRoute.get("/statistics", cateogryStatistics);

//GET ==> get CategoryById
categoryRoute.get("/:id", getCategoryById);

//POST ==> Add new Category

categoryRoute.post("/", addNewCategory);

//PATCH -- Update CategoryById

categoryRoute.patch("/:id", updateCategoryById);

//Delete Category -- Delete CategoryById

categoryRoute.delete("/:id", deleteCategoryById);

//GET Freelancers For Some Category

categoryRoute.get("/:id/freelancers", getFreelancersForCategory);
