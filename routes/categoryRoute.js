const express = require("express");

const router = express.Router();

//Controllers
const {
  getAllCategories,getCategoryById,
  addNewCategory,updateCategoryById,deleteCategoryById
} = require("./../controllers/categoryController");

//GET ==> get all Categories
router.get("/all", getAllCategories);


//GET ==> get CategoryById
router.get("/:id", getCategoryById);

//POST ==> Add new Category

router.post("/add", addNewCategory);


//PATCH -- Update CategoryById

router.patch('/:id',updateCategoryById)

//Delete Category -- Delete CategoryById  

router.delete('/:id',deleteCategoryById)

module.exports = router;
