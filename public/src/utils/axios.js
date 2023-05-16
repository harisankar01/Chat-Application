import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://chat-app-a1d1b.web.app",
});
export default axiosInstance;
