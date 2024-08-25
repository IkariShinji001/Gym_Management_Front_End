import { api } from "./api.service";

class SoldProductService {
    constructor(){
        this.path="sold-products"
    }

    async createSoldProduct(soldProduct) {
        return (await api.post(`${this.path}`, soldProduct)).data
    }

}

export default new SoldProductService()