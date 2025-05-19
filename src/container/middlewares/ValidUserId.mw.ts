import UserController from "../controllers/UserController.js";
export default async (request, response, next) => {
  let usercontrol = new UserController();
  let { user } = request.params;
  request.params._user = await usercontrol.findOne(user);
  if (!request.params._user || !user) next({ status: 422 });
  next();
};
