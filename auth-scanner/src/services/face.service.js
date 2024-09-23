import faceApi from "./face.api.service";

class FaceService {
  async validateFace(image) {
    const formData = new FormData();
    formData.append("image", image);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return (await faceApi.post(`/users/compare-faces`, formData, config)).data;
  }
}

export default new FaceService();
