import api from "./api.service";


class PackageTypeService {
    constructor(){
        this.path = "/service-package-types"
    }

    async getAllPackageType(){
        return (await api.get(`${this.path}`)).data
    }

    async createPackageType(type){
        return (await api.post(`${this.path}`, type)).data
    }

    async updatePackageType(typeId, upType){
        return (await api.patch(`${this.path}/${typeId}`), upType).data
    }

    async deletePackageType(typeId){
        await (api.delete(`${this.path}/${typeId}`))
    }

}

export default new PackageTypeService()