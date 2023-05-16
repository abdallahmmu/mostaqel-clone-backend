const express = require("express");

const router = express.Router();

//Controllers
const {
  getAllCategories,getCategoryById,
  addNewCategory,
} = require("./../controllers/categoryController");

//GET ==> get all Categories
router.get("/all", getAllCategories);


//GET ==> get CategoryById
router.get("/:id", getCategoryById);

//POST ==> Add new Category

router.post("/add", addNewCategory);


//UPDATE -- update CategoryById
//Delete Category -- Delete CategoryById

module.exports = router;
