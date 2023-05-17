const FreelancerModel = require('./../models/freelancerModel')

const freelancerLoginSchemaValidation = {
    email: {
        isEmail:true,
        errorMessage: 'Email should be string with at leaset 8 alphanumeric',
        custom:{
          options: async (value)=>{
            const freelancerEmail = await FreelancerModel.findOne({email:value})

            if(!freelancerEmail){
              throw new Error('this account is not exsist!! please register an acount first')
            }
          }
        }
      },
      password: {
        isStrongPassword: true,
        notEmpty: true,
        isLength: { options: { min: 8, max: 32 } },
        errorMessage:
          'invalid email or password'
      },
}


module.exports = freelancerLoginSchemaValidation