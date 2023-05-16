//MODELS
const CategoryModel = require('./../models/categoryModel')




// READ - GET ===> All Categories
exports.getAllCategories = async (request,response,next) => {

    try {
        const categories = await CategoryModel.find()

        response.status(200).json({categories})
    } catch (error) {
        error.message = 'Can Not Find Categories'
        error.statusCode = 500

        next(error)
    }
}


//CREATE - POST ===> Add new Category

exports.addNewCategory = (request, response,next) => {
    response.status(200).json({massage:'Add New Category'})
}