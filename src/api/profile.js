import instance from './axios';

/**
 * 내 프로필 조회
 * GET /api/user/myprofile
 */
export const getMyProfile = async () => {
  try {
    const response = await instance.get('/api/user/myprofile');
    return response.data;
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    throw error;
  }
};

/**
 * 내 프로필 수정
 * PATCH /api/user/myprofile-update
 * @param {Object} profileData - 수정할 프로필 데이터 (전체)
 * @param {string} profileData.name - 이름
 * @param {array} profileData.categories - 카테고리 배열
 * @param {string} profileData.gender - 성별
 * @param {number} profileData.age - 나이
 * @param {string} profileData.address - 주소
 */
export const updateMyProfile = async (profileData) => {
  try {
    console.log('[API] 프로필 수정 요청 시작:', profileData);
    const response = await instance.patch('/api/user/myprofile-update', profileData);
    console.log('[API] 프로필 수정 응답:', response);
    console.log('[API] 프로필 수정 응답 데이터:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] 프로필 수정 실패:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};
