const API_BASE ='http://localhost:4000/api';

async function request(path, {method= 'GET', body, token }={}){
  const headers={};
  const t= token?? localStorage.getItem('token');
  if(t) headers['Authorization']= 'Bearer ' + t;
  if(body) headers['Content-Type']='application/json';

  const res= await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  const text= await res.text();
  try{
    const data = text? JSON.parse(text) : null;
    if(!res.ok) throw{status: res.status, data};
    return data;
  }catch(err){
    if(err.status)throw err;
    throw new Error('failed to parse response');
  }
}

export const api= {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, {...opts, method: 'POST', body}),
};
