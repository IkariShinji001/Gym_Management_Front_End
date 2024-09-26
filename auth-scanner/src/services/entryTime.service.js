import api from "./api.service";

class EntryTime {
  constructor() {
    this.path = "entry-times";
  }

  async createEntryTime(userId) {
    return (await api.post(`${this.path}`, { userId })).data;
  }
}

export default new EntryTime();
