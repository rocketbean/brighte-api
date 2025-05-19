export default async (request, response, next) => {
  let strictFields = ["email", "mobile"];
  Object.keys(request.body).forEach((p) => {
    if (strictFields.includes(p))
      next({
        status: 422,
        message: `${strictFields.join(", ")} cannot be updated`,
      });
  });

  next();
};
