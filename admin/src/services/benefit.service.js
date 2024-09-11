import api from "./api.service";

class BenefitService {
  constructor() {
    this.path = "/package-benefits";
  }

  async getAll() {
    return (await api.get(`${this.path}`)).data;
  }

  async create(benefit) {
    return (await api.post(`${this.path}`, benefit)).data;
  }

  async update(id, benefit) {
    return (await api.patch(`${this.path}/${id}`, benefit)).data;
  }

  async delete(id) {
    await api.delete(`${this.path}/${id}`);
  }
}

export default new BenefitService();
