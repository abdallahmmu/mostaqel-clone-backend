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
      success_url: `${frontEndDomain}/payment/thank_you`,
      cancel_url: `${frontEndDomain}/payment/cancel`,
      customer_email: findUser.email,
      line_items: [
        {
        price_data:{
            unit_amount_decimal:newPrice * 100,
            currency: "usd",
            product_data:{
                name: "Deposite will be Here",
                description:"welcome to mostaql-clone purcheses here you will deposite some mony to use in our platform.",
            },
        },
        quantity:1
        },
      ],
      mode:'payment'
    });

    response.status(201).json({ message: "Success", session });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
