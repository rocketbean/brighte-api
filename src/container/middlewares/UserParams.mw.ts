export default async (request, response, next) => {
  let params = request.body;
  if (!params.name || !params.email || !params.mobile) {
    next({ status: 422, message: "invalid parameters" });
  }
  next();
};
