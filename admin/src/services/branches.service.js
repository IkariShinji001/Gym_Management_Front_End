import api from "./api.service";

class BranchesService {
  constructor() {
    this.path = "/branches";
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

  async findBranchInProvince(provinceId) {
    return (await api.get(`${this.path}/findBranchInProvince/${provinceId}`))
      .data;
  }

  async checkNameBranchExisted(nameBranch, id) {
    return (
      await api.get(
        `${this.path}/check-name-branch-existed/${nameBranch}/${id}`
      )
    ).data;
  }
}

export default new BranchesService();
