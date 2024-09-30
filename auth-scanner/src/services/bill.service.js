import api from "./api.service";

class BillService {
  constructor() {
    this.path = "bills";
  }

  async getAllBillActive(userId) {
    return (await api.get(`${this.path}/users/${userId}`)).data;
  }
}

export default new BillService();
