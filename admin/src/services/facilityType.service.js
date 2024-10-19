import api from './api.service'

class FacilityTypeService {
    constructor() {
        this.path = "/facility-type"
    }

    async create(data){
        return (await api.post(`${this.path}`, data)).data;
    }

    async findAll(){
        return (await api.get(`${this.path}`)).data;
    }

    async update(id, data){
        return (await api.patch(`${this.path}/${id}`,data)).data;
    }
}

export default new FacilityTypeService();