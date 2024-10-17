import axios from 'axios';

const commonConfig = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

const locationApi = axios.create({
    baseURL: "https://provinces.open-api.vn/",
    ...commonConfig,
})

export default locationApi;