//MODELS
import CategoryModel from "./../models/categoryModel.js";
import FreelancerModel from "../models/freelancerModel.js";
// READ - GET ===> All Categories
export const getAllCategories = async (request, response, next) => {
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
    error.message = "Can not Find This Category";
    error.statusCode = 404;
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

export const updateCategoryById = async (request, response, next) => {
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

export const deleteCategoryById = async (request, response, next) => {
  const categoryId = request.params.id;

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


//GET ===>> Freelancers For Category

export const getFreelancersForCategory = async (request,response,next)=>{
  const categoryId = request.params.id

  if(!categoryId){
    return response.status(404).json({error:'please send a valid category id'})
  }

  try {
    const freelancers = await FreelancerModel.find({categoryId:categoryId},'firstName lasName username categoryId email jobTitle ')
    if(!freelancers) return response.status(200).json({massage:'can not find freelancers in this category'})
    return response.status(200).json({freelancers})
  } catch (error) {
    error.message = 'server error faild to get freelancers for category'
    error.statusCode = 500

    next(error)
  }
}