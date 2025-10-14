import { TOKEN_KEY, ROLE_KEY, USER_KEY } from '../utils/constants.js';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getRole = () => localStorage.getItem(ROLE_KEY);
export const setRole = (role) => localStorage.setItem(ROLE_KEY, role);
export const removeRole = () => localStorage.removeItem(ROLE_KEY);

export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(USER_KEY);

export const isAuthenticated = () => !!getToken();
export const isAdmin = () => getRole() === 'admin';

export const clearAuth = () => {
  removeToken();
  removeRole();
  removeUser();
};

export const setAuth = (token, user) => {
  setToken(token);
  setRole(user.role);
  setUser(user);
};