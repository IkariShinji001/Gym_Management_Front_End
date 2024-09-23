import  api from "./api.service";

class TypeService {
  constructor() {
    this.path = "service-package-types";
  }

  async getAllType() {
    const types = (await api.get(`${this.path}`)).data;
    return types;
  }
  async getTypeById(id) {
    return (await api.get(`${this.path}/${id}`)).data;
  }
}

export default new TypeService();
