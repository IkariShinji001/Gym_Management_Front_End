import api from "./api.service";

class FacilitiesService {
  async findAll() {
    return (await api.get("/facilities")).data;
  }
  async create(data) {
    return (await api.post("/facilities", data)).data;
  }
  async getbyname(ten) {
    return (await api.get("/facilities/byName", { params: { ten } })).data;
  }
  async update(id, data) {
    return (await api.patch(`/facilities/${id}`, data)).data;
  }
  async delete(id) {
    return (await api.delete(`/facilities/${id}`)).data;
  }
}
export default new FacilitiesService();
