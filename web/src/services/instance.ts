import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with cross-origin requests
});

// Request Interceptor: Her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

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

    // Hata içindeki mesajları kontrol et
    const errorMessages = error.response?.data?.errors || [];
    const isAuthError = errorMessages.some(
      (err: { message?: string; field?: string }) =>
        typeof err.message === "string" &&
        (err.message.includes("yetkilendirme") ||
          err.message.includes("oturum") ||
          err.message.includes("giriş yap") ||
          err.message.toLowerCase().includes("auth") ||
          err.message.includes("Yazar ID"))
    );

    // 401 Unauthorized veya yetkilendirme hatası içeren 422 hatası gelirse
    if (
      error.response &&
      (error.response.status === 401 ||
        (error.response.status === 422 && isAuthError))
    ) {
      console.warn("Yetkilendirme hatası - Oturum geçersiz veya eksik");

      // Token'ı ve userId'yi temizle
      localStorage.removeItem("auth_token");
      localStorage.removeItem("userId");

      // Eğer tarayıcı ortamındaysak ve şu an login sayfasında değilsek, login sayfasına yönlendir
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/login")) {
          console.log("Yönlendiriliyor: /login");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
