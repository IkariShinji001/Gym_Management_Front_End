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
  async deleteFile(id) {
    return (await api.delete(`${this.path}/${id}`)).data
  } 
}

export default new UploadService()
