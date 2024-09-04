import api from "./api.service";

class ProfilesService {
  async getProfiles() {
    return (await api.get("/profiles")).data;
  }
  async getProfile(id) {
    return (await api.get(`/profiles/${id}`)).data;
  }
  async updatedProfile(id, profile) {
    return (await api.patch(`/profiles/${id}`, profile)).data;
  }
}

export default new ProfilesService();
