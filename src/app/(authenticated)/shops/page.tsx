"use client";

import { useEffect, useState } from "react";
import { Store, Plus, MapPin, Phone, Mail, ChevronRight, Settings, Users, Package, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

interface Shop {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  _count: {
    products: number;
    invoices: number;
    users: number;
  };
}

export default function ShopsPage() {
  const { data: session } = useSession();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    const fetchShops = async () => {
      try {
        // If admin, fetch all shops. If owner, we'll implement owner-specific shops later.
        const endpoint = isAdmin ? "/api/admin/shops" : "/api/shops"; 
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (res.ok) {
          setShops(data);
        } else {
          toast.error(data.error || "Failed to load shops");
        }
      } catch (error) {
        toast.error("An error occurred while fetching shops");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchShops();
    }
  }, [session, isAdmin]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white font-outfit uppercase tracking-tighter">
            {isAdmin ? "Shops Control" : "Manage Your Shops"}
          </h2>
          <p className="text-slate-500 uppercase text-[7px] font-black tracking-widest mt-1">
            {isAdmin ? "Global business monitoring" : "Business Profile"}
          </p>
        </div>
        {isAdmin && (
          <Button className="bg-[#00CF64] hover:bg-[#10B981] text-white rounded-lg px-4 font-black uppercase tracking-widest text-[8px] h-9">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Shop
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {shops.map((shop) => (
          <Card 
            key={shop.id} 
            className="bg-[#050505] border border-white/5 hover:border-[#00CF64]/30 transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => router.push(`/shops/${shop.id}`)}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00CF64]/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:bg-[#00CF64]/10 transition-colors" />
            
            <CardContent className="p-3 flex items-center justify-between relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 border border-white/5 group-hover:border-[#00CF64]/20 transition-all">
                  <Store className="w-5 h-5" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white font-outfit uppercase tracking-tighter">{shop.name}</h3>
                    <Badge className="bg-emerald-500/10 text-[#00CF64] border border-[#00CF64]/20 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#00CF64]" /> {shop.address || "No Address"}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#00CF64]" /> {shop.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex gap-4 border-r border-white/5 pr-6">
                  <div className="text-center">
                    <p className="text-[7px] text-slate-600 uppercase font-black tracking-widest">Inv</p>
                    <p className="text-sm font-black text-white">{shop._count.invoices}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] text-slate-600 uppercase font-black tracking-widest">Users</p>
                    <p className="text-sm font-black text-white">{shop._count.users}</p>
                  </div>
                </div>
                  <div className="text-center">
                    <p className="text-[7px] text-slate-600 uppercase font-black tracking-widest">Staff</p>
                    <p className="text-sm font-black text-white">{shop._count.users}</p>
                  </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-600 hover:text-[#00CF64] hover:bg-[#00CF64]/10 rounded-lg border border-white/5 transition-all">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-[#00CF64] bg-[#00CF64]/5 hover:bg-[#00CF64] hover:text-white rounded-lg border border-[#00CF64]/20 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && shops.length === 0 && (
        <div className="bg-[#050505] border border-dashed border-white/10 rounded-[32px] p-20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-slate-700 mx-auto mb-8 border border-white/5">
            <Store className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter mb-2">Matrix Empty</h3>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">No shops have been registered in the system yet.</p>
        </div>
      )}
    </div>
  );
}
