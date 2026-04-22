import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  LayoutDashboard,
  Store,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";


async function getStats(role: string, shopId: string) {
  const isAdmin = role === "ADMIN";
  
  // If admin, don't filter by shopId for global stats
  const whereClause = isAdmin ? {} : { shopId };

  const [sales, customers, lowStock, invoices, shopsCount, lowStockItems] = await Promise.all([
    prisma.invoice.aggregate({
      where: whereClause,
      _sum: { totalAmount: true }
    }),
    prisma.customer.count({ where: whereClause }),
    prisma.product.count({
      where: { 
        ...whereClause,
        stock: { lt: 10 }
      }
    }),
    prisma.invoice.findMany({
      where: whereClause,
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: true }
    }),
    isAdmin ? prisma.shop.count() : null,
    prisma.product.findMany({
      where: {
        ...whereClause,
        stock: { lt: 10 }
      },
      take: 5,
      orderBy: { stock: 'asc' }
    })
  ]);

  return {
    totalSales: sales._sum.totalAmount || 0,
    customerCount: customers,
    lowStockCount: lowStock,
    recentInvoices: invoices,
    shopsCount: shopsCount,
    lowStockItems: lowStockItems
  };
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  const userRole = (session?.user as any)?.role || "USER";
  const shopId = (session?.user as any)?.shopId || "";
  const isAdmin = userRole === "ADMIN";
  
  const stats = await getStats(userRole, shopId);

  const statCards = [
    {
      title: isAdmin ? "System Gross Yield" : "Consolidated Revenue",
      value: `₹${stats.totalSales.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: isAdmin ? ShieldCheck : TrendingUp,
      description: isAdmin ? "Global Network Revenue" : "Lifetime System Yield",
      color: "text-[#00CF64]",
      bg: "bg-[#00CF64]/10",
    },
    {
      title: isAdmin ? "Total Active Units" : "Operational Nodes",
      value: isAdmin ? stats.shopsCount?.toString() || "0" : stats.recentInvoices.length.toString(),
      change: isAdmin ? "Expanding" : "Stable",
      trend: "up",
      icon: isAdmin ? Store : Clock,
      description: isAdmin ? "Registered Business Matrix" : "Active Transaction Stream",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "User Matrix",
      value: stats.customerCount.toString(),
      change: "+4.2%",
      trend: "up",
      icon: Users,
      description: "Database Intelligence",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Inventory Variance",
      value: stats.lowStockCount.toString(),
      change: stats.lowStockCount > 0 ? "Critical" : "Optimized",
      trend: stats.lowStockCount > 0 ? "down" : "none",
      icon: Package,
      description: "Logic: Supply Replenishment",
      color: stats.lowStockCount > 0 ? "text-rose-400" : "text-[#00CF64]",
      bg: stats.lowStockCount > 0 ? "bg-rose-500/10" : "bg-[#00CF64]/10",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black font-outfit text-white tracking-tighter uppercase">
            {isAdmin ? "Global Command Center" : "Intelligence Matrix"}
          </h2>
          <p className="text-slate-500 mt-2 font-black uppercase text-[10px] tracking-widest">
            {isAdmin ? "Super Admin Access" : "Lead Architect"}: <span className="text-[#00CF64]">{(session?.user as any)?.name}</span>. 
            Matrix Status: <span className="text-[#00CF64] animate-pulse">Synchronized</span>
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 px-6 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-[11px]">System Audit</Button>
          <Button className="h-12 px-8 bg-[#00CF64] hover:bg-[#10B981] text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-[0_0_30px_rgba(0,207,100,0.2)] transition-all">
            {isAdmin ? "Global Settings" : "New Transaction"}
          </Button>
        </div>
      </div>

      {stats.lowStockItems && stats.lowStockItems.length > 0 && !isAdmin && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black font-outfit text-rose-400 uppercase tracking-tighter">Critical Stock Depletion Detected</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/60 mt-1">
                {stats.lowStockItems.length} items require immediate replenishment. Priority: High.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 relative z-10 w-full md:w-auto">
            {stats.lowStockItems.map((item: any) => (
              <span key={item.id} className="bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                {item.name} ({item.stock})
              </span>
            ))}
            <Link href="/inventory" className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center transition-colors">
              Manage Inventory
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-[#050505] border border-white/5 shadow-2xl rounded-3xl overflow-hidden group hover:border-[#00CF64]/30 transition-all duration-500 relative">
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -mr-16 -mt-16 opacity-10 transition-opacity group-hover:opacity-20", stat.bg)} />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className={stat.bg + " w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/5"}>
                  <stat.icon className={stat.color + " w-7 h-7"} />
                </div>
                {stat.trend !== "none" && (
                  <div className={cn(
                    "flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5",
                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  )}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{stat.title}</p>
                <h3 className="text-3xl font-black text-white font-outfit mt-3 tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00CF64]/50 mt-2">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00CF64]/5 blur-[120px] -mr-48 -mt-48" />
          <CardHeader className="p-10 pb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#00CF64]/10 border border-[#00CF64]/20 rounded-xl flex items-center justify-center text-[#00CF64]"><TrendingUp className="w-6 h-6" /></div>
              <CardTitle className="text-2xl font-black font-outfit text-white uppercase tracking-tight">System Revenue Telemetry</CardTitle>
            </div>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Global financial throughput analysis</p>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center bg-white/2 rounded-[3rem] m-10 mt-8 text-slate-700 font-black uppercase tracking-[0.5em] text-[11px] border border-white/5">
             <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full border-4 border-[#00CF64]/20 border-t-[#00CF64] animate-spin" />
               Visualizing Matrix Streams
             </div>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden relative">
          <CardHeader className="p-10 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-600/20 rounded-xl flex items-center justify-center text-blue-400"><Clock className="w-6 h-6" /></div>
              <CardTitle className="text-2xl font-black font-outfit text-white uppercase tracking-tight">Ledger Stream</CardTitle>
            </div>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Recent transaction protocols</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {stats.recentInvoices.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between p-8 hover:bg-white/2 transition-all cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-lg group-hover:border-[#00CF64]/50 transition-all shadow-xl">
                      {inv.customer?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-white uppercase tracking-tight">{inv.customer?.name || "Walk-in Customer"}</p>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1.5">{inv.invoiceNumber} • {new Date(inv.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white font-outfit tracking-tighter">₹{inv.total.toLocaleString()}</p>
                    <div className="inline-flex items-center gap-2 mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                       <div className="w-1 h-1 rounded-full bg-[#00CF64] shadow-[0_0_8px_rgba(0,207,100,0.8)] animate-pulse" />
                       <p className="text-[8px] uppercase font-black tracking-widest text-[#00CF64]">Verified</p>
                    </div>
                  </div>
                </div>
              ))}
              {stats.recentInvoices.length === 0 && (
                <div className="text-center py-20 text-slate-700 font-black uppercase tracking-[0.2em] text-[10px]">Matrix stream silent.</div>
              )}
            </div>
            <div className="p-10 pt-0">
              <Button variant="ghost" className="w-full h-16 mt-10 bg-white/5 text-white hover:bg-white/10 hover:text-[#00CF64] rounded-[24px] border border-white/5 font-black uppercase tracking-widest text-[11px] transition-all">
                Full Network Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
