import request from "supertest";
import instance from "../src/server";
import * as userMock from "./mocks/user.json";
let users = userMock.data;
export type HttpMethods =
  | "post"
  | "get"
  | "put"
  | "patch"
  | "update"
  | "delete";

class Helper {
  public static AppInstance;
  public static token;
  public static status = 0;
  public static instance;

  setup() {
    Helper.getApp();
  }

  get $app() {
    return Helper.getApp();
  }

  static getApp() {
    if (!Helper.AppInstance) {
      Helper.AppInstance = instance.$app.$server;
    } else {
      Helper.AppInstance?.close();
      Helper.AppInstance = instance.$app.$server;
    }
    return Helper.AppInstance;
  }

  static async getToken() {
    let res = await request(Helper.AppInstance)
      .post("/api/users/signin")
      .send({ email: users[0].email, pass: users[0].password });
    return `Bearer ${res.body.token}`;
  }

  async send(url: String, method: HttpMethods, body?: any) {
    let token = await Helper.getToken();
    return await request(Helper.AppInstance)
      [method](url)
      .send(body)
      .set("Authorization", token);
  }

  static init() {
    if (!Helper.instance) {
      Helper.instance = new Helper();
      Helper.instance.setup();
    }
    return Helper.instance;
  }
}

export default Helper.init();
