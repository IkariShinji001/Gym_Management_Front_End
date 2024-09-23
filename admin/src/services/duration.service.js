import api from "./api.service";

class DurationService{
    constructor(){
        this.path="/package-durations"
    }

    async getAll(){
        return (await api.get(`${this.path}`)).data
    }

    async create(duration){
        return (await api.post(`${this.path}`, duration)).data
    }

    async update(id, upDuration){
        return (await api.patch(`${this.path}/${id}`, upDuration)).data
    }

    async delete(id){
        return (await api.post(`${this.path}/${id}`)).data
    }
}

export default new DurationService()