import api from "./api.service";

class ServicePackagePriceService {
    async getAllPackagePrice() {
        return (await api.get("/service-package-prices")).data;
}
    async getPackagePriceById(id) {
        return (await api.get(`/service-package-prices/id/${id}`)).data;
    }
}

export default new ServicePackagePriceService();