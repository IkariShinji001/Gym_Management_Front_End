import api from "./api.service";

class FitnessBenefitService {
  constructor() {
    this.path = "fitness-benefits";
  }

  async getAll() {
    return (await api.get(`${this.path}`)).data;
  }

  
  async createList(listFB) {
    return (await api.post(`${this.path}/create-list`, listFB)).data;
  }

  async deleteList(deleteList) {
    await api.delete(`${this.path}/delete-list`, {
      data: deleteList,
    });
  }
}

export default new FitnessBenefitService();
