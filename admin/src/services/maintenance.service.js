import api from "./api.service";

class MaintenancesService {
  async findAll() {
    return await api.get("/maintenances");
  }

  async create(data) {
    return (await api.post("/maintenances", data)).data;
  }

  async update(id, data) {
    return (await api.patch(`/maintenances/${id}`, data)).data;
  }

  async delete(id) {
    return (await api.delete(`/maintenances/${id}`)).data;
  }

  async maintenanceHistory(idFacility) {
    return (await api.get(`/maintenances/maintenanceHistory/${idFacility}`))
      .data;
  }

  async findMaintenanceIsFinished() {
    return await api.get("/maintenances/findMaintenanceIsFinished");
  }

  async findMaintenanceIsNotFinished() {
    return await api.get("/maintenances/findMaintenanceIsNotFinished");
  }

  async countMaintenancesByMonth(facilityId, year) {
    console.log(facilityId, year);
    return (
      await api.get(`/maintenances/count-maintenances-by-month/${facilityId}`, {
        params: { year: year },
      })
    ).data;
  }
}

export default new MaintenancesService();
