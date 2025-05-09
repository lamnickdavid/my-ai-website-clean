// 工具函数：获取token
export function getToken() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user && user.access_token ? user.access_token : '';
}

// 通用fetch，自动加Authorization
export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}
