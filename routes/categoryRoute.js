const express = require("express");

const router = express.Router();

//Controllers
const {
  getAllCategories,
  addNewCategory,
} = require("./../controllers/categoryController");

//GET ==> get all Categories
router.get("/all", getAllCategories);

//POST ==> Add new Category

router.post("/add", addNewCategory);

module.exports = router;
