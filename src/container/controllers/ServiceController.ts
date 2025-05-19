import Controller from "../../package/statics/Controller.js";
import { PrismaClient as BrightePrisma } from "../assets/brighte/index.js";

export type ServiceData = {
  name: String;
  productId: String;
};

export default class ServiceController extends Controller {
  get con(): string {
    return process.env.testMode == "enabled" ? "test" : "live";
  }

  get $service(): BrightePrisma["service"] {
    return this.models[this.con].service;
  }

  async reset() {
    return await this.$service.deleteMany({});
  }

  async insert(service) {
    return await this.$service.create({ data: service });
  }

  async findOne(serviceId: string) {
    return await this.$service.findFirst({
      where: {
        id: serviceId,
      },
      include: {
        product: true,
      },
    });
  }

  /**
   * creates (Service) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async create(request, response) {
    let { __product, product } = request.params;
    let { data } = request.body;
    if (Array.isArray(data)) {
      return await Promise.all(
        data.map(async (d) => {
          return await this.insert({ ...d, productId: product });
        })
      );
    } else return [this.insert({ ...data, productId: product })];
  }

  /**
   * refers to a single (Service) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async index(request, response) {
    let { __product } = request.params;
    return __product.Services;
  }

  /**
   * lists a (Service) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   *
   * */
  async list(request, response) {}

  /**
   * Delete/s a (Service) ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Bool} translated as [ExpressResponse] Object
   *
   * */
  async delete(request, response) {}

  /**
   * Updates a (Service) ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async update(request, response) {}
}
