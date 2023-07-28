import jwt from "jsonwebtoken";
import FreelancerModel from "../../models/freelancerModel.js";
export const isFreelancersAuth = async (request, response, next) => {
  const token = request.get("Authorization");
  let verify;
  try {
    verify = jwt.verify(token, process.env.SECRETE_KEY);
    if (!verify) {
      return response.status(401).json({ error: "your token is not working!" });
    }

    //verifyed
    request.freelancerId = verify.freelancerId;
    const freelancer = await FreelancerModel.findById(verify.freelancerId);
    if (new Date().getTime() > freelancer.nextCharge.getTime()) {
      await offerModel.updateOne(
        { _id: verify.freelancerId },
        {
          $set: {
            availableOffers: 12,
            nextCharge: new Date(
              freelancer.nextCharge.getTime() + 7 * 24 * 60 * 60 * 1000
            ),
          },
        }
      );
    }

    next();
  } catch (err) {
    err.statusCode = 401;
    err.message = "your token is not valid";
    next(err);
  }
};
