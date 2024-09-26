import api from "./api.service";

class authService {
  async login(email, password) {
    return (await api.post("/auth/admin/login", { email, password })).data;
  }
}

export default new authService();
