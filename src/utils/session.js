import Cookies from "js-cookie";

export function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

export function isTokenExpired() {
    const token = getToken();
    if (!token) return true;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}

export function saveSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    Cookies.set('token', token, { expires: 1 }); // 1 día
    Cookies.set('role', user.role, { expires: 1 });
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    Cookies.remove('token');
    Cookies.remove('role');
}
