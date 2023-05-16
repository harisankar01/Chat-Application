import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/chat-app-a1d1b/us-central1/app",
});
export default axiosInstance;
