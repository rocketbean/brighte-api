import {
  describe,
  expect,
  test,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import request from "supertest";
import instance from "../src/server";
import * as userMock from "./mocks/user.json";
import * as productMock from "./mocks/product.json";
import * as scenario from "./mocks/scenario.json";
import { after, before } from "node:test";
let app = instance.$app.$server;

console.clear();
describe("[api]/", async () => {
  const users = userMock.users;
  const products = productMock.products;
  const services = productMock.services;
  const basepath = "/api";

  const reset = async () => {
    let res = await request(app)
      .post(basepath + `/reset`)
      .send();
    if (res.statusCode !== 200) {
      throw new Error("failed to reset test environment");
    }
  };
  beforeAll(async () => {
    await reset();
  });

  describe("/users", async () => {
    let uri = basepath + "/users";
    let user, testuser;
    describe("POST - /users", async () => {
      test("[422] must throw an error for invalid params", async () => {
        let copy = {
          name: users[0].name,
          mobile: users[0].mobile,
          postcode: users[0].postcode,
        };
        let res = await request(app).post(uri).send(copy);
        expect(res.statusCode).toBe(422);
      });
      test("[200] must be able to create a new user", async () => {
        let res = await request(app).post(uri).send(users[0]);
        testuser = (await request(app).post(uri).send(users[1])).body;
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id");
      });
    });
    describe("GET - users", async () => {
      test("[200] must be able fetch users list", async () => {
        let res = await request(app).get(uri).send();
        user = res.body.find((u) => u.email === users[0].email);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
      });
    });
    describe("GET - users/:user", async () => {
      test("[406] must throw 406 error if no user is found", async () => {
        let res = await request(app)
          .get(uri + `/${user.id}` + 0)
          .send();
      });

      test("[200] must be able fetch a user", async () => {
        let res = await request(app)
          .get(uri + `/${user.id}`)
          .send();
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("email");
      });
    });

    describe("DELETE - users/:user", async () => {
      test("[200] must be able to remove a user", async () => {
        let res = await request(app)
          .delete(uri + `/${testuser.id}`)
          .send();

        let list = await request(app).get(uri).send();
        expect(res.statusCode).toBe(200);
        expect(list.body).toContainEqual({ ...user });
      });
    });

    describe("PATCH - /users/:user", async () => {
      test("[422] must throw an error for non-updatable fields ", async () => {
        let updatefield = "email";
        let updateValue = "email@update.com";

        let list = await request(app).get(uri).send();
        user = list.body[0];
        let res = await request(app)
          .patch(uri + `/${user.id}`)
          .send({ [updatefield]: updateValue });

        expect(res.statusCode).toBe(422);
      });

      test("[200] must be able to update a user", async () => {
        let updatefield = "postcode";
        let updateValue = "87654321";

        let list = await request(app).get(uri).send();
        user = list.body[0];
        let res = await request(app)
          .patch(uri + `/${user.id}`)
          .send({ [updatefield]: updateValue });
        let u = await request(app)
          .get(uri + `/${user.id}`)
          .send();

        expect(res.statusCode).toBe(200);
        expect(u.body).toHaveProperty(updatefield, updateValue);
      });
    });
  });

  describe("/products", async () => {
    let uri = basepath + "/products";
    let product, testproduct;
    describe("POST - /products", async () => {
      test("[200] must be able to create a new product", async () => {
        let res = await request(app).post(uri).send(products[0]);
        product = (await request(app).post(uri).send(products[1])).body;
        testproduct = res.body;
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id");
      });

      test("[200] must be able to get the list products", async () => {
        let res = await request(app).get(uri).send();
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
      });

      describe("POST - /:product/services", async () => {
        test("[422] throw an error for invalid productId", async () => {
          let res = await request(app)
            .post(`${uri}/${product.id}abc/services`)
            .send({ data: services });

          expect(res.statusCode).toBe(422);
        });
        test("[200] must be able to create a new service for a product", async () => {
          let res = await request(app)
            .post(`${uri}/${testproduct.id}/services`)
            .send({ data: productMock.lead });
          expect(res.statusCode).toBe(200);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        test("[200] returns a list of services offered by a product", async () => {
          let res = await request(app)
            .get(`${uri}/${product.id}/services`)
            .send({ data: services });

          expect(res.statusCode).toBe(200);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
      });

      test("[200] must be able to get product info", async () => {
        let res = await request(app)
          .get(uri + `/${product.id}`)
          .send();

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("Services");
        expect(res.body.name).toBe(product.name);
      });
    });
  });

  describe("/leads", async () => {
    let uri = basepath + "/leads";
    let leadUsers, leadProds, prod, service;

    describe("POST - /user/:user/service/:service", async () => {
      test("setup lead env", async () => {
        leadUsers = (await request(app).get("/api/users").send()).body;
        leadProds = (await request(app).get("/api/products").send()).body;
        let _p = leadProds.find((p) => p.name == "Brighte Eats").id;
        prod = (
          await request(app)
            .get("/api/products/" + _p)
            .send()
        ).body;
        service = prod.Services[0];
      });

      test("[422] must throw an error if params is invalid", async () => {
        let res = await request(app)
          .post(`${uri}/user/${leadUsers[0].id}a/service/${service.id}`)
          .send();
        expect(res.statusCode).toBe(422);
      });

      test("[200] must be able to add a lead for a service", async () => {
        let res = await request(app)
          .post(`${uri}/user/${leadUsers[0].id}/service/${service.id}`)
          .send();
        expect(res.body).toHaveProperty("id");
        expect(res.statusCode).toBe(200);
      });
    });
    describe("DELETE - /user/:user/service/:service", async () => {
      test("[422] must throw an error if params is invalid", async () => {
        let res = await request(app)
          .post(`${uri}/user/${leadUsers[0].id}a/service/${service.id}`)
          .send();
        expect(res.statusCode).toBe(422);
      });
      test("[200] must be able to remove a lead", async () => {
        let res = await request(app)
          .delete(`${uri}/user/${leadUsers[0].id}/service/${service.id}`)
          .send();

        expect(res.statusCode).toBe(200);
      });
    });

    describe("POST - /products/:product", async () => {
      test("setup product env", async () => {
        await request(app)
          .post(`${uri}/user/${leadUsers[0].id}/service/${service.id}`)
          .send();
      });
      test("[200] must be able to fetch product leads", async () => {
        let res = await request(app).get(`${uri}/product/${prod.id}`).send();

        let deliveryService = res.body.services.find(
          (s) => s.name === "delivery"
        );

        expect(res.statusCode).toBe(200);
        expect(deliveryService.leadCount).toBe(1);
      });
    });
  });

  afterAll(async () => {
    await reset();
    console.log(" /*** Scenario 1 *** ");
    console.log(" -- Register all users -- ");
    let userDelivery = await Promise.all(
      scenario.users["delivery"].map(async (user) => {
        let res = await request(app).post("/api/users").send(user);
        return res.body;
      })
    );
    let userPickUp = await Promise.all(
      scenario.users["pick-up"].map(async (user) => {
        let res = await request(app).post("/api/users").send(user);
        return res.body;
      })
    );

    let userPayment = await Promise.all(
      scenario.users["payment"].map(async (user) => {
        let res = await request(app).post("/api/users").send(user);
        return res.body;
      })
    );

    console.log("\n -- Register the product and service/s -- ");
    let product = (
      await request(app).post(`/api/products`).send(scenario.product)
    ).body;

    console.log("\n -- Distribute the leads -- ");
    let deliveryService = product.Services.find((s) => s.name === "delivery");
    let pickupService = product.Services.find((s) => s.name === "pick-up");
    let paymentService = product.Services.find((s) => s.name === "payment");
    let uri = "/api/leads";
    let deliveryLead = await Promise.all(
      userDelivery.map(async (user) => {
        let serviceId = deliveryService.id;
        return (
          await request(app)
            .post(`${uri}/user/${user.id}/service/${serviceId}`)
            .send()
        ).body;
      })
    );

    let pickupLead = await Promise.all(
      userPickUp.map(async (user) => {
        let serviceId = pickupService.id;
        return (
          await request(app)
            .post(`${uri}/user/${user.id}/service/${serviceId}`)
            .send()
        ).body;
      })
    );

    let paymentLead = await Promise.all(
      userPayment.map(async (user) => {
        let serviceId = paymentService.id;
        return (
          await request(app)
            .post(`${uri}/user/${user.id}/service/${serviceId}`)
            .send()
        ).body;
      })
    );

    let result = (
      await request(app).get(`/api/leads/product/${product.id}`).send()
    ).body;
    console.log(`******* RESULT *******`);
    console.log(result);
    console.log(`******* CHECK *******`);
    console.log(JSON.stringify(scenario.checker, null, 2));

    console.log(" *** End Scenario 1 ***/ ");
  });
});
