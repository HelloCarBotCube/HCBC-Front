import axios from 'axios';
import { getAccessToken } from '../utils/cookies';

const instance = axios.create({
  baseURL: 'http://gsmsv-1.yujun.kr:27919',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
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

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('인증 오류: 로그인이 필요합니다.');
          break;
        case 403:
          console.error('권한이 없습니다.');
          break;
        case 404:
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          console.error('서버 오류가 발생했습니다.');
          break;
        default:
          console.error('오류가 발생했습니다:', error.response.data);
      }
    } else if (error.request) {
      console.error('서버 응답이 없습니다.');
    } else {
      console.error('요청 오류:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
