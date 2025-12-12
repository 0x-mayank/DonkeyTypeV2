import React from 'react';
import { NavLink } from 'react-router-dom'
import { Home, Trophy, LogIn, Zap } from 'lucide-react'
import Logo from '../assets/logo.svg'
import { useAuth } from "../context/AuthContext"
import UserMenu from "./UserMenu"

export default function Navbar() {
  const { user, logout } = useAuth();
  const getLinkClasses = ({isActive}) =>
    `group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out border border-transparent
    ${
      isActive? "bg-gray-700 text-white shadow-md scale-105" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200 "
    }`;

  return (
    <div className="w-full flex justify-center py-6 font-display sticky top-0 z-50">
      <nav className="flex items-center gap-1 rounded-full px-2 py-2 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50">
        
        <div className="flex items-center gap-2 pr-4 pl-3 group cursor-default">
          <img 
            src={Logo} 
            alt="logo" 
            className="w-7 h-auto mb-1 transition-transform duration-500 ease-in-out group-hover:rotate-12 group-hover:scale-110" 
          />
          <span className="font-bold text-gray-800 text-lg tracking-tight select-none transition-colors duration-300 group-hover:text-black">
            donkeyType
          </span>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1 rounded-full" />

        <div className="flex items-center gap-1 px-1">
          <NavLink to="/" className={getLinkClasses}>
            <Home size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:scale-105" /> 
            Home
          </NavLink>

          <NavLink to="/test" className={getLinkClasses}>
            <Zap size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:scale-105" />
            Practice
          </NavLink>

          <NavLink to="/leaderboard" className={getLinkClasses}>
            <Trophy size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:scale-105" />
            Leaderboard
          </NavLink>
        </div>

        <div className="pl-2">
          {user ? (
            <div className="transition-all duration-300 hover:scale-105">
               <UserMenu user={user} onLogout={logout} />
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-out shadow-sm
                ${
                  isActive? "bg-gray-700 text-white": "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-black hover:shadow-md hover:-translate-y-0.5"
                }`
              }
            >
              <LogIn size={16} strokeWidth={2} />
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}