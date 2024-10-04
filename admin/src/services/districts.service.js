import api from "./api.service";

class DistrictsService {
  constructor() {
    this.path = "/districts";
  }

  async findAll() {
    return (await api.get(`${this.path}`)).data;
  }

  async findOne(id) {
    return (await api.get(`${this.path}/${id}`)).data;
  }

  async create(data) {
    return (await api.post(`${this.path}`, data)).data;
  }

  async update(id, data) {
    return (await api.patch(`${this.path}/${id}`, data)).data;
  }

  async delete(id) {
    return (await api.delete(`${this.path}/${id}`)).data;
  }

  async findDistrictsInProvince(provinceId) {
    return (await api.get(`${this.path}/findDistrictsInProvince/${provinceId}`))
      .data;
  }
}

export default new DistrictsService();
