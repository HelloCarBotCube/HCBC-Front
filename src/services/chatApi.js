import axios from 'axios';
import { getAccessToken, clearTokens } from '../utils/cookies';

const API_BASE_URL = 'http://gsmsv-1.yujun.kr:27919';

const chatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

chatApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

chatApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();

      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const startRandomChat = async () => {
  try {
    const response = await chatApi.post('/api/chat/start');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatRooms = async (limit = 50) => {
  try {
    const response = await chatApi.get('/api/chat', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await chatApi.delete(`/api/chat/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatHistory = async (roomId, startIndex = 0, count = 50) => {
  try {
    const response = await chatApi.get(`/api/chat/rooms/${roomId}/messages`, {
      params: { startIndex, count },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyInfo = async () => {
  try {
    const response = await chatApi.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await chatApi.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default chatApi;
