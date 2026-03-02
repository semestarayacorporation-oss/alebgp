export const login = (userData) => {
    localStorage.setItem('zolog_user', JSON.stringify(userData));
};
export const logout = () => {
    localStorage.removeItem('zolog_user');
};
export const checkAuth = () => {
    return localStorage.getItem('zolog_user') !== null;
};
export const getUser = () => {
    return JSON.parse(localStorage.getItem('zolog_user'));
};
