import jwt from 'jsonwebtoken'


export const isFreelancersAuth = (request, response, next) => {
  const token = request.get("Authorization");
  let verify;
  try {
    verify = jwt.verify(token, process.env.SECRETE_KEY);
    if (!verify) {
      return response.status(401).json({ error: "your token is not working!" });
    }

    //verifyed
    request.freelancerId = verify.freelancerId;
    next();
  } catch (err) {
    err.statusCode = 401;
    err.message = "your token is not valid";
    next(err);
  }
};
