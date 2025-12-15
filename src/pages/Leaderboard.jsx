import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Zap, Bolt, Trophy, Target, AlertCircle, Crown, User } from "lucide-react";
import { api } from "../utils/api";
import PodiumCard from "../components/PodiumCard";

export default function Leaderboard(){
  const { user } = useAuth();
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

  useEffect(() =>{
    let mounted = true;
    setLoading(true);
    setError(null);

    api.get("/result/leaderboard")
      .then((data) => {
        if (!mounted) return;
        const rawList = Array.isArray(data.top) ? data.top : [];
        const withRanks = rawList.map((e, i) => ({ ...e, rank: i + 1 }));
        setTop(withRanks);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("leaderboard fetch error", err);
        setError("failed to load leaderboard.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {mounted = false};
  }, []);

  const myId = user?.id || user?._id ? String(user.id || user._id) : null;
  
  const topThree = top.slice(0, 3);
  const challengers = top.slice(3, 10);
  
  return (
    <div className="min-h-screen text-[#1a1a1a] py-10 font-textbox">
      <main className="max-w-5xl mx-auto px-6">
        
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[#e07856]/10 text-[#e07856]">
            <Trophy className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-instrument tracking-tight mb-3 text-[#2d3748]">
            Leaderboard
          </h1>
          <p className="text-gray-500 mb-23 font-medium tracking-wide uppercase text-xs">
            Global Rankings & Statistics
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-8 h-8 border-2 border-[#e07856] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-mono text-gray-500">FETCHING_DATA...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <>
            <section className="mb-20">
              <div className="flex flex-col md:flex-row items-end justify-center gap-6">
                <div className="order-2 md:order-1 w-full md:w-auto">
                  {topThree[1] && <PodiumCard data={topThree[1]} icon={Zap} />}
                </div>
                <div className="order-1 md:order-2 w-full md:w-auto -mt-8 md:-mt-12 z-10">
                  {topThree[0] && <PodiumCard data={topThree[0]} icon={Crown} large />}
                </div>
                <div className="order-3 md:order-3 w-full md:w-auto">
                  {topThree[2] && <PodiumCard data={topThree[2]} icon={Bolt} />}
                </div>
              </div>
            </section>

            <section className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">The Challengers</h3>
                 <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-100">
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1 md:col-span-1">#</div>
                    <div className="col-span-7 md:col-span-5">User</div>
                    <div className="col-span-2 md:col-span-3 text-right">Speed</div>
                    <div className="col-span-2 md:col-span-3 text-right">Acc</div>
                  </div>

                  {challengers.map((entry, i) => {
                    const rank = entry.rank;
                    const isMe = myId && String(entry.user?._id) === myId;
                    
                    return (
                      <div
                        key={entry._id || i}
                        className={`grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors duration-200 ${
                          isMe? "bg-orange-100/30" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="col-span-1 md:col-span-1 font-mono text-gray-400 text-sm">
                          {rank}
                        </div>

                        <div className="col-span-7 md:col-span-5 flex items-center gap-3">
                          <div className={`font-medium text-sm truncate flex items-center gap-2 ${isMe ? "text-[#e07856] font-bold" : "text-gray-900"}`}>
                            {entry.user?.userName || "Unknown"}
                            {isMe && <User size={14} strokeWidth={2.5} className="opacity-70" />}
                          </div>
                        </div>

                        <div className="col-span-2 md:col-span-3 text-right font-mono font-medium text-gray-900">
                          {entry.wpm} <span className="text-gray-400 text-xs hidden sm:inline">wpm</span>
                        </div>
                        <div className="col-span-2 md:col-span-3 text-right font-mono text-gray-500 text-sm">
                          {entry.accuracy}%
                        </div>
                      </div>
                    );
                  })}
                  {top.length <= 3 && (
                     <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <Target className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-sm">No other challengers yet.</span>
                     </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}