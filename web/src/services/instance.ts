import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    // localStorage'dan token'ı al
    const token = localStorage.getItem("auth_token");

    // Eğer token varsa, Authorization header'ına ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 Unauthorized hatası gelirse kullanıcıyı login sayfasına yönlendir
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized hatası gelirse
    if (error.response && error.response.status === 401) {
      // Token'ı temizle
      localStorage.removeItem("auth_token");

      // Eğer tarayıcı ortamındaysak, login sayfasına yönlendir
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
