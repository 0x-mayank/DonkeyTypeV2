import React from 'react'

export default function PodiumCard({ data, icon: Icon }) {
  if (!data) return null;
  const rank = data.rank;
  const userName = data.user?.userName || "Unknown";
  const isFirst = rank === 1;

  return (
    <div className={`relative flex flex-col font-textbox items-center group ${isFirst ? "w-64" : "w-56"}`}>
      <div className={`absolute -top-4 z-20 w-8 h-8 flex items-center justify-center rounded-full border-2 bg-white font-bold shadow-sm 
        ${rank === 1 ? "border-yellow-400 text-yellow-700" : 
          rank === 2 ? "border-slate-300 text-slate-700" : 
          "border-orange-300 text-orange-800"}`}
      >
        {rank}
      </div>
      <div className={`w-full relative overflow-hidden bg-white border-b-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 
        ${isFirst ? "h-64" : "h-52"}
        ${rank === 1 ? "border-yellow-400" : 
          rank === 2 ? "border-slate-300" : 
          "border-orange-300"}`}
      >
        <div className={`h-24 flex flex-col items-center justify-center 
          ${rank === 1 ? "bg-yellow-50" : 
            rank === 2 ? "bg-slate-50" : 
            "bg-orange-50"}`}
        >
           <div className="p-2 bg-white rounded-full shadow-sm mb-2">
             <Icon className={`w-5 h-5 
               ${rank === 1 ? "text-yellow-700" : 
                 rank === 2 ? "text-slate-700" : 
                 "text-orange-800"}`} 
             />
           </div>
           <p className={`font-bold text-gray-900 truncate max-w-[80%] ${isFirst ? "text-lg" : "text-base"}`}>
             {userName}
           </p>
        </div>
        
        <div className="p-4 text-center">
            <div className="flex flex-col justify-center h-full">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Speed</span>
                <span className={`font-textbox font-bold text-gray-900 ${isFirst ? "text-4xl" : "text-3xl"}`}>
                    {data.wpm}
                </span>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                    {data.accuracy}% Acc
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}