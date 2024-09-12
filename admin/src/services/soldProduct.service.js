import api from "./api.service";

class SoldProductService {
  constructor() {
    this.path = "sold-products";
  }

  async getRevenueByDate(date) {
    return (await api.get(`${this.path}/date-revenue?date=${date}`)).data;
  }

  async getAllSoldProductOnDate(date) {
    return (await api.get(`${this.path}/sold-product-on-date?date=${date}`))
      .data;
  }

  async getAllDayOfMonthRevenue(month, year) {
    return (
      await api.get(
        `${this.path}/allday-month-revenue?month=${month}&year=${year}`
      )
    ).data;
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
