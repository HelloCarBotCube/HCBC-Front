import axios from 'axios';

// API 기본 설정
const instance = axios.create({
  baseURL: 'http://gsmsv-1.yujun.kr:27919',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 accessToken 자동 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태코드
      switch (error.response.status) {
        case 401:
          console.error('인증 오류: 로그인이 필요합니다.');
          // 필요하면 로그인 페이지로 리다이렉트
          // window.location.href = '/login';
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
      // 요청은 보냈지만 응답이 없음
      console.error('서버 응답이 없습니다.');
    } else {
      // 요청 설정 중 오류 발생
      console.error('요청 오류:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
