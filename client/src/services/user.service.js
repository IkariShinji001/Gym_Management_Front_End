import api from "./api.service";

class UserService {
  constructor() {
    this.path = "users";
  }

  async getUserById(userId) {
    return (await api.get(`${this.path}/${userId}`)).data;
  }

  async register(user) {
    return (await api.post(`${this.path}`, user)).data;
  }

  async updateUser(id, updateUser) {
    return (await api.patch(`${this.path}/${id}`, updateUser)).data;
  }

  async getUserByUsername(username) {
    return (
      await api.get(`${this.path}/username`, {
        params: { username },
      })
    ).data;
  }

  async getUserByRefferalCode(refferalCode) {
    return (await api.get(`${this.path}/refferal-code/${refferalCode}`)).data;
  }

  async getAllEntryTime(id, startDate, endDate) {
    console.log(startDate, endDate);
    return (
      await api.get(`${this.path}/${id}/entry-times`, {
        params: { startDate, endDate },
      })
    ).data;
  }
  async forgetPassword(email) {
    return (await api.post(`emails/reset-password`, { email })).data;
  }
  async resetPassword(token, newPassword) {
    return (
      await api.post(`${this.path}/update-password-with-token`, {newPassword}, {
        params: { token },
      })
    ).data;
  }
  async changePassword(id, password, newPassword) {
    return (await api.patch(`${this.path}/change-password/${id}`, { password, newPassword } )).data;
  }
}

export default new UserService();
