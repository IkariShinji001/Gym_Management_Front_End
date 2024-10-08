import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Cho phép gửi cookie
};

const api = axios.create({
  baseURL: "http://localhost:3001/",
  ...commonConfig,
});

export default api;
