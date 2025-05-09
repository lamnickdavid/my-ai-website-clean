export function isAdminLoggedIn() {
  return !!localStorage.getItem('admin_token');
}
export function logoutAdmin() {
  localStorage.removeItem('admin_token');
}
