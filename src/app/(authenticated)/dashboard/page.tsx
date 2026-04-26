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
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  Globe,
  Database,
  Briefcase,
  Crown,
  BarChart2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SalesChart from "@/components/SalesChart";

async function getStats(role: string, shopId: string) {
  const isAdmin = role === "ADMIN";
  const whereClause = isAdmin ? {} : { shopId };

  const [sales, customers, lowStock, invoices, shopsCount, lowStockItems, chartInvoices, shopsList, pendingRequests, topShops] = await Promise.all([
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
      take: 6,
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
    }),
    prisma.invoice.findMany({
      where: {
        ...whereClause,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      select: {
        totalAmount: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    }),
    isAdmin ? prisma.shop.findMany({ take: 5, orderBy: { createdAt: 'desc' } }) : null,
    isAdmin ? prisma.planRequest.count({ where: { status: "PENDING" } }) : null,
    isAdmin ? prisma.invoice.groupBy({
        by: ['shopId'],
        _sum: { totalAmount: true },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 5
    }) : null
  ]);

  const dailyData: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyData[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
  }

  chartInvoices.forEach(inv => {
    const day = new Date(inv.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
    if (dailyData[day] !== undefined) {
      dailyData[day] += inv.totalAmount;
    }
  });

  const chartData = Object.entries(dailyData).map(([date, amount]) => ({ date, amount }));

  return {
    totalSales: sales._sum.totalAmount || 0,
    customerCount: customers,
    lowStockCount: lowStock,
    recentInvoices: invoices,
    shopsCount: shopsCount,
    lowStockItems: lowStockItems,
    chartData,
    shopsList,
    pendingRequests: pendingRequests || 0,
    topShops: topShops || []
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
      title: isAdmin ? "Platform Revenue" : "Total Revenue",
      value: `₹${stats.totalSales.toLocaleString()}`,
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: isAdmin ? "Registered Shops" : "Active Customers",
      value: isAdmin ? (stats.shopsCount || 0).toString() : stats.customerCount.toString(),
      trend: "up",
      icon: isAdmin ? Store : Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Stock Alert",
      value: stats.lowStockCount.toString(),
      trend: stats.lowStockCount > 0 ? "down" : "none",
      icon: Package,
      color: stats.lowStockCount > 0 ? "text-rose-500" : "text-emerald-500",
      bg: stats.lowStockCount > 0 ? "bg-rose-500/10" : "bg-emerald-500/10"
    },
    {
      title: "Active Connections",
      value: "99.9%",
      trend: "none",
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    ...(isAdmin ? [{
      title: "Pending Requests",
      value: stats.pendingRequests.toString(),
      trend: stats.pendingRequests > 0 ? "up" : "none",
      icon: Zap,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Balanced Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#00CF64]/10 rounded-lg flex items-center justify-center border border-[#00CF64]/20 shadow-lg">
              <BarChart2 className="w-4 h-4 text-[#00CF64]" />
            </div>
            <h1 className="text-xl font-black font-outfit text-white uppercase tracking-tight">Executive Dashboard</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[7px] tracking-[0.4em] ml-11">Real-time performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link href="/shops">
                <Button className="h-11 px-6 bg-white text-black hover:bg-slate-200 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-xl">
                    Manage Shops
                </Button>
            </Link>
          ) : (
            <Link href="/pos">
                <Button className="h-11 px-8 bg-[#00CF64] text-white hover:bg-[#10B981] rounded-xl font-black uppercase tracking-widest text-[11px] shadow-2xl flex gap-2">
                    <Zap className="w-4 h-4 fill-white" /> Initialize POS
                </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {statCards.map((card, i) => (
          <Card key={i} className="premium-card group relative overflow-hidden bg-[#050505] border border-white/5 transition-all duration-500 hover:border-[#00CF64]/20">
            <CardContent className="p-5 flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{card.title}</p>
                <h3 className="text-2xl font-black text-white font-outfit tracking-tighter">{card.value}</h3>
              </div>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", card.bg, card.color, "border-white/10")}>
                <card.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Analytics Hub */}
        <Card className="lg:col-span-8 bg-[#050505] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden relative group">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black font-outfit text-white uppercase tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#00CF64]" /> {isAdmin ? "Platform Volume Flux" : "Revenue Stream Dynamics"}
                </CardTitle>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">7-Day synchronization cycle</p>
              </div>
              <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00CF64] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-white/5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="min-h-[350px] p-8 pt-0">
            <SalesChart data={stats.chartData} />
          </CardContent>
        </Card>

        {/* Action Logs / New Shops */}
        <Card className="lg:col-span-4 bg-[#050505] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
          <CardHeader className="p-8 pb-4 border-b border-white/5">
             <CardTitle className="text-lg font-black font-outfit text-white uppercase tracking-tight flex items-center gap-2">
                {isAdmin ? <Globe className="w-5 h-5 text-blue-500" /> : <Clock className="w-5 h-5 text-emerald-500" />}
                {isAdmin ? "Latest Shops" : "Recent Activity"}
             </CardTitle>
             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
                {isAdmin ? "Recently registered businesses" : "Your most recent transactions"}
             </p>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
            <div className="divide-y divide-white/5">
              {isAdmin ? (
                stats.shopsList?.map((shop: any) => (
                    <div key={shop.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-black text-xs">
                                {shop.shopName?.charAt(0) || "S"}
                            </div>
                            <div>
                                <p className="text-[12px] font-black text-white uppercase tracking-tight">{shop.shopName || "Unnamed Shop"}</p>
                                <p className="text-[9px] text-slate-600 font-bold tracking-widest">{shop.phone || "No Phone"}</p>
                            </div>
                        </div>
                        <Link href={`/shops/${shop.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white">Profile</Button>
                        </Link>
                    </div>
                ))
              ) : (
                stats.recentInvoices.map((inv: any) => (
                    <div key={inv.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all group/item">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-600 group-hover/item:text-[#00CF64] transition-colors border border-white/5 shadow-inner">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[12px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">{inv.customer?.name || "Guest Client"}</p>
                                <p className="text-[9px] text-slate-600 font-bold tracking-widest mt-0.5">{inv.invoiceNumber}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-white font-outfit tracking-tighter">₹{inv.totalAmount.toLocaleString()}</p>
                            <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Verified</p>
                        </div>
                    </div>
                ))
              )}
              {((isAdmin && stats.shopsList?.length === 0) || (!isAdmin && stats.recentInvoices.length === 0)) && (
                <div className="py-20 text-center opacity-20">
                    <Database className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Registry</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-6 border-t border-white/5 bg-white/[0.01]">
              <Link href={isAdmin ? "/shops" : "/invoices"}>
                <Button variant="ghost" className="w-full h-10 bg-white/5 text-white hover:bg-white/10 hover:text-[#00CF64] rounded-xl border border-white/5 font-black uppercase tracking-widest text-[9px] transition-all">
                  {isAdmin ? "View All Systems" : "Access History Logs"}
                </Button>
              </Link>
          </div>
        </Card>
      </div>

      {/* Top Performing Shops for Admin */}
      {isAdmin && (
          <Card className="premium-card bg-[#050505] border-white/5 relative overflow-hidden flex flex-col h-[500px] mt-8">
              <CardHeader className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/20">
                          <Crown className="w-4 h-4" />
                      </div>
                      <div>
                          <CardTitle className="text-[12px] font-black text-white uppercase tracking-widest">Top Shops</CardTitle>
                          <CardDescription className="text-[9px] uppercase tracking-tighter">Highest volume business locations</CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="divide-y divide-white/5">
                      {stats.topShops.map((item: any, idx: number) => (
                          <div key={idx} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                              <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 font-black text-[10px]">
                                      #{idx + 1}
                                  </div>
                                  <div>
                                      <p className="text-[12px] font-black text-white uppercase tracking-tight">Shop ID: {item.shopId.slice(-6)}</p>
                                      <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Transaction Leader</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-[12px] font-black text-[#00CF64] font-outfit tracking-tighter">₹{item._sum.totalAmount.toLocaleString()}</p>
                                  <p className="text-[8px] text-slate-800 font-black uppercase tracking-widest">Aggregate Volume</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      )}
    </div>
  );
}

function FileText({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
    )
}
