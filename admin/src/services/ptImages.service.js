import api from "./api.service";

class PtImagesService {
    constructor(){
        this.path = "/ptImages";
    }
    async getPtImages(){
        return (await api.get(`${this.path}`)).data
    }
    async createImage(imageUrl, idPt){
     return (await api.post(`${this.path}`, {imageUrl, idPt})).data
    }
    async deleteImage(id){
        return (await api.delete(`${this.path}/${id}`)).data
    }   

}

export default new PtImagesService()