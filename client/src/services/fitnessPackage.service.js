import api from "./api.service";

class FitnessPackageService {
  constructor() {
    this.path = "fitness-packages";
  }

  async getAllDetails() {
    return (await api.get("/detail")).data;
  }
}

export default new FitnessPackageService();
