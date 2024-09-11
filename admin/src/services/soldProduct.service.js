import api from "./api.service";

class SoldProductService {
  constructor() {
    this.path = "sold-products";
  }

  async getYearlyRevenue(year) {
    const response = await api.get(`${this.path}/yearly-revenue?year=${year}`);
    return response.data;
  }

  async createSoldProduct(soldProductPayload) {
    return (await api.post(`${this.path}`, soldProductPayload)).data;
  }
}

export default new SoldProductService();
