import React, { useEffect, useRef, useState } from "react";
import { User, LogOut, Trophy, Zap, Target, ChevronDown } from "lucide-react";
import { api } from "../utils/api";

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    let canceled = false;
    
    async function fetchRank() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get("/result/rank");
        if (!canceled) setRankData(data);
      } catch (err) {
        if (!canceled) setError(err.message || "Failed to load");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    fetchRank();
    return () => { canceled = true; };
  }, [open]);

    useEffect(() => {
    function onDocClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  function toggleOpen() {
    setOpen((v) => !v);
  }

  const userName = user?.userName || "You";
  const rank = rankData?.rank ?? "-";
  const wpm = rankData?.best?.wpm ?? "-";
  const acc = rankData?.best?.accuracy ?? "-";

  return (
    <div className="relative font-display" ref={wrapperRef}>
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-200 border 
          ${open ? "bg-gray-100 border-gray-200" : "border-transparent hover:bg-gray-100"}`}
        onClick={toggleOpen}
      >
        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
           <User size={14} strokeWidth={2} />
        </div>
        <span className="text-sm font-medium select-none text-gray-700">{userName}</span>
        <ChevronDown 
          size={14} 
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} 
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Signed in as</p>
            <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-2 text-gray-400 text-sm">Loading stats...</div>
            ) : error ? (
              <div className="text-xs text-red-500 py-2 text-center">Failed to load stats</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Trophy size={14} />
                    <span className="text-xs font-medium uppercase">Global Rank</span>
                  </div>
                  <span className="font-mono font-bold text-[#e07856]">#{rank}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                      <Zap size={12} />
                      <span className="text-[10px] uppercase font-bold">Best WPM</span>
                    </div>
                    <span className="font-mono font-bold text-gray-800">{wpm}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                      <Target size={12} />
                      <span className="text-[10px] uppercase font-bold">Accuracy</span>
                    </div>
                    <span className="font-mono font-bold text-gray-800">{acc}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-100 bg-gray-50/30">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-colors"
            >
              <LogOut size={14} /> 
              LogOut
            </button>
          </div>
        </div>
      )}
    </div>
  );
}