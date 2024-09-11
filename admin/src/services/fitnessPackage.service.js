import api from "./api.service";

class FitnessPackageSerivce {
  constructor() {
    this.path = "/fitness-packages";
  }

  async getAll() {
    return (await api.get(`${this.path}`)).data;
  }

  async getByType(typeId) {
    return (await api.get(`${this.path}/by-type/${typeId}`)).data;
  }
  async getAllWithDetail() {
    return (await api.get(`${this.path}/detail`)).data;
  }

  async create(fitness) {
    return (await api.post(`${this.path}`, fitness)).data;
  }

  async update(fitnessId, fitness) {
    return (await api.patch(`${this.path}/${fitnessId}`, fitness)).data;
  }

  async delete(fitnessId) {
    await api.delete(`${this.path}/${fitnessId}`);
  }
}

export default new FitnessPackageSerivce();
