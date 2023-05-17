//MODELS
const CategoryModel = require("./../models/categoryModel");

// READ - GET ===> All Categories
exports.getAllCategories = async (request, response, next) => {
  try {
    const categories = await CategoryModel.find();

    response.status(200).json({ categories });
  } catch (error) {
    error.message = "Can Not Find Categories";
    error.statusCode = 500;

    next(error);
  }
};

//READ GET ===> Get CategoryById

exports.getCategoryById = async (request, response, next) => {
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
    error.message = "Can not Find This Category";
    error.statusCode = 404;
    next(error);
  }
};

//CREATE - POST ===> Add new Category

exports.addNewCategory = async (request, response, next) => {
  const title = request.body.title;

  if (!title) {
    return response
      .status(404)
      .json({ error: "Please Make Sure You Add a title" });
  }

  try {
    const newCategory = new CategoryModel({
      title,
    });

    const savedCategory = await newCategory.save();
    response.status(200).json({ massage: "Your Category Has Been Saved !" });
  } catch (error) {
    error.message = "Can Not Add This Category It's Already Exsist!!";
    error.statusCode = 500;

    next(error);
  }
};

//PATCH ===> Update CategoryById

exports.updateCategoryById = async (request, response, next) => {
  const categoryId = request.params.id;
  const title = request.body.title;

  if (!title || !categoryId) {
    return response
      .status(404)
      .json({ error: "Please Make Sure You Add a title and A CategoryId" });
  }

  try {
    await CategoryModel.updateOne({ _id: categoryId }, { title: title });
    response.status(200).json({ massage: "Your Category Has Been Updated!!" });
  } catch (error) {
    error.message = "Can Not Update This Category";
    error.statusCode = 500;

    next(error);
  }
};

//DELETE ===> Delete CategoryById

exports.deleteCategoryById = async (request, response, next) => {
  const categoryId = request.params.id;
  console.log(categoryId);

  if (!categoryId) {
    return response
      .status(200)
      .json({ error: "Please Make Sure You Entered A Valid Id" });
  }

  try {
    await CategoryModel.deleteOne({ _id: categoryId });
    response.status(200).json({ massage: "Your Category Has Been Deleted!!" });
  } catch (error) {
    error.message = "Can Not Find This Category";
    error.statusCode = 500;

    next(error);
  }
};
