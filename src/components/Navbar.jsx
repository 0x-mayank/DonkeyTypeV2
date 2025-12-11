import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Home, Trophy, LogIn, Zap,} from 'lucide-react'
import Logo from '../assets/logo.svg'
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu"

export default function Navbar() {
  const {user, logout} = useAuth();

  return (
    <div className="w-full flex justify-center py-6 font-display">
      <nav className="flex items-center gap-2 rounded-xl px-5 py-2">
        <div className="flex items-center gap-1 mr-3">
          <img src={Logo} alt="logo" className="w-7 h-auto mb-1" />
          <span className="font-semibold text-gray-800 text-m tracking-wide select-none">
            donkeyType
          </span>
        </div>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-m font-medium transition-colors ${
              isActive ? "bg-gray-700 text-white" : "text-gray-800 hover:bg-gray-200"
            }`
          }
        >
          <Home size={15} strokeWidth={2} /> Home
        </NavLink>

        <NavLink
          to="/test"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-m font-medium transition-colors ${
              isActive ? "bg-gray-700 text-white" : "text-gray-800 hover:bg-gray-200"
            }`
          }
        >
          <Zap size={15} strokeWidth={2} />
          Practice
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-m font-medium transition-colors ${
              isActive ? "bg-gray-700 text-white" : "text-gray-800 hover:bg-gray-200"
            }`
          }
        >
          <Trophy size={15} strokeWidth={2} />
          Leaderboard
        </NavLink>

        <div className="h-6 w-0.5 bg-gray-700 mx-2" />

        {user ? (
          <UserMenu user={user} onLogout={logout} />
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-2 py-1.5 rounded-md text-m font-medium ${
                isActive ? "bg-gray-700 text-white" : "text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            <LogIn size={15} strokeWidth={2} />
            Login/Register
          </NavLink>
        )}
      </nav>
    </div>
  );
}

