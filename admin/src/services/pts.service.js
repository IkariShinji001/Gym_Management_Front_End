import api from "./api.service";

class ptsService {
  async getAll() {
    return (await api.get("/pts")).data;
  }
  async find(id) {
    return (await api.get(`/pts/${id}`)).data;
  }
  async findByProfile(id) {
    return (await api.get(`/pts/profile/${id}`)).data;
  }

  async getAllPtWithIdAndName() {
    return (await api.get("/pts/all-id-name")).data;
  }
  async create(data) {
    return (await api.post("/pts", data)).data;
  }
  async update(id, data) {
    return (await api.patch(`/pts/${id}`, data)).data;
  }
  async delete(id) {
    return (await api.delete(`/pts/${id}`)).data;
  }
}

export default new ptsService();
