const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const url = input.startsWith('http') ? input : `${baseUrl}${input}`;
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return fetch(url, { ...init, headers });
}

export const apiClient = {
  async get<T>(path: string, options?: { params?: Record<string, number | string> }): Promise<T> {
    const res = await apiFetch(urlWithParams(path, options?.params), { method: 'GET' });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await apiFetch(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await apiFetch(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  },

  async delete<T>(path: string): Promise<T> {
    const res = await apiFetch(path, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  },

  async upload<T>(path: string, formData: FormData): Promise<T> {
    // Do NOT set Content-Type — browser must set it with the multipart boundary
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
    const headers = new Headers();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const res = await fetch(url, { method: 'PUT', headers, body: formData });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  },
};

function urlWithParams(path: string, params: Record<string, number | string> | undefined): string {
  if (!params) return path;
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return `${path}?${queryString}`;
}

