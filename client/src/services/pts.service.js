import api from "./api.service";

class ptsService {
    // async getAll() {
    //     return (await api.get("/pts")).data;
    // }
    async getById(id) {
        return (await api.get(`/pts/${id}`)).data;
    }

    
}

export default new ptsService();