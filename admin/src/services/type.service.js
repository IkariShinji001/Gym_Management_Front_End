import  api from "./api.service";

class TypeService {
  constructor() {
    this.path = "/supplement-product-types";
  }

  async getAllType() {
    const types = (await api.get(`${this.path}`)).data;
    return types;
  }

  async createType(newType) {
    const data = (await api.post(`${this.path}`, newType)).data;
    return data;
  }
  async updateType(id, type){
    console.log(type)
    const res = (await api.patch(`${this.path}/${id}`,type )).data
    return res;
  }

  async deleteType(id) {
    await api.delete(`${this.path}/${id}`);
  }
}

export default new TypeService();
