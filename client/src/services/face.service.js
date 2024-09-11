import faceApi from "./face.api.service";

class FaceService {
  async createFaceReg(userId, images) {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return (await faceApi.post(`/users/${userId}/uploads`, formData, config))
      .data;
  }
}

export default new FaceService();
