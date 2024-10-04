import api from "./api.service";

class BlogService {
  constructor() {
    this.path = "/blogs";
  }

  async getAll() {
    return (await api.get(`${this.path}`)).data;
  }

  async getOne(id){
    return (await api.get(`${this.path}/posts/${id}`)).data
  }

  async createPost(data) {
    return (await api.post(`${this.path}`, data)).data;
  }
}

export default new BlogService();
