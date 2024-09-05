import api from "./api.service";

class UserService {
  constructor() {
    this.path = "users";
  }

  async getUserById(userId) {
    return (await api.get(`${this.path}/${userId}`)).data;
  }

  async getUserByUsername(username) {
    return (
      await api.get(`${this.path}/username`, {
        params: { username },
      })
    ).data;
  }

  async getAllEntryTime(id, startDate, endDate) {
    console.log(startDate, endDate);
    return (
      await api.get(`${this.path}/${id}/entry-times`, {
        params: { startDate, endDate },
      })
    ).data;
  }
}

export default new UserService();