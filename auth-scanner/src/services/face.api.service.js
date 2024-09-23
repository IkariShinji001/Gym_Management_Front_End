import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const faceApi = axios.create({
  baseURL: "http://127.0.0.1:5001",
  ...commonConfig,
});

export default faceApi;
