import api from "./api.service";

class VoucherService {
  constructor() {
    this.path = "/vouchers";
  }

  async getVouchersByUserId(userId) {
    return (await api.get(`${this.path}/users/${userId}`)).data;
  }
}

export default new VoucherService();
