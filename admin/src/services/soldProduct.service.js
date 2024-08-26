import { api } from "../services/api.service";

class SoldProductService {
    constructor(){
        this.path="sold-products"
    }

    async createSoldProduct(soldProductPayload) {
        return (await api.post(`${this.path}`, soldProductPayload)).data
    }

}

export default new SoldProductService()