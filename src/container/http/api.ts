import Route from "../../package/statics/Route.js";
import usercontroller from "../controllers/UserController.js";
import productcontroller from "../controllers/ProductController.js";
import servicecontroller from "../controllers/ServiceController.js";
import leadcontroller from "../controllers/LeadController.js";

const UserController = new usercontroller();
const ProductController = new productcontroller();
const ServiceController = new servicecontroller();
const LeadController = new leadcontroller();
export default (route: Route) => {
  /* * * * * * * * * *  Route Endpoint Registry * * * * * * *
   * this registry will serve as the routing container,
   * please make sure that this is registered in
   * [container/services/RouterServiceProvider]
   * also check [config/authentication.js] ,
   * by default, API's that is registered through auth config,
   * will be protected by JWT unless registered in
   * [AuthRouteExceptions] array option.
   *
   */

  route
    .post("/reset", async (req, res) => {
      try {
        await LeadController.reset();
        await UserController.reset();
        await ServiceController.reset();
        await ProductController.reset();
      } catch (e) {
        console.log(e);
      }
    })
    .middleware("testmode");

  route.group({ prefix: "/users" }, () => {
    route.post("/", "UserController@create").middleware(["userparams"]);
    route.get("/", "UserController@list");
    route.group({ prefix: ":user", middleware: ["validparams"] }, () => {
      route.get("/", "UserController@index");
      route.delete("/", "UserController@delete");
      route
        .patch("/", "UserController@update")
        .middleware("userUpdatableField");
    });
  });

  route.group({ prefix: "/products" }, () => {
    route.post("/", "ProductController@create");
    route.get("/", "ProductController@list");
    route.get("/:product", "ProductController@index");
    route.group(
      {
        prefix: "/:product/services",
        before: async (request, response, data): Promise<void> => {
          let product = request.params.product;

          request.params.__product = await ProductController.findOne(product);
          if (!request.params.__product)
            throw {
              status: 422,
              message: "invalid product id",
            };
        },
      },
      () => {
        route.get("/", "ServiceController@index");
        route.post("/", "ServiceController@create");
      }
    );
  });

  route.group({ prefix: "/leads" }, () => {
    route
      .get("product/:product", "LeadController@productLeads")
      .middleware("validProductId");

    route.group(
      {
        prefix: "/user/:user/service/:service",
        middleware: ["validUserId", "validServiceId"],
      },
      () => {
        route.post("/", "LeadController@create");
        route.delete("/", "LeadController@delete");
      }
    );
  });
};
