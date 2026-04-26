"use client";

import { 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Target,
  LineChart as LineChartIcon,
  ArrowUp,
  BarChart as BarChartIcon,
  Cpu,
  Globe,
  Database,
  ArrowRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const behaviorData = [
  { name: 'Returning', value: 45, color: '#00CF64' },
  { name: 'New', value: 30, color: '#10B981' },
  { name: 'Corporate', value: 25, color: '#3B82F6' },
];

const profitData = [
  { name: 'Mon', profit: 4000 },
  { name: 'Tue', profit: 3000 },
  { name: 'Wed', profit: 2000 },
  { name: 'Thu', profit: 2780 },
  { name: 'Fri', profit: 1890 },
  { name: 'Sat', profit: 2390 },
  { name: 'Sun', profit: 3490 },
];

export default function Analytics() {
  return (
    <div className="space-y-16 pb-40 max-w-7xl mx-auto px-4">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#00CF64]/10 rounded-lg flex items-center justify-center border border-[#00CF64]/20 shadow-lg">
              <BarChartIcon className="w-4 h-4 text-[#00CF64]" />
            </div>
            <h1 className="text-xl font-black font-outfit text-white uppercase tracking-tight">Business Intelligence</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[7px] tracking-[0.4em] ml-11">Data-driven performance insights</p>
        </div>
        <Button 
          onClick={() => window.print()}
          className="h-10 px-6 bg-white text-black hover:bg-slate-100 rounded-lg font-black uppercase tracking-widest text-[9px] shadow-xl flex gap-2 items-center">
          <Database className="w-3.5 h-3.5" /> Intelligence Report
        </Button>
      </div>

      {/* Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        <Card className="premium-card relative bg-gradient-to-br from-[#00CF64] via-[#00CF64]/90 to-[#10B981] text-white border-white/20 group overflow-hidden shadow-[0_20px_50px_rgba(0,207,100,0.2)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-[80px] -mr-24 -mt-24 transition-all duration-700 group-hover:scale-125" />
          <CardHeader className="p-5 pb-2 relative z-10">
            <div className="flex justify-between items-start">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-90">
                    <Cpu className="w-3.5 h-3.5" /> Revenue Forecast
                </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 relative z-10">
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-black font-outfit tracking-tighter shadow-sm">₹4,85,000</h3>
              <div className="text-[8px] font-black bg-white/20 px-1.5 py-0.5 rounded-lg flex items-center gap-1 border border-white/10 backdrop-blur-md">
                <TrendingUp className="w-2.5 h-2.5" /> +18.4%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-all duration-700" />
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-5 h-5" /> Stock Risk Matrix
            </CardTitle>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-2">Resource depletion vulnerabilities</p>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-6">
            <div className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl group-hover:border-rose-500/30 transition-all duration-500">
              <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Mechanical Cores</p>
                  <p className="text-[9px] text-slate-700 font-black uppercase mt-1 tracking-widest">ID: #MAC-102</p>
              </div>
              <div className="text-right">
                  <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest bg-rose-500/10 px-4 py-1.5 rounded-xl border border-rose-500/10">92 Days Idle</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl group-hover:border-rose-500/30 transition-all duration-500">
              <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">Quantum Sensors</p>
                  <p className="text-[9px] text-slate-700 font-black uppercase mt-1 tracking-widest">ID: #QNT-505</p>
              </div>
              <div className="text-right">
                  <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest bg-rose-500/10 px-4 py-1.5 rounded-xl border border-rose-500/10">68 Days Idle</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 mt-4 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Protocol: Deploy 15% Rebate Node
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card relative group">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-[#00CF64]">
              <Zap className="w-5 h-5 fill-[#00CF64]/20" /> Efficiency Vectors
            </CardTitle>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-2">Next 30 day velocity forecast</p>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white">
                  <span>Wireless Hubs</span>
                  <div className="flex items-center gap-2 text-[#00CF64]">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>92% Confidence</span>
                  </div>
                </div>
                <div className="w-full bg-white/[0.03] h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="bg-gradient-to-r from-[#00CF64] to-[#10B981] h-full rounded-full w-[92%] shadow-[0_0_20px_rgba(0,207,100,0.4)] animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white">
                  <span>Logic Arrays</span>
                  <div className="flex items-center gap-2 text-[#00CF64]">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>78% Confidence</span>
                  </div>
                </div>
                <div className="w-full bg-white/[0.03] h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="bg-gradient-to-r from-[#00CF64] to-[#10B981] h-full rounded-full w-[78%] shadow-[0_0_20px_rgba(0,207,100,0.4)]"></div>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-12 h-14 bg-white/5 text-white hover:bg-white/10 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] border border-white/5 group-hover:border-[#00CF64]/30 transition-all">
                Full Flux Analysis <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="premium-card group">
          <CardHeader className="p-12 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black font-outfit text-white uppercase tracking-tight flex items-center gap-4">
                  <Target className="w-8 h-8 text-rose-500" /> Customer Matrix
                </CardTitle>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Neural segmentation mapping</p>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                <BarChartIcon className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-12 min-h-[450px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={11} 
                    fontWeight="900" 
                    tickFormatter={(v) => v.toUpperCase()}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Bar dataKey="value" radius={[15, 15, 0, 0]} barSize={40}>
                    {behaviorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="premium-card group">
          <CardHeader className="p-12 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black font-outfit text-white uppercase tracking-tight flex items-center gap-4">
                  <LineChartIcon className="w-8 h-8 text-[#00CF64]" /> Profit Flux
                </CardTitle>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Revenue velocity oscillation</p>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                <TrendingUp className="w-6 h-6 text-[#00CF64]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-12 min-h-[450px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitData}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00CF64" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00CF64" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={11} 
                    fontWeight="900"
                    tickFormatter={(v) => v.toUpperCase()}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#00CF64', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#00CF64" 
                    strokeWidth={6} 
                    fillOpacity={1} 
                    fill="url(#colorProfit)" 
                    dot={{ fill: '#00CF64', r: 8, strokeWidth: 4, stroke: '#050505' }}
                    activeDot={{ r: 10, strokeWidth: 0, fill: '#fff' }}
                  />
                </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating Strategy Insight */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
          <div className="glass-dark rounded-[2.5rem] p-6 border border-[#00CF64]/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-between px-10 gap-6">
              <div className="flex items-center gap-5">
                  <div className="w-11 h-11 bg-[#00CF64]/10 rounded-xl flex items-center justify-center text-[#00CF64] border border-[#00CF64]/20 shadow-2xl animate-pulse">
                      <Zap className="w-6 h-6 fill-[#00CF64]/20" />
                  </div>
                  <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AI Strategic Vector</p>
                      <p className="text-base font-black text-white uppercase tracking-tight">Expand Liquid Assets in Sector 4</p>
                  </div>
              </div>
              <div className="h-10 w-px bg-white/5" />
              <div className="flex items-center gap-10">
                  <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Matrix Health</p>
                      <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#00CF64] shadow-[0_0_10px_rgba(0,207,100,1)]" />
                          <p className="text-xl font-black text-white font-outfit tracking-tighter uppercase">Optimal</p>
                      </div>
                  </div>
                  <Button className="h-14 px-8 bg-white text-black hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl">Execute Sync</Button>
              </div>
          </div>
      </div>
    </div>
  );
}
