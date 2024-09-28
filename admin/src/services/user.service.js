import api from "./api.service";

class UserService {
  constructor() {
    this.path = "/users";
  }

  async getAllUserEmailPerPage(page = 1, take = 10) {
    const params = {
      page: page,
      take: take,
    };
    return (await api.get(`${this.path}/all-emails-per-page`, { params })).data;
  }

  async getAllUserEmailPerPageByGender(page = 1, take = 10, gender) {
    const params = {
      page: page,
      take: take,
      gender: gender,
    };
    return (
      await api.get(`${this.path}/all-emails-per-page-by-gender`, { params })
    ).data;
  }
}

export default new UserService();
