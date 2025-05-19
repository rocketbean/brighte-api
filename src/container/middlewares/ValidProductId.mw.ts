import ProductController from "../controllers/ProductController.js";
export default async (request, response, next) => {
  let prodcontrol = new ProductController();
  let { product } = request.params;

  request.params.__product = await prodcontrol.findOne(product);
  if (!request.params.__product || !product) next({ status: 422 });
  next();
};
