import api  from "./api.service";

class SupplementProductService {
  constructor() {
    this.path = "/supplement-products";
  }

  async getAllSupplementProduct() {
    return (await api.get(`${this.path}`)).data;
  }
  async getAllByType(typeId) {
    const products = (await api.get(`${this.path}/by-type/${typeId}`)).data;
    return products;
  }

  async createProduct(product) {
    return (await api.post(`${this.path}`, product)).data;
  }

  async updateProduct(id, product){
    return (await api.patch(`${this.path}/${id}`, product)).data
  }

  async deleteProduct(id) {
    (await api.delete(`${this.path}/${id}`)).data;
  }
}

export default new SupplementProductService();
