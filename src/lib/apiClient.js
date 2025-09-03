import { getToken, clearSession } from "@/utils/session";

export class ApiClient {
  constructor({ baseUrl = '' } = {}) {
    this.baseUrl = baseUrl;
  }

  async request(path, { method = 'GET', params = {}, body = null } = {}) {
    if (!path.startsWith('/')) path = '/' + path;

    const url = new URL(this.baseUrl + path);
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });

    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const token = getToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;

    if (body) opts.body = JSON.stringify(body);


    // Si no autorizado
    const res = await fetch(url.toString(), opts);

    if ((res.status === 401 || res.status === 403) && path !== '/auth/loginAdmin') {
      clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Sesión expirada o token inválido');
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `API error ${res.status}`);
    }

    return res.json();

  }

  get(path, params) { return this.request(path, { method: 'GET', params }); }
  post(path, body) { return this.request(path, { method: 'POST', body }); }
  put(path, body) { return this.request(path, { method: 'PUT', body }); }
  delete(path) { return this.request(path, { method: 'DELETE' }); }
}
