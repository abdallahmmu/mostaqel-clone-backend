const express = require('express')

const router = express.Router()


//Controllers
const {getAllCategories} = require('./../controllers/categoryController')

//GET ==> get all Categories
router.get('/all', getAllCategories)


module.exports = router