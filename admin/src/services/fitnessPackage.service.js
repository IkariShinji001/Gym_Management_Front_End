import api from "./api.service"

class FitnessPackageSerivce{
    constructor(){
        this.path="/fitness-packages"
    }
    
    async getAll(){
       return (await (api.get(`${this.path}`))).data
    }

    async getAllWithDetail(){
        return (await api.get(`${this.path}/detail`)).data
    }
}

export default new FitnessPackageSerivce()