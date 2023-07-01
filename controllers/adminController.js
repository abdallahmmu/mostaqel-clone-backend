import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const loginAdmin = (request,response,next)=>{
    response.status(200).json({message:'admin Login'})
}


export const deleteFreelancerById = (request,response,next)=>{
    response.status(200).json({message:'delete Freelancer'})
}