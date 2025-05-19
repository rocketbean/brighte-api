import { afterAll, beforeAll } from "vitest";
import request from "supertest";
import helper, { HttpMethods } from "./helper";
import * as userMock from "./mocks/user.json";
let users = userMock.data;

const getApp = () => helper.$app;
type sendConfig = {
  auth: boolean;
  user?: any;
};

type sendOpts = {
  url: string;
  method: HttpMethods;
  body?: any;
  query?: string;
};

export const getToken = async (user) => {
  let res = await request(app)
    .post("/api/users/signin")
    .send({ email: user.email, pass: user.password });
  return `Bearer ${res.body.token}`;
};

export const send = async (
  option: sendOpts,
  config: sendConfig = { auth: false, user: users[0] }
) => {
  return await request(app)[option.method](option.url).send(option.body);
};

export const app = getApp();
beforeAll(async (context) => {
  let userToken = users[0];
  await send({ url: "/api/forget/user", method: "post" }, { auth: false });
});
