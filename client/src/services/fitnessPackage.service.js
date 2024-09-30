import api from "./api.service";

class FitnessPackageService {
  constructor() {
    this.path = "fitness-packages";
  }

  async getAllDetails() {
    return (await api.get(`${this.path}/detail`)).data;
  }
  async getByType(id) {
    return (await api.get(`${this.path}/by-type/${id}`)).data;
  }
  async getById(id) {
    return (await api.get(`${this.path}/${id}`)).data;
  }
}

export default new FitnessPackageService();
