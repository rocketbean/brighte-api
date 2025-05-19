import Controller from "../../package/statics/Controller.js";
import { PrismaClient as BrightePrisma } from "../assets/brighte/index.js";

const defaultServices = [
  { name: "delivery" },
  { name: "pick-up" },
  { name: "payment" },
];

export default class ProductController extends Controller {
  get con(): string {
    return process.env.testMode == "enabled" ? "test" : "live";
  }

  get $product(): BrightePrisma["product"] {
    return this.models[this.con].product;
  }

  get $service(): BrightePrisma["service"] {
    return this.models[this.con].service;
  }

  async reset() {
    return await this.$product.deleteMany({});
  }

  /**
   * creates (Product) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async create(request, response) {
    let product = await this.$product.create({ data: { ...request.body } });
    let services = <{ name: string; productId: string }[]>defaultServices.map(
      (service) => {
        service["productId"] = product.id;
        return service;
      }
    );
    await this.$service.createMany({
      data: services,
    });

    return await this.findOne(product.id);
  }

  async findOne(productId: string) {
    return await this.$product.findFirst({
      where: {
        id: productId,
      },
      include: {
        Services: true,
      },
    });
  }
  /**
   * refers to a single (Product) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async index(request, response) {
    let { product } = request.params;
    return await this.findOne(product);
  }

  /**
   * lists a (Product) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   *
   * */
  async list(request, response) {
    return await this.$product.findMany();
  }

  /**
   * Delete/s a (Product) ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Bool} translated as [ExpressResponse] Object
   *
   * */
  async delete(request, response) {}

  /**
   * Updates a (Product) ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async update(request, response) {}
}
