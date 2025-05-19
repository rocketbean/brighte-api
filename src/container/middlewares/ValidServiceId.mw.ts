import ServiceController from "../controllers/ServiceController.js";
export default async (request, response, next) => {
  let servcontrol = new ServiceController();
  let { service } = request.params;
  request.params["_service"] = await servcontrol.findOne(service);
  if (!request.params._service || !service) next({ status: 422 });
  next();
};
