export default async (request, response, next) => {
  let keys = Object.keys(request.params);
  keys.forEach((k) => {
    if (!k) next({ status: 422 });
  });
  next();
};
