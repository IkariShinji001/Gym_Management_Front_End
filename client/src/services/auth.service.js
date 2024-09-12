import api from "./api.service";
class AuthService {
  constructor() {
    this.path = "auth";
  }

  async login(userInfo) {
    const res = (await api.post(`${this.path}/user/login`, userInfo)).data;
    return res;
  }
}

export default new AuthService();
