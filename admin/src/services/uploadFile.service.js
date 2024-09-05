import  api  from "./api.service";

class UploadService {
  constructor() {
    this.path = "/upload";
  }

  async uploadFile(formData) {
    return (await api.post(`${this.path}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })).data
  }
}

export default new UploadService()