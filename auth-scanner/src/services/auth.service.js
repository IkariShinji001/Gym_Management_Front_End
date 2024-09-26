import api from "./api.service";

class AuthService {
  constructor() {
    this.path = "auth";
  }

  async verifyUser(accessToken) {
    return (await api.post(`${this.path}/verify/user`, { accessToken })).data;
  }
}

export default new AuthService();
