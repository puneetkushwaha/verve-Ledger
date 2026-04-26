"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Store,
  Zap,
  Calendar,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/plan-request");
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject', months: number = 1) => {
    setProcessing(id);
    try {
      if (action === 'approve') {
        const res = await fetch(`/api/admin/subscriptions/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ months, planType: "CUSTOM" })
        });
        if (res.ok) {
          toast.success("Subscription initialized");
          fetchRequests();
        }
      } else {
        const res = await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Request rejected");
          fetchRequests();
        }
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-40 px-4 space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center border border-[#00CF64]/20 shadow-xl">
            <Zap className="w-5 h-5 text-[#00CF64]" />
          </div>
          <h1 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">Protocol Requests</h1>
        </div>
        <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.4em] ml-14">Authorize custom subscription cycles and node permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-800 bg-[#050505] rounded-3xl border border-white/5 opacity-50">
                <FileText className="w-16 h-16 mb-4 opacity-10" />
                <p className="font-black uppercase tracking-[0.4em] text-[10px]">No pending requests</p>
            </div>
        )}

        {requests.map((req) => (
          <Card key={req.id} className={cn(
            "premium-card relative overflow-hidden bg-[#050505] border-white/5 transition-all duration-500",
            req.status === "PENDING" ? "border-amber-500/20" : "opacity-60"
          )}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 group-hover:bg-[#00CF64]/10 transition-all duration-700 blur-2xl" />
            
            <CardHeader className="p-6 border-b border-white/5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">{req.shopName}</h3>
                            <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Shop ID: {req.shopId.slice(-6)}</p>
                        </div>
                    </div>
                    <div className={cn(
                        "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                        req.status === "PENDING" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                        req.status === "APPROVED" ? "bg-[#00CF64]/10 text-[#00CF64] border-[#00CF64]/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}>
                        {req.status}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black truncate">{req.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black">{req.phone}</span>
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Transmitted Message
                    </p>
                    <p className="text-[11px] text-white font-medium leading-relaxed italic">"{req.message || "No protocol details provided."}"</p>
                </div>

                {req.status === "PENDING" && (
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Initialization Matrix</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[1, 2, 12, 24].map(m => (
                                <Button 
                                    key={m}
                                    disabled={processing === req.id}
                                    onClick={() => handleAction(req.id, 'approve', m)}
                                    className="h-9 bg-white/5 hover:bg-[#00CF64] text-white hover:text-black rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-white/5"
                                >
                                    {m < 12 ? `${m} Month${m > 1 ? 's' : ''}` : `${m/12} Year${m > 12 ? 's' : ''}`}
                                </Button>
                            ))}
                        </div>
                        <Button 
                            disabled={processing === req.id}
                            onClick={() => handleAction(req.id, 'reject')}
                            variant="ghost" 
                            className="w-full h-11 text-rose-500 hover:bg-rose-500/10 rounded-xl font-black uppercase tracking-widest text-[9px]"
                        >
                            {processing === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />} Terminate Request
                        </Button>
                    </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
