import axios from "axios";

const axiosInstance=axios.create({
     baseURL: "https://electronicbackend-bzcr.onrender.com",
  withCredentials: true,
})

axiosInstance.interceptors.response.use((response)=>response,(error)=>{
    if (error.response && error.response.status === 401) {
         localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signup"
    }
     return Promise.reject(error);
})

export default axiosInstance;