import axios from 'axios';

// Asosiy URL .env fayldan olinadi
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.escuelajs.co/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. REQUEST INTERCEPTOR: Tokenni har bir so'rovga qo'shish
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Xatolarni ushlash va Tokenni yangilash
instance.interceptors.response.use(
  (response) => {
    return response.data; // Faqat toza data qaytaramiz
  },
  async (error) => {
    const originalRequest = error.config;

    // Agar xato 401 bo'lsa VA biz hali bu so'rovni qayta urinib ko'rmagan bo'lsak
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Belgilab qo'yamizki, qayta urinish boshlandi

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error("Refresh token mavjud emas");
        }

        // DIQQAT: Refresh qilish uchun alohida axios call qilamiz (instance emas!)
        // Sababi: instance ishlatsak, yana interceptorga tushib, cheksiz loop bo'lib qolishi mumkin.
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken: refreshToken // API hujjati bo'yicha "camelCase" yuboryapmiz
        });

        // Hujjatga ko'ra server yangi juftlik qaytaradi: { access_token, refresh_token }
        const { access_token, refresh_token } = response.data;

        // Ikkalasini ham yangilab qo'yamiz (Rotation)
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Eski so'rovning headerini yangi token bilan yangilaymiz
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Va nihoyat, eski so'rovni qaytadan yuboramiz
        return instance(originalRequest);

      } catch (refreshError) {
        // Agar refresh token ham o'tmasa (muddati tugagan yoki noto'g'ri)
        console.error("Session expired. Please login again.");

        // Hamma narsani tozalab, login sahifasiga otamiz
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');

        window.location.href = '/login'; // Redirect

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

// Infinite Loop (Cheksiz aylanish) xavfi: 
// Nega biz refresh-token so'rovini yuborishda instance.post emas, oddiy axios.post ishlatdik?
// Agar instance ishlatsak, u yana Headerga eski tokenni qo'shib yuboradi, yana 401 oladi, yana interceptorga tushadi va dastur qotib qoladi
// Shuning uchun axiosni ozini ishlatdik
