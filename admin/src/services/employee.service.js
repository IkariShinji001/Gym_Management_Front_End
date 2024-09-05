import api from "./api.service";

class EmployeeService {
    constructor(){
        this.path = "/employees";
    }

    async getAllEmployee(){
        return (await api.get(`${this.path}`)).data;
    }

    async getEmployeeById(id){
        return (await api.get(`this.path/${id}`)).data;
    }
    async createEmployee(newEmployee){
        return (await api.post(`${this.path}`, newEmployee)).data;
    }
    async updateEmployee(id, employee){
        return (await api.patch(`${this.path}/${id}`, employee)).data;
    }
    async deleteEmployee(id){
        await api.delete(`${this.path}/${id}`);
    }
}

export default new EmployeeService();   