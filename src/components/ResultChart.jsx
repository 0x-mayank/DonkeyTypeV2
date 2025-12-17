import React from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";

export default function ResultChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[300px] mt-8 animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />

          <YAxis 
            yAxisId="left" 
            stroke="#9ca3af" 
            tick={{ fontSize: 12 }}
            tickLine={false} 
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a1a1a", border: "none", borderRadius: "8px", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
            cursor={{stroke: "#f76f53", strokeWidth: 1}}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="wpm"
            stroke="#f76f53"
            strokeWidth={3}
            dot={{ r: 3, fill: "#f76f53", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#f76f53", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}