import api from "./api.service";

export class ProvincesService {
  constructor() {
    this.path = "/provinces";
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
}

export default new ProvincesService();