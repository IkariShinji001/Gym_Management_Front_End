import api from "./api.service";

class ServicePackagePriceService {
  async getAllPackagePrice() {
    return (await api.get("/service-package-prices")).data;
  }
  async getPackagePriceById(id) {
    return (await api.get(`/service-package-prices/${id}`)).data;
  }

  async getPackagePriceByListIds(listIds) {
    return (
      await api.post(`/service-package-prices/get-by-list-ids`, {
        servicePackagePriceListIds: listIds,
      })
    ).data;
  }
}

export default new ServicePackagePriceService();
