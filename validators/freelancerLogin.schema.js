import FreelancerModel from './../models/freelancerModel.js'

export const freelancerLoginSchemaValidation = {
    email: {
        errorMessage: 'invalid email or password',
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

