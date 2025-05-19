import Controller from "../../package/statics/Controller.js";
import { PrismaClient as BrightePrisma } from "../assets/brighte/index.js";

export default class LeadController extends Controller {
  get con(): string {
    return process.env.testMode == "enabled" ? "test" : "live";
  }

  get $lead(): BrightePrisma["lead"] {
    return this.models[this.con].lead;
  }

  get $product(): BrightePrisma["product"] {
    return this.models[this.con].product;
  }

  get $service(): BrightePrisma["service"] {
    return this.models[this.con].service;
  }

  async reset() {
    return await this.$lead.deleteMany({});
  }

  async productInfoTransformer(product) {
    let services = product.Services.map((service) => {
      return {
        name: service.name,
        leadCount: service.Lead.length,
      };
    });

    return {
      id: product.id,
      name: product.name,
      services,
    };
  }

  /**
   * creates (Lead) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {} translated as [ExpressResponse] Object
   * */
  async create(request, response) {
    let { _user, _service } = request.params;
    return await this.$lead.create({
      data: {
        userId: _user.id,
        serviceId: _service.id,
      },
    });
  }

  /**
   * refers to a single (Lead) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async index(request, response) {}

  /**
   * lists a (Lead) ObjectModel[index]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   *
   * */
  async productLeads(request, response) {
    let { product } = request.params;
    let productlead = await this.$product.findFirst({
      where: {
        id: product,
      },
      include: {
        Services: {
          include: {
            Lead: true,
          },
        },
      },
    });

    return this.productInfoTransformer(productlead);
  }

  /**
   * Delete/s a (Lead) ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Bool} translated as [ExpressResponse] Object
   *
   * */
  async delete(request, response) {
    let { _user, _service } = request.params;
    return await this.$lead.delete({
      where: { userId_serviceId: { userId: _user.id, serviceId: _service.id } },
    });
  }

  /**
   * Updates a (Lead) ObjectModel[]
   * @param {request} [ExpressRequest] Object
   * @return {Object} translated as [ExpressResponse] Object
   * */
  async update(request, response) {}
}
