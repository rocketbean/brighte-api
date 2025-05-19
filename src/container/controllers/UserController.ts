import Controller from "../../package/statics/Controller.js";
import { PrismaClient as BrightePrisma } from "../assets/brighte/index.js";

export default class UserController extends Controller {
  get con(): string {
    return process.env.testMode == "enabled" ? "test" : "live";
  }

  get $user(): BrightePrisma["user"] {
    return this.models[this.con].user;
  }
  /**
   * Write a New ModelEntry
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async create(request, response) {
    return await this.$user.create({ data: { ...request.body } });
  }

  async reset() {
    return await this.$user.deleteMany({});
  }

  async findOne(userId: string) {
    return await this.$user.findFirst({
      where: {
        id: userId,
      },
    });
  }

  /**
   * refers to a single (User) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async index(request, response) {
    let user = await this.$user.findUnique({
      where: {
        id: request.params.user,
      },
    });

    if (!user)
      throw {
        status: 406,
        message: "user does not exist",
      };

    return user;
  }

  /**
   * lists a (User) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async list(request, response) {
    return await this.$user.findMany({});
  }

  /**
   * Delete an ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Bool} translated as [ExpressResponse] Object
   *
   * */
  async delete(request, response) {
    return await this.$user.delete({
      where: {
        id: request.params.user,
      },
    });
  }

  /**
   * Update an ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async update(request, response) {
    let { user } = request.params;
    return await this.$user.update({
      where: {
        id: user,
      },
      data: { ...request.body },
    });
  }
}
