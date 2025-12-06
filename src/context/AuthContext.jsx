// src/context/AuthContext.jsx
import React, {createContext,useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user, setUser]= useState(() =>{
    const raw= localStorage.getItem('user');
    return raw? JSON.parse(raw) : null;
  });
  const [token, setToken]= useState(() => localStorage.getItem('token'));
  const [loading, setLoading]= useState(Boolean(token));
  const [error, setError]= useState(null);

  useEffect(() =>{
    let mounted=true;
    async function validate(){
      if(!token){
        setLoading(false);
        setUser(null);
        return;
      }
      try{
        setLoading(true);
        const res= await api.get('/auth/me', { token });
        if(!mounted) return;
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } catch (err) {
        console.warn('token validation failed', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      finally{
        if(mounted) setLoading(false);
      }
    }
    validate();
    return ()=>{mounted = false; };
  }, [token]);

  const login = ({token: newToken, user: newUser})=>{
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout= ()=> {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{user, token, loading, error, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
