import api from "./api.service";

class ServicePackageService {
    async getAllServicePackages() {
        return (await api.get("/service-packages")).data;
    }
    async getServicePackageById(id) {
        return (await api.get(`/service-packages/${id}`)).data;
    }
}

export default new ServicePackageService();