import { auth } from '../firebase'; 

const API_BASE = import.meta.env.VITE_API_BASE;

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  const currentUser = auth.currentUser;
  let token = null;
  
  if (currentUser) {
    token = await currentUser.getIdToken(false); 
  }
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("API ERROR: Server returned non-JSON response.");
    throw { 
      status: res.status || 500, 
      message: 'Server returned invalid JSON. See console for details.',
      raw: text 
    };
  }
  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
};