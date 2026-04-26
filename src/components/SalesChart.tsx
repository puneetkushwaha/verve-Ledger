"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesChartProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00CF64" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00CF64" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            hide
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{payload[0].payload.date}</p>
                    <p className="text-xl font-black text-white font-outfit tracking-tighter">
                      ₹{payload[0].value?.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#00CF64"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorSales)"
            animationBegin={0}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
