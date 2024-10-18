import api from "./api.service";

class PtPackageService {
  constructor() {
    this.path = "/pt-packages";
  }

  async getAll() {
    return (await api.get(`${this.path}/detail`)).data;
  }

  async createPtPackage(payload) {
    return (await api.post(`${this.path}`, payload)).data;
  }

  async updatePtPackage(id, payload) {
    return (await api.patch(`${this.path}/${id}`, payload)).data;
  }

  async deletePtPackage(id) {
    await api.delete(`${this.path}/${id}`)
  }
}

export default new PtPackageService();
