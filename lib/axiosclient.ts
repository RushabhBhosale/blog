import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosClient;
