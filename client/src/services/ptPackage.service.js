import api from "./api.service";

class PTPackageService {
    constructor() {
        this.path = "pt-packages";
    }

    async getAllPtPackageDetails() {
        return (await api.get(`${this.path}/detail`)).data;
    }
    async getAllPtPackages(){
        return (await api.get(`${this.path}/`)).data;
    }
    async getPtPackageById(id){
        return (await api.get(`${this.path}/${id}`)).data;
    }
    async getAll(){
        return (await api.get(`${this.path}/getAll`)).data;
    }
}

export default new PTPackageService();