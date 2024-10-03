import api from "./api.service";

class ManagersService {
  async getAllManager() {
    return (await api.get("/managers")).data;
  }

  async getManager(id) {
    return (await api.get(`/managers/${id}`)).data;
  }
  async findByProfile(id) {
    return (await api.get(`/managers/profile/${id}`)).data;
}
  async createManager(manager) {
    return (await api.post("/managers", manager)).data;
  }
  async deleteManager(id) {
    return (await api.delete(`/managers/${id}`)).data;
  }
  async getEmployeesByManagerId(id) {
    return (await api.get(`/managers/${id}/employees`)).data;
  }
  async getPtsByManagerId(id) {
    return (await api.get(`/managers/${id}/pts`)).data;
  }

}

export default new ManagersService();
