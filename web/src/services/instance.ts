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
    const token = localStorage.getItem("token");

    console.log("Auth token:", token ? "Mevcut" : "Yok");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Hata ayıklama için header'ları konsola yazdır
      console.log("Request headers:", config.headers);
    } else {
      console.warn("Token bulunamadı, istek yetkilendirmesiz gönderiliyor!");
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 Unauthorized hatası gelirse kullanıcıyı login sayfasına yönlendir
api.interceptors.response.use(
  (response) => {
    // Başarılı yanıt için opsiyonel loglama
    console.log(
      `${response.config.method?.toUpperCase()} ${response.config.url} - ${
        response.status
      }`
    );
    return response;
  },
  (error) => {
    // Hata detaylarını konsola yazdır
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers,
    });

    // 401 Unauthorized hatası gelirse
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized error - Token geçersiz veya eksik");

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
