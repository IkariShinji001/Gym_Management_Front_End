import api from "./api.service";

class FacilitiesService {
  async findAll() {
    return (await api.get("/facilities")).data;
  }
  async findById(id) {
    return (await api.get(`/facilities/${id}`)).data;
  }
  async create(data) {
    return (await api.post("/facilities", data)).data;
  }
  async getbyname(ten) {
    return (await api.get("/facilities/byName", { params: { ten } })).data;
  }
  async findFacilityIsFinishedTrue() {
    return (await api.get("/facilities/findFacilityIsFinishedTrue")).data;
  }
  async checkFacilityIsFinishedIsFalse(id) {
    return (await api.get(`/facilities/checkFacilityIsFinishedIsFalse/${id}`)).data;
  }
  async update(id, data) {
    return (await api.patch(`/facilities/${id}`, data)).data;
  }
  async delete(id) {
    return (await api.delete(`/facilities/${id}`)).data;
  }
}
export default new FacilitiesService();
