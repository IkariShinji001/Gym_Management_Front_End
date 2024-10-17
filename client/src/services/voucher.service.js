import api from "./api.service";

class VoucherService {
  constructor() {
    this.path = "/vouchers";
  }

  async createVoucher(userId, payload) {
    return await api.post(`${this.path}/users/${userId}`, payload);
  }

  async getVouchersByUserId(userId) {
    return (await api.get(`${this.path}/users/${userId}`)).data;
  }
}

export default new VoucherService();
