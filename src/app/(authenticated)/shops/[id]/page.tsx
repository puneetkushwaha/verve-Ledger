"use client";

import { useEffect, useState } from "react";
import { 
  Store, 
  Package, 
  FileText, 
  Users, 
  ArrowLeft, 
  TrendingUp, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ShopDetails {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  products: any[];
  invoices: any[];
  users: any[];
  _count: {
    products: number;
    invoices: number;
    users: number;
  };
}

export default function ShopDetailPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<ShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const res = await fetch(`/api/admin/shops/${params.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setShop(data);
        } else {
          toast.error(data.error || "Failed to load shop details");
          router.push("/shops");
        }
      } catch (error) {
        toast.error("An error occurred while fetching shop details");
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CF64]"></div>
      </div>
    );
  }

  if (!shop) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Button 
          variant="ghost" 
          className="w-fit text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]"
          onClick={() => router.push("/shops")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Matrix
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center text-[#00CF64] border border-white/5 shadow-2xl">
              <Store className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-black text-white font-outfit uppercase tracking-tighter">{shop.name}</h1>
                <Badge className="bg-emerald-500/10 text-[#00CF64] border border-[#00CF64]/20 px-4 py-1 text-[11px] font-black uppercase tracking-widest">
                  Enterprise Unit
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#00CF64]" /> {shop.address}</span>
                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#00CF64]" /> {shop.phone}</span>
                <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#00CF64]" /> {shop.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Admin Subscription Management */}
      <Card className="bg-[#050505] border border-[#00CF64]/20 rounded-[32px] overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00CF64]/5 blur-[80px] -mr-32 -mt-32" />
        <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-4">
              <Crown className="w-6 h-6 text-[#00CF64]" />
              <CardTitle className="text-2xl font-black font-outfit text-white uppercase tracking-tight">Subscription Management</CardTitle>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Matrix License Control</p>
          </div>
          <Badge className="bg-[#00CF64]/10 text-[#00CF64] border border-[#00CF64]/20 px-4 py-2 text-[12px] font-black uppercase">
            Current Plan: {(shop as any).plan || "FREE"}
          </Badge>
        </CardHeader>
        <CardContent className="p-10 pt-8 relative z-10">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const plan = formData.get("plan");
            const expiryMonths = formData.get("months");
            const expiryYears = formData.get("years");
            
            try {
              const res = await fetch(`/api/admin/shops/${shop.id}/plan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan, expiryMonths, expiryYears })
              });
              if (res.ok) {
                toast.success("Subscription updated successfully!");
                window.location.reload();
              } else {
                toast.error("Update failed");
              }
            } catch (e) {
              toast.error("Error occurred");
            }
          }}>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Select Plan</label>
              <select name="plan" className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-[12px] font-black uppercase outline-none focus:border-[#00CF64]/50 transition-all appearance-none">
                <option value="FREE">Starter (Free)</option>
                <option value="MONTHLY">Business Pro (Monthly)</option>
                <option value="YEARLY">Enterprise (Yearly)</option>
                <option value="CUSTOM">Custom Matrix</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Add Months</label>
              <Input name="months" type="number" placeholder="0" className="h-14 bg-white/5 border-white/5 rounded-2xl text-white placeholder:text-slate-700 font-black" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Add Years</label>
              <Input name="years" type="number" placeholder="0" className="h-14 bg-white/5 border-white/5 rounded-2xl text-white placeholder:text-slate-700 font-black" />
            </div>
            <Button type="submit" className="h-14 bg-[#00CF64] hover:bg-[#10B981] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-[0_0_30px_rgba(0,207,100,0.2)]">
              Authorize Upgrade
            </Button>
          </form>
          
          {(shop as any).planExpiry && (
            <div className="mt-8 flex items-center gap-3 bg-white/2 border border-white/5 w-fit px-6 py-3 rounded-xl">
              <Calendar className="w-4 h-4 text-[#00CF64]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                License Expiry: <span className="text-white ml-2">{new Date((shop as any).planExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Assets", value: shop._count.products, icon: Package, color: "text-blue-400" },
          { label: "Operations", value: shop._count.invoices, icon: FileText, color: "text-emerald-400" },
          { label: "Matrix Staff", value: shop._count.users, icon: Users, color: "text-purple-400" },
          { label: "Uptime Sync", value: "99.9%", icon: ShieldCheck, color: "text-[#00CF64]" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#050505] border border-white/5 rounded-[24px] overflow-hidden relative group">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-10`} />
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-slate-700" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white font-outfit tracking-tighter">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <Card className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-white font-outfit uppercase tracking-tighter">Recent Inventory Matrix</CardTitle>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Live asset tracking</p>
            </div>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#00CF64] hover:bg-[#00CF64]/10">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">Asset Name</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">Category</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">Stock</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-600">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {shop.products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-6 font-black text-white text-sm uppercase tracking-tighter">{product.name}</td>
                      <td className="p-6">
                        <Badge variant="outline" className="text-[10px] font-black uppercase border-white/10 text-slate-500">
                          {product.category || "General"}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <span className={`text-sm font-black ${product.stock > 10 ? 'text-[#00CF64]' : 'text-orange-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-6 font-black text-white text-sm tracking-tighter">₹{product.price.toLocaleString()}</td>
                    </tr>
                  ))}
                  {shop.products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-600 font-black uppercase text-[10px] tracking-widest">
                        No assets registered in inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="bg-[#050505] border border-white/5 rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-black text-white font-outfit uppercase tracking-tighter">Transaction Logs</CardTitle>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Real-time revenue stream</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {shop.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-[#00CF64]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00CF64]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-tighter">{invoice.invoiceNumber}</p>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{invoice.customer?.name || "Guest Client"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#00CF64] tracking-tighter">₹{invoice.total.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Confirmed</p>
                  </div>
                </div>
              ))}
              {shop.invoices.length === 0 && (
                <div className="py-10 text-center text-slate-700 font-black uppercase text-[10px] tracking-widest">
                  No transaction data.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
