import api from "./api.service";

class BenefitPackageService {

    async  findBenefitByFitnessPackageId (id) {
        return  (await api.get(`/fitness-benefits/${id}`)).data;
    }

}

export default new BenefitPackageService();