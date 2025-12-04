import React from "react";
import { Link } from "react-router-dom";
import { Zap,Sparkles, Clock,BarChart3,Trophy,Users  } from "lucide-react";
import FeatureCard from "../components/FeatureCard";

export default function Home() {
  return (
    <div>
      <section className="text-center py-30 font-display">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-9xl font-instrument leading-tight mb-4" style={{ color: "#3A2B21" }}>
          <span className="text-[#f76f53] italic">Track</span> your <span className="text-[#f76f53] italic">Progress</span> <span className="block text-9xl">and <span className="text-[#f76f53] italic"> Compete</span> for the Top</span>
        </h1>

        <p className="text-xl text-gray-800 m-8">
          Test your typing speed and accuracy. Challenge yourself and climb the leaderboards!
        </p>

        <div className="flex items-center text-xl justify-center gap-4 mt-15">
          <Link to="/test" className="px-6 py-4 rounded-xl text-[#f2f0e3] flex items-center gap-1 bg-gray-800 hover:scale-105 transition-transform">
            <Zap size={20} strokeWidth="2"/>Start Typing
          </Link>
          <Link to="/leaderboard" className="px-6 py-4 rounded-xl  text-gray-800 bg-[#d6e0d6] hover:scale-105 transition-transform">
            View Leaderboard
          </Link>
        </div>
      </div>
    </section>


    <section className="max-w-6xl mx-auto px-4 pb-20">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Real-Time Testing"
            description="Instant feedback on speed and accuracy with every keystroke."
            color="#FFEEDC"
            icon={<Clock size={20} strokeWidth={2} className="text-gray-800" />}
          />

          <FeatureCard
            title="Compete & Win"
            description="Join the global leaderboard and challenge typists worldwide."
            color="#FFEEDC"
            icon={<Trophy size={20} strokeWidth={2} className="text-[#2f3f2f]" />}
          />

          <FeatureCard
            title="Global Rank"
            description="Check where you stand among other typists."
            color="#FFEEDC"
            icon={<Users size={20} strokeWidth={2} className="text-[#2f3f2f]" />}
          />
        </div>
      </section>

    </div>
  );
}
