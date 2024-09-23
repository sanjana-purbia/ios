import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import ApiConstants from '../ApiConstants';
import ApiUrls from '../ApiUrls';

const mmkv = new MMKV();

const api = axios.create({
  baseURL: ApiConstants.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(mmkv.getString('user') || '{}');
    if (user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = JSON.parse(mmkv.getString('user') || '{}');
      try {
        const response = await axios.post(ApiUrls.refreshToken, {
          refreshToken: user.refreshToken,
        });
        const { accessToken, refreshToken } = response.data.data;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        mmkv.set('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        mmkv.delete('user');
        // Redirect to login screen or update app state
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;