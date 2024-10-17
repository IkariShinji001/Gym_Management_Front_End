import api from "./api.service";
class BillService {
  constructor() {
    this.path = "bills";
  }

  async getPackageActive(userId) {
    return (await api.get(`${this.path}/users/${userId}`)).data;
  }

  async cancelPackage(priceId) {
    return (await api.patch(`${this.path}/cancel/packages/${priceId}`)).data;
  }

  async createBill(userId, listIds, voucherId = null) {
    let payload = {};
    if (voucherId) {
      payload.voucherId = voucherId;
    }
    payload.priceListIds = listIds;
    console.log(payload);
    return (await api.post(`${this.path}/users/${userId}`, payload)).data;
  }

  async updateBill(billId, status) {
    return await api.patch(`${this.path}/${billId}`, { status });
  }
}

export default new BillService();
