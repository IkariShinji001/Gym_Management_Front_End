import locationApi from "./locationApi.service";

export class LocationService {
  constructor() {
    this.path = "/api";
  }

  async findAllProvinces() {
    return (await locationApi.get(`${this.path}`)).data;
  }

  async findAllDistrictsByProvince(provinceCode) {
    console.log(provinceCode)
    return (
      await locationApi.get(`${this.path}/p/${provinceCode}`, {
        params: { depth: 2 },
      })
    ).data;
  }

  async findAllWardsByDistrict(districtCode) {
    return (
      await locationApi.get(`${this.path}/d/${districtCode}`, {
        headers: { params: { depth: 2 } },
      })
    ).data;
  }
}

// async find

export default new LocationService();
