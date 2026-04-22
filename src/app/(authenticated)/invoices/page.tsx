"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  Eye,
  Calendar,
  User,
  CreditCard,
  Loader2,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (res.ok) {
        setInvoices(data);
      }
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00CF64]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter">Transaction Ledger</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Historical audit of all generated invoices</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
            <Input 
              placeholder="Search Invoice # or Customer..." 
              className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 w-14 bg-white/5 border-white/10 text-white rounded-2xl hover:bg-white/10">
            <Filter className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <Card className="bg-[#050505] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Invoice Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Temporal Marker (Date)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Entity (Customer)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Valuation</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Protocol Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-[#00CF64] transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-white font-outfit uppercase tracking-tight">{inv.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        {format(new Date(inv.date), "dd MMM, yyyy")}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">{inv.customer?.name || "Retail Guest"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-[#00CF64] font-outfit tracking-tighter">₹{inv.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        inv.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl">
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl">
                          <Printer className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                          <Download className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInvoices.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-slate-700 bg-white/[0.01]">
              <FileText className="w-20 h-20 mb-6 opacity-20" />
              <p className="font-black uppercase tracking-[0.5em] text-xs">No records found in temporal field</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
