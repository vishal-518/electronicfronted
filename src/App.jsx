import React, { useEffect } from "react";
import AppRoutes from "./Routes/AppRoutes";
import axios from "axios";

const App = () => {
  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/signup";
        }
        return Promise.reject(error);
      }
    );
  }, []); 

  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;
