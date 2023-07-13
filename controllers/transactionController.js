import Stripe from "stripe";
import TranssactionModel from "../models/transsactionModel.js";
import ClientModel from "./../models/clientModel.js";
import FreelancerModel from "./../models/freelancerModel.js";

const frontEndDomain = "http://localhost:5173";
export const despositPayment = async (request, response, next) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVTE_KEY);
  let { userId, amount, mode } = request.body;

  if (!userId || !amount || !mode) {
    return response.status(401).json({ error: "data is missing" });
  }
  const percent = 2.5;
  const increase = parseInt(amount) * (percent / 100);
  const newPrice = parseInt(amount) + increase;
  
  try {
    let findUser;
    if (mode === "deposit") {
      findUser = await ClientModel.findById(userId, "email _id");
    } else {
      findUser = await FreelancerModel.findById(userId, "email _id");
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${frontEndDomain}/payment/thankYou`,
      cancel_url: `${frontEndDomain}/payment/cancel`,
      customer_email: findUser.email,
      line_items: [
        {
          price_data: {
            unit_amount_decimal: newPrice * 100,
            currency: "usd",
            product_data: {
              name: "Deposite For Mostaql",
              description: "welcome to mostaql-clone purcheses here you will deposite some mony to use in our platform.",
            },
          },
          quantity: 1
        },
      ],
      mode: 'payment'
    });

    response.status(201).json({ message: "Success", session, amount: newPrice });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};



export const ThankYou = async (req, res, next) => {
  let { clientId, mode, sessionId, amount } = req.body;
  const stripe = new Stripe(process.env.STRIPE_PRIVTE_KEY)
  
  try {
    const confirmation = await stripe.checkout.sessions.retrieve(sessionId)

    if(confirmation.payment_status === 'unpaid' || !sessionId || !amount){
      return res.status(401).json({error:'paied is not sucsess'})
    }
    
    let client = await ClientModel.findById(clientId)

    const updatedAmount = {
      totalMoney:parseInt(client.totalMoney) + parseInt(amount)
    }

    await client.updateOne(updatedAmount)


    let transaction = await TranssactionModel.create({
      mode,
      sessionId,
      amount,
      userId: clientId
    })

    res.status(200).json({transaction, client});

  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
}


export const getPayments = async (req, res, next) => {
  try {
    let transactions  = await TranssactionModel.find();
    
    res.status(201).json({transactions});
  } catch (error) {
    error.statusCode = 500;
    next(error)
  }


}


export const withdrawFreelancer = async (request,response,next) => {

  const {userId,amount} = request.body
  const randomSessionId = Math.floor(Math.random()*200) + userId
  const mode = 'withdraw'

  try {
    const freelancer = await FreelancerModel.findById(userId)

    if(!freelancer){
      return response.status(401).json({error:'can not find this freelancer'})
    }

    if(freelancer.totalMoney < +amount){
      return response.status(400).json({error:'your money is less than this amount'})
    }

    const updateAmount = {
      totalMoney : freelancer.totalMoney - +amount
    }

    await freelancer.updateOne(updateAmount)


    await TranssactionModel.create({
      amount:amount,
      mode:mode,
      sessionId:randomSessionId,
      userId:userId
    })
   
    response.status(201).json({message:'Succsess'})
  } catch (error) {
    error.statusCode = 500
    next(error)
  }
}


export const getAllUserTranactios = async (req, res, next) => {
  let { userId } = req.params;
 
  try {
    let transaction = await TranssactionModel.find({userId});

    if(!transaction){
      return res.status(200).json({message: 'This User does not have any transactions'});
    }
    res.status(200).json({transaction});
  } catch (error) {
    error.statusCode = 500;
    next(error)
  }
}