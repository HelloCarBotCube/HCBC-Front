export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const setAccessToken = (token) => {
  setCookie('accessToken', token, 7);
};

export const getAccessToken = () => {
  return getCookie('accessToken');
};

export const setRefreshToken = (token) => {
  setCookie('refreshToken', token, 30);
};

export const getRefreshToken = () => {
  return getCookie('refreshToken');
};

export const clearTokens = () => {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
  localStorage.removeItem('myUserId');
  localStorage.removeItem('accessTokenExpiresIn');
  localStorage.removeItem('refreshTokenExpiresIn');
};
