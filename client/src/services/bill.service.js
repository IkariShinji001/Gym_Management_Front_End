import api from "./api.service";
class BillService {
  constructor() {
    this.path = "bills";
  }

  async getPackageActice(userId) {
    return (await api.get(`${this.path}/users/${userId}`)).data;
  }

  async cancelPackage(priceId) {
    return (await api.patch(`${this.path}/cancel/packages/${priceId}`)).data;
  }
}

export default new BillService();
