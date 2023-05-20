export const isAuthToUpload = (request, response, next) => {
  const freelancerId = request.freelancerId;
  const freelancerIdParams = request.params.id;
  if (freelancerId !== freelancerIdParams) {
    return response.status(401).json({ error: "your are not authorized" });
  }

  next();
};
