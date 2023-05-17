const FreelancerModel = require('./../models/freelancerModel')

const {validationResult} = require('express-validator')

//Create ===> Register A Freelancer
exports.registerFreelancer = async (request,response,next) => {
    const errors = validationResult(request).array().map(el => { return {msg:el.msg,path:el.path}})
    if(errors.length > 0){
        return response.status(404).json({errors})
    }


    try {
        const newFreelancer = new FreelancerModel(request.body)

        const createdFreelancer = await newFreelancer.save()
        
        response.status(200).json({massage:'Freelancer Created Sucssfully!'})
    } catch (error) {
        error.message = 'this freelancer already exsist!'
        error.statusCode = 500

        next(error)
    }

}