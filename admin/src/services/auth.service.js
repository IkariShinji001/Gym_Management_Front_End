import api from "./api.service";

class authService {
    async login(email, password) {
        return await api.post("/auth/admin/login", {email, password});
    }
}

export default new authService();